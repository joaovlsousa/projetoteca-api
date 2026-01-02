import { ForbiddenError } from '@core/errors/forbidden-error.ts'
import { NotFoundError } from '@core/errors/not-found-error.ts'
import { makeProject } from '@test/factories/make-project.ts'
import { makeTech } from '@test/factories/make-tech.ts'
import { InMemoryProjectsRepository } from '@test/repositories/in-memory-projects-repository.ts'
import { InMemoryTechsRepository } from '@test/repositories/in-memory-techs-repository.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateProjectUseCase } from './update-project.ts'

describe('update project', () => {
  let inMemoryProjectsRepository: InMemoryProjectsRepository
  let inMemoryTechsRepository: InMemoryTechsRepository
  let updateProjectUseCase: UpdateProjectUseCase

  beforeEach(() => {
    inMemoryProjectsRepository = new InMemoryProjectsRepository()
    inMemoryTechsRepository = new InMemoryTechsRepository()
    updateProjectUseCase = new UpdateProjectUseCase(
      inMemoryProjectsRepository,
      inMemoryTechsRepository
    )
  })

  it('should be able update a project', async () => {
    const project = makeProject()
    await inMemoryProjectsRepository.create(project)
    const tech = makeTech()
    inMemoryTechsRepository.create(tech)

    const { project: projectUpdated } = await updateProjectUseCase.execute({
      name: 'project name',
      description: 'project description',
      githubUrl: 'https://github.com',
      type: 'backend',
      userId: 'user-id',
      projectId: project.id.toString(),
      techsIds: [tech.id.toString()],
    })

    expect(projectUpdated).toBeTruthy()
    expect(inMemoryProjectsRepository.projects[0]).toEqual(projectUpdated)
  })

  it('should not be able to update a project if a project not exists', async () => {
    await expect(
      updateProjectUseCase.execute({
        name: 'project name',
        description: 'project description',
        githubUrl: 'https://github.com',
        type: 'backend',
        userId: 'user-id',
        projectId: 'project-id',
        techsIds: [],
      })
    ).rejects.toThrow(NotFoundError)
  })

  it('should not be able to update a project if user is not owner', async () => {
    const project = makeProject()
    await inMemoryProjectsRepository.create(project)

    await expect(
      updateProjectUseCase.execute({
        name: 'project name',
        description: 'project description',
        githubUrl: 'https://github.com',
        type: 'backend',
        userId: 'user-not-owner',
        projectId: project.id.toString(),
        techsIds: [],
      })
    ).rejects.toThrow(ForbiddenError)
  })
})
