import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import { faker } from '@faker-js/faker'
import { makeUser } from '@test/factories/make-user.ts'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository.ts'
import { describe, expect, it } from 'vitest'
import { ConnectWithPortfolioUseCase } from './connect-with-portfolio.ts'

describe('connect with portfolio', () => {
  it('should be able to connect with portfolio', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const connectWithPortfolioUseCase = new ConnectWithPortfolioUseCase(
      inMemoryUsersRepository
    )

    const domainUser = await makeUser()

    await inMemoryUsersRepository.create(domainUser)

    const { token } = await connectWithPortfolioUseCase.execute({
      userId: domainUser.id.toString(),
      portfolioUrl: faker.internet.url(),
    })

    expect(token).toBeTruthy()
    expect(inMemoryUsersRepository.users[0].hashedPortfolioUrl).toBeTruthy()
  })

  it('should not be able to connect with portfolio because user not exists', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const connectWithPortfolioUseCase = new ConnectWithPortfolioUseCase(
      inMemoryUsersRepository
    )

    const domainUser = await makeUser()

    await expect(
      connectWithPortfolioUseCase.execute({
        userId: domainUser.id.toString(),
        portfolioUrl: faker.internet.url(),
      })
    ).rejects.toThrow(UnauthorizedError)
  })
})
