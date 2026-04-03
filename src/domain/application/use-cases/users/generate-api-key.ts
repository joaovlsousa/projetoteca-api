import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import { HashService } from '@core/services/hash-service.ts'
import { createId as generateApiKey } from '@paralleldrive/cuid2'
import type { UsersRespository } from '../../repositories/users-repository.ts'

interface GenerateApiKeyUseCaseRequest {
  userId: string
}

interface GenerateApiKeyUseCaseResponse {
  apiKey: string
}

export class GenerateApiKeyUseCase {
  public constructor(private usersRepository: UsersRespository) {}

  async execute({
    userId,
  }: GenerateApiKeyUseCaseRequest): Promise<GenerateApiKeyUseCaseResponse> {
    const user = await this.usersRepository.getById(userId)

    if (!user) {
      throw new UnauthorizedError()
    }

    const apiKey = generateApiKey()
    const apiKeyHash = await HashService.hash(apiKey)

    user.apiKeyHash = apiKeyHash

    await this.usersRepository.save(user)

    return {
      apiKey,
    }
  }
}
