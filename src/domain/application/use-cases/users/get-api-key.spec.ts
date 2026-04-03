import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import { makeUser } from '@test/factories/make-user.ts'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository.ts'
import { describe, expect, it } from 'vitest'
import { GenerateApiKeyUseCase } from './generate-api-key.ts'
import { GetApiKeyUseCase } from './get-api-key.ts'

describe('get api key', () => {
  it('should be able to get api key', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const getApiKeyUseCase = new GetApiKeyUseCase(inMemoryUsersRepository)
    const generateApiKeyUseCase = new GenerateApiKeyUseCase(
      inMemoryUsersRepository
    )

    const domainUser = await makeUser()

    await inMemoryUsersRepository.create(domainUser)
    await generateApiKeyUseCase.execute({
      userId: domainUser.id.toString(),
    })

    const { apiKey } = await getApiKeyUseCase.execute({
      userId: domainUser.id.toString(),
    })

    expect(apiKey).toBeTruthy()
    expect(inMemoryUsersRepository.users[0].apiKeyHash).toBeTruthy()
  })

  it('should not be able to get api key because it must be null', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const getApiKeyUseCase = new GetApiKeyUseCase(inMemoryUsersRepository)

    const domainUser = await makeUser()

    await inMemoryUsersRepository.create(domainUser)

    const { apiKey } = await getApiKeyUseCase.execute({
      userId: domainUser.id.toString(),
    })

    expect(apiKey).toBeNull()
  })

  it('should not be able to get api key because user not exists', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const getApiKeyUseCase = new GetApiKeyUseCase(inMemoryUsersRepository)

    const domainUser = await makeUser()

    await expect(
      getApiKeyUseCase.execute({
        userId: domainUser.id.toString(),
      })
    ).rejects.toThrow(UnauthorizedError)
  })
})
