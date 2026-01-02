import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import { faker } from '@faker-js/faker'
import { makeUser } from '@test/factories/make-user.ts'
import { InMemoryTechsRepository } from '@test/repositories/in-memory-techs-repository.ts'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository.ts'
import { TestOAuthService } from '@test/services/test-oauth-service.ts'
import { describe, expect, it } from 'vitest'
import { GetRepositoryData } from './get-repository-data.ts'

describe('get repository data', () => {
  it('should be able to get repository data', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const inMemoryTechsRepository = new InMemoryTechsRepository()

    const getRepositoryData = new GetRepositoryData(
      inMemoryUsersRepository,
      inMemoryTechsRepository,
      new TestOAuthService()
    )

    const domainUser = await makeUser()

    await inMemoryUsersRepository.create(domainUser)

    const { repository } = await getRepositoryData.execute({
      userId: domainUser.id.toString(),
      repositorySlug: faker.lorem.slug(),
    })

    expect(repository).toBeTruthy()
  })

  it('should not be able to get repository data', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const inMemoryTechsRepository = new InMemoryTechsRepository()

    const getRepositoryData = new GetRepositoryData(
      inMemoryUsersRepository,
      inMemoryTechsRepository,
      new TestOAuthService()
    )

    const domainUser = await makeUser()

    await expect(
      getRepositoryData.execute({
        userId: domainUser.id.toString(),
        repositorySlug: faker.lorem.slug(),
      })
    ).rejects.toThrow(UnauthorizedError)
  })
})
