import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import { makeUser } from '@test/factories/make-user.ts'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository.ts'
import { describe, expect, it } from 'vitest'
import { UpdatePublicProfileUseCase } from './update-public-profile.ts'

describe('update public profile', () => {
  it('should be able to update public profile', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const updatePublicProfileUseCase = new UpdatePublicProfileUseCase(
      inMemoryUsersRepository
    )

    const domainUser = await makeUser()

    await inMemoryUsersRepository.create(domainUser)

    await updatePublicProfileUseCase.execute({
      userId: domainUser.id.toString(),
      isPublicProfile: true,
    })

    expect(inMemoryUsersRepository.users[0].isPublicProfile).true
  })

  it('should not be able to update public profile because user not exists', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const updatePublicProfileUseCase = new UpdatePublicProfileUseCase(
      inMemoryUsersRepository
    )

    const domainUser = await makeUser()

    await expect(
      updatePublicProfileUseCase.execute({
        userId: domainUser.id.toString(),
        isPublicProfile: true,
      })
    ).rejects.toThrow(UnauthorizedError)
  })
})
