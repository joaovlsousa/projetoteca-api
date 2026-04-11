import { ForbiddenError } from '@core/errors/forbidden-error.ts'
import { HashService } from '@core/services/hash-service.ts'
import { makeProject } from '@test/factories/make-project.ts'
import { makeUser } from '@test/factories/make-user.ts'
import { InMemoryProjectsRepository } from '@test/repositories/in-memory-projects-repository.ts'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetProjectsByUsernameAndApiKeyUseCase } from './get-projects-by-username-and-api-key.ts'

describe('get projects by username and api key', () => {
  let inMemoryUsersRepository: InMemoryUsersRepository
  let inMemoryProjectsRepository: InMemoryProjectsRepository
  let getProjectsByUsernameAndApiKeyUseCase: GetProjectsByUsernameAndApiKeyUseCase

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryProjectsRepository = new InMemoryProjectsRepository()

    getProjectsByUsernameAndApiKeyUseCase =
      new GetProjectsByUsernameAndApiKeyUseCase(
        inMemoryUsersRepository,
        inMemoryProjectsRepository
      )
  })

  it('should be able get projects by username if is public profile', async () => {
    const domainUser = await makeUser({
      isPublicProfile: true,
    })

    await inMemoryUsersRepository.create(domainUser)

    for (let i = 0; i < 8; i++) {
      i % 2 === 0
        ? await inMemoryProjectsRepository.create(
            makeProject({
              userId: domainUser.id,
            })
          )
        : await inMemoryProjectsRepository.create(makeProject())
    }

    const { projects, user } =
      await getProjectsByUsernameAndApiKeyUseCase.execute({
        username: domainUser.username,
        apiKey: null,
      })

    expect(projects).toHaveLength(4)
    expect(user).toEqual(domainUser)
  })

  it('should be able get projects by username with api key', async () => {
    const user = await makeUser({
      apiKeyHash: await HashService.hash('api-key'),
    })

    await inMemoryUsersRepository.create(user)

    for (let i = 0; i < 8; i++) {
      i % 2 === 0
        ? await inMemoryProjectsRepository.create(
            makeProject({
              userId: user.id,
            })
          )
        : await inMemoryProjectsRepository.create(makeProject())
    }

    const { projects } = await getProjectsByUsernameAndApiKeyUseCase.execute({
      username: user.username,
      apiKey: 'api-key',
    })

    expect(projects).toHaveLength(4)
  })

  it('should not be able get projects because is private profile', async () => {
    const user = await makeUser()
    await inMemoryUsersRepository.create(user)

    expect(
      getProjectsByUsernameAndApiKeyUseCase.execute({
        username: user.username,
        apiKey: null,
      })
    ).rejects.toThrow(ForbiddenError)
  })

  it('should not be able get projects because api key not exists', async () => {
    const user = await makeUser()
    await inMemoryUsersRepository.create(user)

    expect(
      getProjectsByUsernameAndApiKeyUseCase.execute({
        username: user.username,
        apiKey: 'api-key',
      })
    ).rejects.toThrow(ForbiddenError)
  })

  it('should not be able get projects because invalid api key', async () => {
    const user = await makeUser({
      apiKeyHash: await HashService.hash('api-key'),
    })
    await inMemoryUsersRepository.create(user)

    expect(
      getProjectsByUsernameAndApiKeyUseCase.execute({
        username: user.username,
        apiKey: 'invalid-api-key',
      })
    ).rejects.toThrow(ForbiddenError)
  })
})
