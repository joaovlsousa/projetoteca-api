import { ForbiddenError } from '@core/errors/forbidden-error.ts'
import { NotFoundError } from '@core/errors/not-found-error.ts'
import { HashService } from '@core/services/hash-service.ts'
import { faker } from '@faker-js/faker'
import { makeProject } from '@test/factories/make-project.ts'
import { makeUser } from '@test/factories/make-user.ts'
import { InMemoryProjectsRepository } from '@test/repositories/in-memory-projects-repository.ts'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetProjectsByUsernameUseCase } from './get-projects-by-username.ts'

describe('get projects by username', () => {
  let inMemoryUsersRepository: InMemoryUsersRepository
  let inMemoryProjectsRepository: InMemoryProjectsRepository
  let getProjectsByUsernameUseCase: GetProjectsByUsernameUseCase

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryProjectsRepository = new InMemoryProjectsRepository()

    getProjectsByUsernameUseCase = new GetProjectsByUsernameUseCase(
      inMemoryUsersRepository,
      inMemoryProjectsRepository
    )
  })

  it('should be able get projects by username', async () => {
    const user = await makeUser({
      isPublicProfile: true,
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

    const { projects } = await getProjectsByUsernameUseCase.execute({
      username: user.username,
      apiKeyHash: null,
    })

    expect(projects).toHaveLength(4)
  })

  it('should be able get projects by username with portfolio connected', async () => {
    const user = await makeUser({
      apiKeyHash: await HashService.hash(faker.internet.url()),
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

    const { projects } = await getProjectsByUsernameUseCase.execute({
      username: user.username,
      apiKeyHash: user.apiKeyHash ?? null,
    })

    expect(projects).toHaveLength(4)
  })

  it('should not be able get projects because user profile is private', async () => {
    const user = await makeUser()
    await inMemoryUsersRepository.create(user)

    expect(
      getProjectsByUsernameUseCase.execute({
        username: user.username,
        apiKeyHash: null,
      })
    ).rejects.toThrow(ForbiddenError)
  })

  it('should not be able get projects because user not exists', async () => {
    expect(
      getProjectsByUsernameUseCase.execute({
        username: 'username',
        apiKeyHash: null,
      })
    ).rejects.toThrow(NotFoundError)
  })
})
