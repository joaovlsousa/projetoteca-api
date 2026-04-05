import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import type { UsersRespository } from '../../repositories/users-repository.ts'

interface UpdateProfileNameUseCaseRequest {
  userId: string
  name: string
}

export class UpdateProfileNameUseCase {
  public constructor(private usersRepository: UsersRespository) {}

  async execute({
    userId,
    name,
  }: UpdateProfileNameUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.getById(userId)

    if (!user) {
      throw new UnauthorizedError()
    }

    user.name = name

    await this.usersRepository.save(user)
  }
}
