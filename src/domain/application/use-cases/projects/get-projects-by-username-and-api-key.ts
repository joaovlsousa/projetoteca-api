import { ForbiddenError } from '@core/errors/forbidden-error.ts'
import { NotFoundError } from '@core/errors/not-found-error.ts'
import { HashService } from '@core/services/hash-service.ts'
import type { UsersRespository } from '@domain/application/repositories/users-repository.ts'
import type { Project } from '@domain/entities/project.ts'
import type { User } from '@domain/entities/user.ts'
import type { ProjectsRespository } from '../../repositories/projects-repository.ts'

interface GetProjectsByUsernameAndApiKeyUseCaseRequest {
  username: string
  apiKey: string | null
}

interface GetProjectsByUsernameAndApiKeyUseCaseResponse {
  projects: Project[]
  user?: User
}

export class GetProjectsByUsernameAndApiKeyUseCase {
  public constructor(
    private usersRepository: UsersRespository,
    private projectsRepository: ProjectsRespository
  ) {}

  async execute({
    username,
    apiKey,
  }: GetProjectsByUsernameAndApiKeyUseCaseRequest): Promise<GetProjectsByUsernameAndApiKeyUseCaseResponse> {
    const user = await this.usersRepository.getByUsername(username)

    if (!user) {
      throw new NotFoundError('Usuário não encontrado.')
    }

    if (!apiKey && !user.isPublicProfile) {
      throw new ForbiddenError('Este perfil é privado.')
    }

    if (apiKey) {
      if (!user.apiKeyHash) {
        throw new ForbiddenError('Você não possui nenhuma API Key cadastrada.')
      }

      const apiKeyDecoded = await HashService.decode(user.apiKeyHash)

      if (apiKey !== apiKeyDecoded) {
        throw new ForbiddenError('API Key inválida')
      }

      const projects = await this.projectsRepository.getByUserId(
        user.id.toString()
      )

      return {
        projects,
      }
    }

    const projects = await this.projectsRepository.getByUserId(
      user.id.toString()
    )

    return {
      projects,
      user,
    }
  }
}
