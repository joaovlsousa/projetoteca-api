import { makeTech } from '@test/factories/make-tech.ts'
import { InMemoryTechsRepository } from '@test/repositories/in-memory-techs-repository.ts'
import { expect, it } from 'vitest'
import { GetAllTechsUseCase } from './get-all-techs.ts'

it('should be able get a project by id', async () => {
  const inMemoryTechsRepository = new InMemoryTechsRepository()
  const getAllTechsUseCase = new GetAllTechsUseCase(inMemoryTechsRepository)

  await inMemoryTechsRepository.create(makeTech())
  await inMemoryTechsRepository.create(makeTech())
  await inMemoryTechsRepository.create(makeTech())

  const { techs } = await getAllTechsUseCase.execute()

  expect(techs).toBeTruthy()
  expect(techs).toHaveLength(3)
})
