import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import { HashService } from '@core/services/hash-service.ts'
import type { UsersRespository } from '../../repositories/users-repository.ts'

interface ConnectWithPortfolioUseCaseRequest {
  userId: string
  portfolioUrl: string
}

interface ConnectWithPortfolioUseCaseResponse {
  token: string
}

export class ConnectWithPortfolioUseCase {
  public constructor(private usersRepository: UsersRespository) {}

  async execute({
    userId,
    portfolioUrl,
  }: ConnectWithPortfolioUseCaseRequest): Promise<ConnectWithPortfolioUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UnauthorizedError()
    }

    const hashedPortfolioUrl = await HashService.hash(portfolioUrl)

    user.hashedPortfolioUrl = hashedPortfolioUrl

    await this.usersRepository.save(user)

    return {
      token: hashedPortfolioUrl,
    }
  }
}
