import { BadRequestError } from '@core/errors/bad-request-error.ts'
import type { ImageFile } from '@core/types/image.ts'
import { makeImageFile } from '@test/factories/make-image-file.ts'
import { InMemoryTechsRepository } from '@test/repositories/in-memory-techs-repository.ts'
import { TestStorageService } from '@test/services/test-storage-service.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateTechUseCase } from './create-tech.ts'

describe('create tech', async () => {
  const imageToUpload: ImageFile = await makeImageFile()

  let inMemoryTechsRepository: InMemoryTechsRepository
  let testStorageService: TestStorageService
  let createTechUseCase: CreateTechUseCase

  beforeEach(() => {
    inMemoryTechsRepository = new InMemoryTechsRepository()
    testStorageService = new TestStorageService()
    createTechUseCase = new CreateTechUseCase(
      inMemoryTechsRepository,
      testStorageService
    )
  })

  it('should be able to create a tech', async () => {
    await createTechUseCase.execute({
      image: imageToUpload,
      name: 'tech',
    })

    expect(inMemoryTechsRepository.techs[0].imageId).toBeTruthy()
    expect(inMemoryTechsRepository.techs[0].name).toBeTruthy()
  })

  it('should not be able to upload an image due to its size', async () => {
    const invalidImageToUpload = imageToUpload
    invalidImageToUpload.size = 6 * 1024 * 1024 // 6MB

    await expect(
      createTechUseCase.execute({
        image: invalidImageToUpload,
        name: 'tech',
      })
    ).rejects.toThrow(BadRequestError)
  })
})
