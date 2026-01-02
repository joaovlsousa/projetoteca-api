import { UniqueEntityID } from '@core/entities/unique-entity-id.ts'
import { Description } from '@domain/entities/description.ts'
import { Name } from '@domain/entities/name.ts'
import { Project } from '@domain/entities/project.ts'
import { Tech } from '@domain/entities/tech.ts'
import type { projectsTable, techsTable } from '../schema.ts'

interface RawProject {
  rawProject: typeof projectsTable.$inferSelect
  rawTechs: (typeof techsTable.$inferSelect)[]
}

export class DrizzleProjectsMapper {
  static toDrizzle(project: Project): RawProject {
    return {
      rawProject: {
        id: project.id.toString(),
        name: project.name.toString(),
        description: project.description.toString(),
        type: project.type,
        userId: project.userId.toString(),
        imageId: project.imageId ?? null,
        imageUrl: project.imageUrl ?? null,
        imageSizeInBytes: project.imageSizeInBytes ?? null,
        githubUrl: project.githubUrl,
        deployUrl: project.deployUrl ?? null,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt ?? null,
      },
      rawTechs: project.techs.map((tech) => ({
        id: tech.id.toString(),
        name: tech.name,
        imageId: tech.imageId,
        imageUrl: tech.imageUrl,
        createdAt: tech.createdAt,
        updatedAt: tech.updatedAt ?? null,
      })),
    }
  }

  static toDomain({ rawProject, rawTechs }: RawProject): Project {
    return Project.create(
      {
        name: new Name(rawProject.name),
        description: new Description(rawProject.description),
        userId: new UniqueEntityID(rawProject.userId),
        techs: rawTechs.map((rawTech) =>
          Tech.create(
            {
              name: rawTech.name,
              imageId: rawTech.imageId,
              imageUrl: rawTech.imageUrl,
              createdAt: rawTech.createdAt,
              updatedAt: rawTech.updatedAt,
            },
            new UniqueEntityID(rawTech.id)
          )
        ),
        type: rawProject.type,
        imageId: rawProject.imageId,
        imageUrl: rawProject.imageUrl,
        imageSizeInBytes: rawProject.imageSizeInBytes,
        githubUrl: rawProject.githubUrl,
        deployUrl: rawProject.deployUrl,
        createdAt: rawProject.createdAt,
        updatedAt: rawProject.updatedAt,
      },
      new UniqueEntityID(rawProject.id)
    )
  }
}
