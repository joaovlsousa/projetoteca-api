import { makeProject } from '@test/factories/make-project.ts'
import { InMemoryProjectsRepository } from '@test/repositories/in-memory-projects-repository.ts'
import { expect, it } from 'vitest'
import { GetProjectsMetadataByUserIdUseCase } from './get-projects-metadata-by-user-id.ts'

it('should be able get projects metadata by user id', async () => {
  const inMemoryProjectsRepository = new InMemoryProjectsRepository()
  const getProjectsMetadataByUserIdUseCase =
    new GetProjectsMetadataByUserIdUseCase(inMemoryProjectsRepository)

  for (let i = 0; i < 3; i++) {
    const project = makeProject()
    await inMemoryProjectsRepository.create(project)
  }

  const { metadata } = await getProjectsMetadataByUserIdUseCase.execute({
    userId: 'user-id',
  })

  expect(metadata.countProjects).toEqual(3)
})
