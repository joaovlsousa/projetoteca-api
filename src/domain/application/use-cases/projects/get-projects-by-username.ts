import { ForbiddenError } from '@core/errors/forbidden-error.ts'
import { NotFoundError } from '@core/errors/not-found-error.ts'
import type { UsersRespository } from '@domain/application/repositories/users-repository.ts'
import type { Project } from '@domain/entities/project.ts'
import type { ProjectsRespository } from '../../repositories/projects-repository.ts'

interface GetProjectsByUsernameUseCaseRequest {
  username: string
  apiKeyHash: string | null
}

interface GetProjectsByUsernameUseCaseResponse {
  projects: Project[]
}

export class GetProjectsByUsernameUseCase {
  public constructor(
    private usersRepository: UsersRespository,
    private projectsRepository: ProjectsRespository
  ) {}

  async execute({
    username,
    apiKeyHash,
  }: GetProjectsByUsernameUseCaseRequest): Promise<GetProjectsByUsernameUseCaseResponse> {
    const user = await this.usersRepository.getByUsername(username)

    if (!user) {
      throw new NotFoundError('Usuário não encontrado')
    }

    if (!apiKeyHash && !user.isPublicProfile) {
      throw new ForbiddenError('Este perfil é privado')
    }

    if (apiKeyHash && user.apiKeyHash !== apiKeyHash) {
      throw new ForbiddenError()
    }

    const projects = await this.projectsRepository.getByUserId(
      user.id.toString()
    )

    return {
      projects,
    }
  }
}
