import { makeImageFile } from '@test/factories/make-image-file.ts'
import { makeProject } from '@test/factories/make-project.ts'
import { InMemoryProjectsRepository } from '@test/repositories/in-memory-projects-repository.ts'
import { TestStorageService } from '@test/services/test-storage-service.ts'
import { expect, it } from 'vitest'
import { GetStorageMetadataByUserIdUseCase } from './get-storage-metadata-by-user-id.ts'
import { UploadProjectImageUseCase } from './upload-project-image.ts'

it('should be able get storage metadata by user id', async () => {
  const inMemoryProjectsRepository = new InMemoryProjectsRepository()
  const getStorageMetadataByUserIdUseCase =
    new GetStorageMetadataByUserIdUseCase(inMemoryProjectsRepository)

  const uploadProjectImageUseCase = new UploadProjectImageUseCase(
    inMemoryProjectsRepository,
    new TestStorageService()
  )

  const imageToUpload = await makeImageFile()

  for (let i = 0; i < 3; i++) {
    const project = makeProject()
    await inMemoryProjectsRepository.create(project)
    await uploadProjectImageUseCase.execute({
      image: imageToUpload,
      projectId: project.id.toString(),
      userId: 'user-id',
    })
  }

  const { metadata } = await getStorageMetadataByUserIdUseCase.execute({
    userId: 'user-id',
  })

  expect(metadata.countStorageInBytes).toEqual(imageToUpload.size * 3)
})
