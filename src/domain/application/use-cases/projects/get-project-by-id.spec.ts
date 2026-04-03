import { makeProject } from '@test/factories/make-project.ts'
import { InMemoryProjectsRepository } from '@test/repositories/in-memory-projects-repository.ts'
import { describe, expect, it } from 'vitest'
import { GetProjectByIdUseCase } from './get-project-by-id.ts'

describe('get projects by id', () => {
  it('should be able get a project by id', async () => {
    const inMemoryProjectsRepository = new InMemoryProjectsRepository()
    const getProjectByIdUseCase = new GetProjectByIdUseCase(
      inMemoryProjectsRepository
    )

    const projectDomain = makeProject()

    await inMemoryProjectsRepository.create(projectDomain)

    const { project } = await getProjectByIdUseCase.execute({
      projectId: projectDomain.id.toString(),
    })

    expect(project).toBeTruthy()
  })

  it('should not be able get project by id', async () => {
    const inMemoryProjectsRepository = new InMemoryProjectsRepository()
    const getProjectByIdUseCase = new GetProjectByIdUseCase(
      inMemoryProjectsRepository
    )

    const { project } = await getProjectByIdUseCase.execute({
      projectId: 'random-id',
    })

    expect(project).toBeNull()
  })
})
