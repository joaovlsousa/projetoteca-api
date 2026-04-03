import type { UniqueEntityID } from '@core/entities/unique-entity-id.ts'
import { HashService } from '@core/services/hash-service.ts'
import { User, type UserProps } from '@domain/entities/user.ts'
import { fakerPT_BR as faker } from '@faker-js/faker'

export async function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID
): Promise<User> {
  const user = User.create(
    {
      name: faker.person.fullName(),
      githubId: faker.number.int(),
      githubAccessTokenHash: await HashService.hash(faker.string.uuid()),
      username: faker.internet.username(),
      avatarUrl: faker.image.avatarGitHub(),
      ...override,
    },
    id
  )

  return user
}
