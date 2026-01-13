import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { GetStorageMetadataByUserIdUseCase } from '@domain/application/use-cases/projects/get-storage-metadata-by-user-id.ts'
import { DrizzleProjectsRepository } from '@infra/database/drizzle/repositories/drizzle-projects-respository.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authMiddleware } from '../middlewares/auth-middleware.ts'

export const getStorageMetadataByUserIdRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.get(
    '/projects/storage/metadata',
    {
      schema: {
        summary: 'Get storage metadata by user id',
        tags: ['Projects'],
        response: {
          200: z.object({
            metadata: z.object({
              countStorageInBytes: z.int().positive(),
              totalOfStorageInBytesByUser: z.int().positive(),
            }),
          }),
          401: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      const userId = request.getCurrentUserId()

      const getStorageMetadataByUserIdUseCase =
        new GetStorageMetadataByUserIdUseCase(new DrizzleProjectsRepository())

      const { metadata } = await getStorageMetadataByUserIdUseCase.execute({
        userId,
      })

      return reply.status(200).send({
        metadata,
      })
    }
  )
}
