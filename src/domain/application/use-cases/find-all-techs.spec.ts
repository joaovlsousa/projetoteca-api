import { makeTech } from '@test/factories/make-tech.ts'
import { InMemoryTechsRepository } from '@test/repositories/in-memory-techs-repository.ts'
import { expect, it } from 'vitest'
import { FindAllTechsUseCase } from './find-all-techs.ts'

it('should be able find a project by id', async () => {
  const inMemoryTechsRepository = new InMemoryTechsRepository()
  const findAllTechsUseCase = new FindAllTechsUseCase(inMemoryTechsRepository)

  await inMemoryTechsRepository.create(makeTech())
  await inMemoryTechsRepository.create(makeTech())
  await inMemoryTechsRepository.create(makeTech())

  const { techs } = await findAllTechsUseCase.execute()

  expect(techs).toBeTruthy()
  expect(techs).toHaveLength(3)
})
