import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import type { UsersRespository } from '../../repositories/users-repository.ts'

interface DeleteApiKeyUseCaseRequest {
  userId: string
}

export class DeleteApiKeyUseCase {
  public constructor(private usersRepository: UsersRespository) {}

  async execute({ userId }: DeleteApiKeyUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.getById(userId)

    if (!user) {
      throw new UnauthorizedError()
    }

    if (!user.apiKeyHash) {
      return
    }

    user.apiKeyHash = null

    await this.usersRepository.save(user)
  }
}
