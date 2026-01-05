import { ForbiddenError } from '@core/errors/forbidden-error.ts'
import { NotFoundError } from '@core/errors/not-found-error.ts'
import { makeProject } from '@test/factories/make-project.ts'
import { makeUser } from '@test/factories/make-user.ts'
import { InMemoryProjectsRepository } from '@test/repositories/in-memory-projects-repository.ts'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { FindProjectsByUsernameUseCase } from './find-projects-by-username.ts'

describe('find projects by username', () => {
  let inMemoryUsersRepository: InMemoryUsersRepository
  let inMemoryProjectsRepository: InMemoryProjectsRepository
  let findProjectsByUsernameUseCase: FindProjectsByUsernameUseCase

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryProjectsRepository = new InMemoryProjectsRepository()

    findProjectsByUsernameUseCase = new FindProjectsByUsernameUseCase(
      inMemoryUsersRepository,
      inMemoryProjectsRepository
    )
  })

  it('should be able find projects by username', async () => {
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

    const { projects } = await findProjectsByUsernameUseCase.execute({
      username: user.username,
    })

    expect(projects).toHaveLength(4)
  })

  it('should not be able find projects because user profile is private', async () => {
    const user = await makeUser()
    await inMemoryUsersRepository.create(user)

    expect(
      findProjectsByUsernameUseCase.execute({
        username: user.username,
      })
    ).rejects.toThrow(ForbiddenError)
  })

  it('should not be able find projects because user not exists', async () => {
    expect(
      findProjectsByUsernameUseCase.execute({
        username: 'username',
      })
    ).rejects.toThrow(NotFoundError)
  })
})
