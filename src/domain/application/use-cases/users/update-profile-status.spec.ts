import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import { makeUser } from '@test/factories/make-user.ts'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository.ts'
import { describe, expect, it } from 'vitest'
import { UpdateProfileStatusUseCase } from './update-profile-status.ts'

describe('update profile status', () => {
  it('should be able to update profile status', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const updateProfileStatusUseCase = new UpdateProfileStatusUseCase(
      inMemoryUsersRepository
    )

    const domainUser = await makeUser()

    await inMemoryUsersRepository.create(domainUser)

    await updateProfileStatusUseCase.execute({
      userId: domainUser.id.toString(),
      isPublicProfile: true,
    })

    expect(inMemoryUsersRepository.users[0].isPublicProfile).true
  })

  it('should not be able to update profile status because user not exists', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const updateProfileStatusUseCase = new UpdateProfileStatusUseCase(
      inMemoryUsersRepository
    )

    const domainUser = await makeUser()

    await expect(
      updateProfileStatusUseCase.execute({
        userId: domainUser.id.toString(),
        isPublicProfile: true,
      })
    ).rejects.toThrow(UnauthorizedError)
  })
})
