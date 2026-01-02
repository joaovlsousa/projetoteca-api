import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import type { User } from '@domain/entities/user.ts'
import type { UsersRespository } from '../../repositories/users-repository.ts'

interface GetProfileUseCaseRequest {
  userId: string
}

interface GetProfileUseCaseResponse {
  user: User
}

export class GetProfileUseCase {
  public constructor(private usersRepository: UsersRespository) {}

  async execute({
    userId,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new UnauthorizedError()
    }

    return {
      user,
    }
  }
}
