import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import { HashService } from '@core/services/hash-service.ts'
import type { UsersRespository } from '../../repositories/users-repository.ts'

interface GetApiKeyUseCaseRequest {
  userId: string
}

interface GetApiKeyUseCaseResponse {
  apiKey: string | null
}

export class GetApiKeyUseCase {
  public constructor(private usersRepository: UsersRespository) {}

  async execute({
    userId,
  }: GetApiKeyUseCaseRequest): Promise<GetApiKeyUseCaseResponse> {
    const user = await this.usersRepository.getById(userId)

    if (!user) {
      throw new UnauthorizedError()
    }

    if (!user.apiKeyHash) {
      return {
        apiKey: null,
      }
    }

    const apiKey = await HashService.decode(user.apiKeyHash)

    return {
      apiKey,
    }
  }
}
