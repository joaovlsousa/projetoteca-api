import { UniqueEntityID } from '@core/entities/unique-entity-id.ts'
import { makeProject } from '@test/factories/make-project.ts'
import { InMemoryProjectsRepository } from '@test/repositories/in-memory-projects-repository.ts'
import { expect, it } from 'vitest'
import { GetProjectsByUserIdUseCase } from './get-projects-by-user-id.ts'

it('should be able get projects by user id', async () => {
  const inMemoryProjectsRepository = new InMemoryProjectsRepository()
  const getProjectsByUserIdUseCase = new GetProjectsByUserIdUseCase(
    inMemoryProjectsRepository
  )

  for (let i = 0; i < 8; i++) {
    i % 2 === 0
      ? await inMemoryProjectsRepository.create(makeProject())
      : await inMemoryProjectsRepository.create(
          makeProject({
            userId: new UniqueEntityID('user-id-2'),
          })
        )
  }

  const { projects } = await getProjectsByUserIdUseCase.execute({
    userId: 'user-id',
  })

  expect(projects).toHaveLength(4)
})
