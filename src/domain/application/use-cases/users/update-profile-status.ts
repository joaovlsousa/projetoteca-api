import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import type { UsersRespository } from '../../repositories/users-repository.ts'

interface UpdateProfileStatusUseCaseRequest {
  userId: string
  isPublicProfile: boolean
}

export class UpdateProfileStatusUseCase {
  public constructor(private usersRepository: UsersRespository) {}

  async execute({
    userId,
    isPublicProfile,
  }: UpdateProfileStatusUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.getById(userId)

    if (!user) {
      throw new UnauthorizedError()
    }

    user.isPublicProfile = isPublicProfile

    await this.usersRepository.save(user)
  }
}
