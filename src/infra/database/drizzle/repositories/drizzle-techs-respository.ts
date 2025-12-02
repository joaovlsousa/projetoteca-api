import type { TechsRespository } from '@domain/application/repositories/techs-repository.ts'
import type { Tech } from '@domain/enterprise/entities/tech.ts'
import { asc, eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { dbClient } from '../client.ts'
import { DrizzleTechsMapper } from '../mappers/drizzle-techs-mapper.ts'
import { techsTable } from '../schema.ts'

export class DrizzleTechsRepository implements TechsRespository {
  private readonly db: NodePgDatabase

  constructor() {
    this.db = dbClient
  }

  async findAll(): Promise<Tech[]> {
    const techs = await this.db
      .select()
      .from(techsTable)
      .orderBy(asc(techsTable.name))

    return techs.map(DrizzleTechsMapper.toDomain)
  }

  async create(tech: Tech): Promise<void> {
    const raw = DrizzleTechsMapper.toDrizzle(tech)

    await this.db.insert(techsTable).values(raw)
  }

  async delete(techId: string): Promise<void> {
    await this.db.delete(techsTable).where(eq(techsTable.id, techId))
  }
}
