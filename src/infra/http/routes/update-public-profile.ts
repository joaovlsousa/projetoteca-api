import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { UpdatePublicProfileUseCase } from '@domain/application/use-cases/users/update-public-profile.ts'
import { DrizzleUsersRepository } from '@infra/database/drizzle/repositories/drizzle-users-respository.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authMiddleware } from '../middlewares/auth-middleware.ts'

export const updatePublicProfileRoute: FastifyPluginAsyncZod = async (app) => {
  app.patch(
    '/profile',
    {
      schema: {
        summary: 'Update public profile',
        tags: ['Users'],
        body: z.object({
          isPublicProfile: z.boolean(),
        }),
        response: {
          204: z.void(),
          400: httpErrorSchema,
          401: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      const userId = request.getCurrentUserId()
      const { isPublicProfile } = request.body

      const updatePublicProfileUseCase = new UpdatePublicProfileUseCase(
        new DrizzleUsersRepository()
      )

      await updatePublicProfileUseCase.execute({
        userId,
        isPublicProfile,
      })

      return reply.status(204).send()
    }
  )
}
