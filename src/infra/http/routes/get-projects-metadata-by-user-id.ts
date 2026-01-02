import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { GetProjectsMetadataByUserIdUseCase } from '@domain/application/use-cases/projects/get-projects-metadata-by-user-id.ts'
import { DrizzleProjectsRepository } from '@infra/database/drizzle/repositories/drizzle-projects-respository.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authMiddleware } from '../middlewares/auth-middleware.ts'

export const getProjectsMetadataByUserIdRoute: FastifyPluginAsyncZod = async (
  app
) => {
  app.get(
    '/projects/metadata',
    {
      schema: {
        summary: 'Get projects metadata by user id',
        tags: ['Projects'],
        response: {
          200: z.object({
            metadata: z.object({
              countProjects: z.int(),
              countStorageInBytes: z.int(),
              totalProjects: z.int(),
              totalStorageInBytes: z.int(),
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

      const getProjectsMetadataByUserIdUseCase =
        new GetProjectsMetadataByUserIdUseCase(new DrizzleProjectsRepository())

      const { metadata } = await getProjectsMetadataByUserIdUseCase.execute({
        userId,
      })

      return reply.status(200).send({
        metadata,
      })
    }
  )
}
