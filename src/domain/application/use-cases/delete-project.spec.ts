import { ForbiddenError } from '@core/errors/forbidden-error.ts'
import { NotFoundError } from '@core/errors/not-found-error.ts'
import { makeProject } from '@test/factories/make-project.ts'
import { InMemoryProjectsRepository } from '@test/repositories/in-memory-projects-repository.ts'
import { TestStorageService } from '@test/services/test-storage-service.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteProjectUseCase } from './delete-project.ts'

describe('delete project', () => {
  let inMemoryProjectsRepository: InMemoryProjectsRepository
  let deleteProjectUseCase: DeleteProjectUseCase

  beforeEach(() => {
    inMemoryProjectsRepository = new InMemoryProjectsRepository()
    deleteProjectUseCase = new DeleteProjectUseCase(
      inMemoryProjectsRepository,
      new TestStorageService()
    )
  })

  it('should be able to delete a project', async () => {
    const project = makeProject()
    await inMemoryProjectsRepository.create(project)

    await deleteProjectUseCase.execute({
      userId: 'user-id',
      projectId: project.id.toString(),
    })

    expect(inMemoryProjectsRepository.projects).toHaveLength(0)
  })

  it('should not be able to update a project if a project not exists', async () => {
    await expect(
      deleteProjectUseCase.execute({
        userId: 'user-id',
        projectId: 'project-id',
      })
    ).rejects.toThrow(NotFoundError)
  })

  it('should not be able to update a project if user is not owner', async () => {
    const project = makeProject()
    await inMemoryProjectsRepository.create(project)

    await expect(
      deleteProjectUseCase.execute({
        userId: 'user-not-owner',
        projectId: project.id.toString(),
      })
    ).rejects.toThrow(ForbiddenError)
  })
})
