import { makeTech } from '@test/factories/make-tech.ts'
import { InMemoryProjectsRepository } from '@test/repositories/in-memory-projects-repository.ts'
import { InMemoryTechsRepository } from '@test/repositories/in-memory-techs-repository.ts'
import { expect, it } from 'vitest'
import { CreateProjectUseCase } from './create-project.ts'

it('should be able create a project', async () => {
  const inMemoryProjectsRepository = new InMemoryProjectsRepository()
  const inMemoryTechsRepository = new InMemoryTechsRepository()

  const createProjectUseCase = new CreateProjectUseCase(
    inMemoryProjectsRepository,
    inMemoryTechsRepository
  )

  const tech = makeTech()
  inMemoryTechsRepository.create(tech)

  const { project } = await createProjectUseCase.execute({
    name: 'project name',
    description: 'project description',
    githubUrl: 'https://github.com',
    type: 'fullstack',
    userId: 'user-id',
    techsIds: [tech.id.toString()],
  })

  expect(project).toBeTruthy()
  expect(inMemoryProjectsRepository.projects[0]).toEqual(project)
})
