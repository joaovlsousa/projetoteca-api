import { ForbiddenError } from '@core/errors/forbidden-error.ts'
import { NotFoundError } from '@core/errors/not-found-error.ts'
import type { UsersRespository } from '@domain/application/repositories/users-repository.ts'
import type { Project } from '@domain/entities/project.ts'
import type { ProjectsRespository } from '../../repositories/projects-repository.ts'

interface FindProjectsByUsernameUseCaseRequest {
  username: string
}

interface FindProjectsByUsernameUseCaseResponse {
  projects: Project[]
}

export class FindProjectsByUsernameUseCase {
  public constructor(
    private usersRepository: UsersRespository,
    private projectsRepository: ProjectsRespository
  ) {}

  async execute({
    username,
  }: FindProjectsByUsernameUseCaseRequest): Promise<FindProjectsByUsernameUseCaseResponse> {
    const user = await this.usersRepository.findByUsername(username)

    if (!user) {
      throw new NotFoundError('Usuário não encontrado')
    }

    if (!user.isPublicProfile) {
      throw new ForbiddenError('Este perfil é privado')
    }

    const projects = await this.projectsRepository.findByUserId(
      user.id.toString()
    )

    return {
      projects,
    }
  }
}
