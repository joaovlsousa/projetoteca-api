import { ForbiddenError } from '@core/errors/forbidden-error.ts'
import { NotFoundError } from '@core/errors/not-found-error.ts'
import type { ProjectType } from '@core/types/project-type.ts'
import { Description } from '@domain/entities/description.ts'
import { Name } from '@domain/entities/name.ts'
import type { Project } from '@domain/entities/project.ts'
import type { ProjectsRespository } from '../../repositories/projects-repository.ts'
import type { TechsRespository } from '../../repositories/techs-repository.ts'

interface UpdateProjectUseCaseRequest {
  projectId: string
  userId: string
  name: string
  description: string
  type: ProjectType
  techsIds: string[]
  githubUrl: string
  deployUrl?: string
}

interface UpdateProjectUseCaseResponse {
  project: Project
}

export class UpdateProjectUseCase {
  public constructor(
    private projectsRepository: ProjectsRespository,
    private techsRespository: TechsRespository
  ) {}

  async execute({
    projectId,
    name,
    description,
    type,
    userId,
    techsIds,
    githubUrl,
    deployUrl,
  }: UpdateProjectUseCaseRequest): Promise<UpdateProjectUseCaseResponse> {
    const project = await this.projectsRepository.findById(projectId)

    if (!project) {
      throw new NotFoundError('Projeto não encontrado')
    }

    if (project.userId.toString() !== userId) {
      throw new ForbiddenError()
    }

    const techs = await this.techsRespository.findManyByIdList(techsIds)

    project.name = new Name(name)
    project.description = new Description(description)
    project.type = type
    project.techs = techs
    project.githubUrl = githubUrl
    project.deployUrl = deployUrl
    project.updatedAt = new Date()

    await this.projectsRepository.save(project)

    return {
      project,
    }
  }
}
