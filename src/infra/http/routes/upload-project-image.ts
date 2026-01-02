import { BadRequestError } from '@core/errors/bad-request-error.ts'
import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import type { ImageFile } from '@core/types/image.ts'
import { UploadProjectImageUseCase } from '@domain/application/use-cases/upload-project-image.ts'
import { DrizzleProjectsRepository } from '@infra/database/drizzle/repositories/drizzle-projects-respository.ts'
import { UploadthingStorageService } from '@infra/services/uploadthig-storage-service.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authMiddleware } from '../middlewares/auth-middleware.ts'

export const uploadProjectImageRoute: FastifyPluginAsyncZod = async (app) => {
  app.patch(
    '/projects/:projectId/upload',
    {
      schema: {
        summary: 'Upload a project image',
        tags: ['Projects'],
        params: z.object({
          projectId: z.cuid2(),
        }),
        response: {
          204: z.void(),
          400: httpErrorSchema,
          401: httpErrorSchema,
          403: httpErrorSchema,
          404: httpErrorSchema,
          500: httpErrorSchema,
          522: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      const { projectId } = request.params
      const userId = request.getCurrentUserId()
      const file = await request.file()

      if (!file) {
        throw new BadRequestError('Image is required')
      }

      const uploadProjectImageUseCase = new UploadProjectImageUseCase(
        new DrizzleProjectsRepository(),
        new UploadthingStorageService()
      )

      const imageBuffer = await file.toBuffer()

      const image: ImageFile = {
        name: file.filename,
        mimetype: file.mimetype,
        size: imageBuffer.length,
        buffer: imageBuffer,
      }

      await uploadProjectImageUseCase.execute({
        projectId,
        userId,
        image,
      })

      return reply.status(204).send()
    }
  )
}
