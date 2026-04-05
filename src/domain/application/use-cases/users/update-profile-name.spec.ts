import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import { makeUser } from '@test/factories/make-user.ts'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository.ts'
import { describe, expect, it } from 'vitest'
import { UpdateProfileNameUseCase } from './update-profile-name.ts'

describe('update profile name', () => {
  it('should be able to update user name', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const updateProfileNameUseCase = new UpdateProfileNameUseCase(
      inMemoryUsersRepository
    )

    const domainUser = await makeUser()

    await inMemoryUsersRepository.create(domainUser)

    await updateProfileNameUseCase.execute({
      userId: domainUser.id.toString(),
      name: 'Updated name',
    })

    expect(inMemoryUsersRepository.users[0].name).toEqual('Updated name')
  })

  it('should not be able to update profile status because user not exists', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const updateProfileNameUseCase = new UpdateProfileNameUseCase(
      inMemoryUsersRepository
    )

    const domainUser = await makeUser()

    await expect(
      updateProfileNameUseCase.execute({
        userId: domainUser.id.toString(),
        name: 'Updated name',
      })
    ).rejects.toThrow(UnauthorizedError)
  })
})
