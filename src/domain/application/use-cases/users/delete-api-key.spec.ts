import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import { makeUser } from '@test/factories/make-user.ts'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository.ts'
import { describe, expect, it } from 'vitest'
import { DeleteApiKeyUseCase } from './delete-api-key.ts'

describe('delete api key', () => {
  it('should be able to delete api key', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const deleteApiKeyUseCase = new DeleteApiKeyUseCase(inMemoryUsersRepository)

    const domainUser = await makeUser({
      apiKeyHash: 'api-key-hash',
    })

    await inMemoryUsersRepository.create(domainUser)

    await deleteApiKeyUseCase.execute({
      userId: domainUser.id.toString(),
    })

    expect(inMemoryUsersRepository.users[0].apiKeyHash).toBeNull()
  })

  it('should not be able to delete api key because user not exists', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const deleteApiKeyUseCase = new DeleteApiKeyUseCase(inMemoryUsersRepository)

    const domainUser = await makeUser()

    await expect(
      deleteApiKeyUseCase.execute({
        userId: domainUser.id.toString(),
      })
    ).rejects.toThrow(UnauthorizedError)
  })
})
