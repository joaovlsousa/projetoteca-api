import { UniqueEntityID } from '@core/entities/unique-entity-id.ts'
import { User } from '@domain/entities/user.ts'
import type { usersTable } from '../schema.ts'

type RawUser = typeof usersTable.$inferSelect

export class DrizzleUsersMapper {
  static toDrizzle(user: User): RawUser {
    return {
      id: user.id.toString(),
      name: user.name,
      githubId: user.githubId,
      githubHashedAccessToken: user.githubHashedAccessToken,
      username: user.username,
      isPublicProfile: user.isPublicProfile,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt ?? null,
    }
  }

  static toDomain(raw: RawUser): User {
    return User.create(
      {
        name: raw.name,
        githubId: raw.githubId,
        githubHashedAccessToken: raw.githubHashedAccessToken,
        username: raw.username,
        isPublicProfile: raw.isPublicProfile ?? false,
        avatarUrl: raw.avatarUrl,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    )
  }
}
