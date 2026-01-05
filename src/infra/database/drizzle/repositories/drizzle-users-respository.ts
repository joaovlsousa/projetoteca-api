import type { UsersRespository } from '@domain/application/repositories/users-repository.ts'
import type { User } from '@domain/entities/user.ts'
import { eq } from 'drizzle-orm'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { dbClient } from '../client.ts'
import { DrizzleUsersMapper } from '../mappers/drizzle-users-mapper.ts'
import { usersTable } from '../schema.ts'

export class DrizzleUsersRepository implements UsersRespository {
  private readonly db: NodePgDatabase

  constructor() {
    this.db = dbClient
  }

  async create(user: User): Promise<void> {
    const raw = DrizzleUsersMapper.toDrizzle(user)

    await this.db.insert(usersTable).values(raw)
  }

  async save(user: User): Promise<void> {
    const raw = DrizzleUsersMapper.toDrizzle(user)

    await this.db.update(usersTable).set(raw).where(eq(usersTable.id, raw.id))
  }

  async findByGithubId(githubId: number): Promise<User | null> {
    const [raw] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.githubId, githubId))

    if (!raw) {
      return null
    }

    return DrizzleUsersMapper.toDomain(raw)
  }

  async findById(userId: string): Promise<User | null> {
    const [raw] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1)

    if (!raw) {
      return null
    }

    return DrizzleUsersMapper.toDomain(raw)
  }

  async findByUsername(username: string): Promise<User | null> {
    const [raw] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .limit(1)

    if (!raw) {
      return null
    }

    return DrizzleUsersMapper.toDomain(raw)
  }
}
