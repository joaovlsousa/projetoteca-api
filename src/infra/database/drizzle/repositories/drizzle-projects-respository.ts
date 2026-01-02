import type {
  GetMetadataByUserIdResponse,
  ProjectsRespository,
} from '@domain/application/repositories/projects-repository.ts'
import type { Project } from '@domain/entities/project.ts'
import { count, desc, eq, sql, sum } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { dbClient } from '../client.ts'
import { DrizzleProjectsMapper } from '../mappers/drizzle-projects-mapper.ts'
import { projectsTable, projectTechTable, techsTable } from '../schema.ts'

export class DrizzleProjectsRepository implements ProjectsRespository {
  private readonly db: NodePgDatabase

  constructor() {
    this.db = dbClient
  }

  async findById(projectId: string): Promise<Project | null> {
    const [rawProject] = await this.db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.id, projectId))

    if (!rawProject) {
      return null
    }

    const rawTechs = await this.db
      .select({
        id: techsTable.id,
        name: techsTable.name,
        imageUrl: techsTable.imageUrl,
        imageId: techsTable.imageId,
        createdAt: techsTable.createdAt,
        updatedAt: techsTable.updatedAt,
      })
      .from(projectTechTable)
      .innerJoin(techsTable, eq(projectTechTable.techId, techsTable.id))
      .where(eq(projectTechTable.projectId, rawProject.id))

    const raw = {
      rawProject,
      rawTechs,
    }

    return DrizzleProjectsMapper.toDomain(raw)
  }

  async getMetadataByUserId(
    userId: string
  ): Promise<GetMetadataByUserIdResponse> {
    const [{ countProjects, countStorageInBytes }] = await this.db
      .select({
        countProjects: count(),
        countStorageInBytes: sum(projectsTable.imageSizeInBytes),
      })
      .from(projectsTable)
      .where(eq(projectsTable.userId, userId))

    const metadata = {
      countProjects,
      countStorageInBytes: Number(countStorageInBytes ?? 0),
    }

    return {
      metadata,
    }
  }

  async findByUserId(userId: string): Promise<Project[]> {
    const raw = await this.db
      .select({
        rawProject: {
          id: projectsTable.id,
          name: projectsTable.name,
          description: projectsTable.description,
          type: projectsTable.type,
          userId: projectsTable.userId,
          githubUrl: projectsTable.githubUrl,
          deployUrl: projectsTable.deployUrl,
          imageUrl: projectsTable.imageUrl,
          imageId: projectsTable.imageId,
          imageSizeInBytes: projectsTable.imageSizeInBytes,
          createdAt: projectsTable.createdAt,
          updatedAt: projectsTable.updatedAt,
        },
        rawTechs: sql<(typeof techsTable.$inferSelect)[]>`
          coalesce(
            json_agg(
              json_build_object(
                'id', ${techsTable.id},
                'name', ${techsTable.name},
                'imageUrl', ${techsTable.imageUrl},
                'imageId', ${techsTable.imageId},
                'createdAt', ${techsTable.createdAt},
                'updatedAt', ${techsTable.updatedAt}
              )
            ) filter (where ${techsTable.id} is not null),
            '[]'
          )
        `.as('rawTechs'),
      })
      .from(projectsTable)
      .leftJoin(
        projectTechTable,
        eq(projectsTable.id, projectTechTable.projectId)
      )
      .leftJoin(techsTable, eq(projectTechTable.techId, techsTable.id))
      .where(eq(projectsTable.userId, userId))
      .groupBy(
        projectsTable.id,
        projectsTable.name,
        projectsTable.description,
        projectsTable.type,
        projectsTable.userId,
        projectsTable.githubUrl,
        projectsTable.deployUrl,
        projectsTable.imageUrl,
        projectsTable.imageId,
        projectsTable.imageSizeInBytes,
        projectsTable.createdAt,
        projectsTable.updatedAt
      )
      .orderBy(desc(projectsTable.createdAt))

    return raw.map(DrizzleProjectsMapper.toDomain)
  }

  async save(project: Project): Promise<void> {
    const { rawProject, rawTechs } = DrizzleProjectsMapper.toDrizzle(project)

    await this.db.transaction(async (tx) => {
      await tx
        .update(projectsTable)
        .set(rawProject)
        .where(eq(projectsTable.id, rawProject.id))

      await tx
        .delete(projectTechTable)
        .where(eq(projectTechTable.projectId, rawProject.id))

      await tx.insert(projectTechTable).values(
        rawTechs.map((rawTech) => ({
          projectId: rawProject.id,
          techId: rawTech.id,
        }))
      )
    })
  }

  async create(project: Project): Promise<void> {
    const { rawProject, rawTechs } = DrizzleProjectsMapper.toDrizzle(project)

    await this.db.transaction(async (tx) => {
      await tx.insert(projectsTable).values(rawProject)

      await tx.insert(projectTechTable).values(
        rawTechs.map((rawTech) => ({
          projectId: rawProject.id,
          techId: rawTech.id,
        }))
      )
    })
  }

  async delete(projectId: string): Promise<void> {
    await this.db.delete(projectsTable).where(eq(projectsTable.id, projectId))
  }
}
