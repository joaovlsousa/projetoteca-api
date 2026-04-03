import type { TechsRespository } from '@domain/application/repositories/techs-repository.ts'
import type { Tech } from '@domain/entities/tech.ts'
import { asc, eq, inArray } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { dbClient } from '../client.ts'
import { DrizzleTechsMapper } from '../mappers/drizzle-techs-mapper.ts'
import { techsTable } from '../schema.ts'

export class DrizzleTechsRepository implements TechsRespository {
  private readonly db: NodePgDatabase

  constructor() {
    this.db = dbClient
  }

  async getAll(): Promise<Tech[]> {
    const raw = await this.db
      .select()
      .from(techsTable)
      .orderBy(asc(techsTable.name))

    return raw.map(DrizzleTechsMapper.toDomain)
  }

  async getManyByIdList(techsIds: string[]): Promise<Tech[]> {
    const raw = await this.db
      .select()
      .from(techsTable)
      .where(inArray(techsTable.id, techsIds))
      .orderBy(asc(techsTable.name))

    return raw.map(DrizzleTechsMapper.toDomain)
  }

  async getOneByName(name: string): Promise<Tech | null> {
    const [raw] = await this.db
      .select()
      .from(techsTable)
      .where(eq(techsTable.name, name))

    if (!raw) {
      return null
    }

    return DrizzleTechsMapper.toDomain(raw)
  }

  async create(tech: Tech): Promise<void> {
    const raw = DrizzleTechsMapper.toDrizzle(tech)

    await this.db.insert(techsTable).values(raw)
  }

  async delete(techId: string): Promise<void> {
    await this.db.delete(techsTable).where(eq(techsTable.id, techId))
  }
}
