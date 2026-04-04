import { ForbiddenError } from '@core/errors/forbidden-error.ts'
import { NotFoundError } from '@core/errors/not-found-error.ts'
import { PayloadTooLargeError } from '@core/errors/payload-too-large-error.ts'
import type { ImageFile } from '@core/types/image.ts'
import { makeImageFile } from '@test/factories/make-image-file.ts'
import { makeProject } from '@test/factories/make-project.ts'
import { InMemoryProjectsRepository } from '@test/repositories/in-memory-projects-repository.ts'
import { TestStorageService } from '@test/services/test-storage-service.ts'
import { beforeEach, describe, expect, it } from 'vitest'
import { UploadProjectImageUseCase } from './upload-project-image.ts'

describe('upload project image', async () => {
  const imageToUpload: ImageFile = await makeImageFile()

  let inMemoryProjectsRepository: InMemoryProjectsRepository
  let uploadProjectImageUseCase: UploadProjectImageUseCase

  beforeEach(() => {
    inMemoryProjectsRepository = new InMemoryProjectsRepository()
    uploadProjectImageUseCase = new UploadProjectImageUseCase(
      inMemoryProjectsRepository,
      new TestStorageService()
    )
  })

  it('should be able to upload an image', async () => {
    const project = makeProject()
    await inMemoryProjectsRepository.create(project)

    await uploadProjectImageUseCase.execute({
      image: imageToUpload,
      projectId: project.id.toString(),
      userId: project.userId.toString(),
    })

    expect(inMemoryProjectsRepository.projects[0].imageId).toBeTruthy()
    expect(inMemoryProjectsRepository.projects[0].imageSizeInBytes).toEqual(
      imageToUpload.size
    )
  })

  it('should be able to replace an image', async () => {
    const project = makeProject()
    await inMemoryProjectsRepository.create(project)

    await uploadProjectImageUseCase.execute({
      image: imageToUpload,
      projectId: project.id.toString(),
      userId: project.userId.toString(),
    })

    const imageId = inMemoryProjectsRepository.projects[0].imageId

    await uploadProjectImageUseCase.execute({
      image: imageToUpload,
      projectId: project.id.toString(),
      userId: project.userId.toString(),
    })

    expect(inMemoryProjectsRepository.projects[0].imageId).not.toEqual(imageId)
  })

  it('should not be able to upload an image if a project not exists', async () => {
    await expect(
      uploadProjectImageUseCase.execute({
        image: imageToUpload,
        projectId: 'project-1',
        userId: 'user-1',
      })
    ).rejects.toThrow(NotFoundError)
  })

  it('should not be able to upload an image if user is not owner', async () => {
    const project = makeProject()
    await inMemoryProjectsRepository.create(project)

    await expect(
      uploadProjectImageUseCase.execute({
        image: imageToUpload,
        projectId: project.id.toString(),
        userId: 'user-not-owner',
      })
    ).rejects.toThrow(ForbiddenError)
  })

  it('should not be able to upload an image if overflow storage limit by user', async () => {
    const project1 = makeProject()
    const project2 = makeProject()
    const project3 = makeProject()

    await inMemoryProjectsRepository.create(project1)
    await inMemoryProjectsRepository.create(project2)
    await inMemoryProjectsRepository.create(project3)

    const largeImageToUpload = imageToUpload
    largeImageToUpload.size = 1024 * 1024 // 1MB

    await uploadProjectImageUseCase.execute({
      image: largeImageToUpload,
      projectId: project1.id.toString(),
      userId: 'user-id',
    })

    await uploadProjectImageUseCase.execute({
      image: imageToUpload,
      projectId: project2.id.toString(),
      userId: 'user-id',
    })

    await expect(
      uploadProjectImageUseCase.execute({
        image: imageToUpload,
        projectId: project3.id.toString(),
        userId: 'user-id',
      })
    ).rejects.toThrow(PayloadTooLargeError)
  })

  it('should not be able to upload an image due to its size', async () => {
    const invalidImageToUpload = imageToUpload
    invalidImageToUpload.size = 6 * 1024 * 1024 // 6MB

    await expect(
      uploadProjectImageUseCase.execute({
        image: invalidImageToUpload,
        projectId: 'project-1',
        userId: 'user-1',
      })
    ).rejects.toThrow(PayloadTooLargeError)
  })
})
