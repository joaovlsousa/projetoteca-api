import { MAX_NUMBER_OF_PROJECTS_BY_USER } from '@core/constants.ts'
import { UniqueEntityID } from '@core/entities/unique-entity-id.ts'
import { UnprocessableEntityError } from '@core/errors/unprocessable-entity-error.ts'
import type { ProjectType } from '@core/types/project-type.ts'
import { Description } from '@domain/entities/description.ts'
import { Name } from '@domain/entities/name.ts'
import { Project } from '@domain/entities/project.ts'
import type { ProjectsRespository } from '../../repositories/projects-repository.ts'
import type { TechsRespository } from '../../repositories/techs-repository.ts'

interface CreateProjectUseCaseRequest {
  name: string
  description: string
  type: ProjectType
  userId: string
  techsIds: string[]
  githubUrl: string
  deployUrl?: string
}

interface CreateProjectUseCaseResponse {
  project: Project
}

export class CreateProjectUseCase {
  public constructor(
    private projectsRepository: ProjectsRespository,
    private techsRespository: TechsRespository
  ) {}

  async execute({
    name,
    description,
    type,
    userId,
    techsIds,
    githubUrl,
    deployUrl,
  }: CreateProjectUseCaseRequest): Promise<CreateProjectUseCaseResponse> {
    const totalProjects =
      await this.projectsRepository.countProjectsByUserId(userId)

    if (totalProjects >= MAX_NUMBER_OF_PROJECTS_BY_USER) {
      throw new UnprocessableEntityError(
        `Você atingiu o limite máximo de ${MAX_NUMBER_OF_PROJECTS_BY_USER} projetos.`
      )
    }

    const techs = await this.techsRespository.getManyByIdList(techsIds)

    const project = Project.create({
      name: new Name(name),
      description: new Description(description),
      userId: new UniqueEntityID(userId),
      type,
      techs,
      githubUrl,
      deployUrl,
    })

    await this.projectsRepository.create(project)

    return {
      project,
    }
  }
}
