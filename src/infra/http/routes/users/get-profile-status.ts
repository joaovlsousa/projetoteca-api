import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { GetProfileUseCase } from '@domain/application/use-cases/users/get-profile.ts'
import { DrizzleUsersRepository } from '@infra/database/drizzle/repositories/drizzle-users-respository.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authMiddleware } from '../../middlewares/auth-middleware.ts'

export const getProfileStatusRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/users/profile/status',
    {
      schema: {
        summary: 'Get user profile status',
        tags: ['Users'],
        response: {
          200: z.object({
            isPublicProfile: z.boolean(),
          }),
          401: httpErrorSchema,
          403: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      const userId = request.getCurrentUserId()

      const getProfileUseCase = new GetProfileUseCase(
        new DrizzleUsersRepository()
      )

      const { user } = await getProfileUseCase.execute({ userId })

      return reply.status(200).send({
        isPublicProfile: user.isPublicProfile,
      })
    }
  )
}
