import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import { makeUser } from '@test/factories/make-user.ts'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository.ts'
import { TestOAuthService } from '@test/services/test-oauth-service.ts'
import { describe, expect, it } from 'vitest'
import { GetUserRepositories } from './get-user-repositories.ts'

describe('get user repositories', () => {
  it('should be able to get user repositories', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const getUserRepositories = new GetUserRepositories(
      inMemoryUsersRepository,
      new TestOAuthService()
    )

    const domainUser = await makeUser()

    await inMemoryUsersRepository.create(domainUser)

    const { repositories } = await getUserRepositories.execute({
      userId: domainUser.id.toString(),
    })

    expect(repositories).toHaveLength(5)
  })

  it('should not be able to get user repositories', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const getUserRepositories = new GetUserRepositories(
      inMemoryUsersRepository,
      new TestOAuthService()
    )

    const domainUser = await makeUser()

    await expect(
      getUserRepositories.execute({
        userId: domainUser.id.toString(),
      })
    ).rejects.toThrow(UnauthorizedError)
  })
})
