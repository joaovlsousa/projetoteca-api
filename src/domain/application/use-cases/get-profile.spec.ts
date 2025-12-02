import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import { makeUser } from '@test/factories/make-user.ts'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository.ts'
import { describe, expect, it } from 'vitest'
import { GetProfileUseCase } from './get-profile.ts'

describe('get profile', () => {
  it('should be able to get user profile', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const getProfileUseCase = new GetProfileUseCase(inMemoryUsersRepository)

    const domainUser = makeUser()

    await inMemoryUsersRepository.create(domainUser)

    const { user } = await getProfileUseCase.execute({
      userId: domainUser.id.toString(),
    })

    expect(user).toBeTruthy()
  })

  it('should not be able to get user profile', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const getProfileUseCase = new GetProfileUseCase(inMemoryUsersRepository)

    const domainUser = makeUser()

    await expect(
      getProfileUseCase.execute({
        userId: domainUser.id.toString(),
      })
    ).rejects.toThrow(UnauthorizedError)
  })
})
