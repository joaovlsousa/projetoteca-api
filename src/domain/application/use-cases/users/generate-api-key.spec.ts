import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import { makeUser } from '@test/factories/make-user.ts'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository.ts'
import { describe, expect, it } from 'vitest'
import { GenerateApiKeyUseCase } from './generate-api-key.ts'

describe('generate api key', () => {
  it('should be able to generate api key', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const generateApiKeyUseCase = new GenerateApiKeyUseCase(
      inMemoryUsersRepository
    )

    const domainUser = await makeUser()

    await inMemoryUsersRepository.create(domainUser)

    const { apiKey } = await generateApiKeyUseCase.execute({
      userId: domainUser.id.toString(),
    })

    expect(apiKey).toBeTruthy()
    expect(inMemoryUsersRepository.users[0].apiKeyHash).toBeTruthy()
  })

  it('should not be able to generate api key because user not exists', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const generateApiKeyUseCase = new GenerateApiKeyUseCase(
      inMemoryUsersRepository
    )

    const domainUser = await makeUser()

    await expect(
      generateApiKeyUseCase.execute({
        userId: domainUser.id.toString(),
      })
    ).rejects.toThrow(UnauthorizedError)
  })
})
