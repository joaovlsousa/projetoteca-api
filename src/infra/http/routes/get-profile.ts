import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { GetProfileUseCase } from '@domain/application/use-cases/users/get-profile.ts'
import { DrizzleUsersRepository } from '@infra/database/drizzle/repositories/drizzle-users-respository.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authMiddleware } from '../middlewares/auth-middleware.ts'

export const getProfileRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/users/profile',
    {
      schema: {
        summary: 'Get user profile',
        tags: ['Auth'],
        response: {
          200: z.object({
            user: z.object({
              name: z.string(),
              username: z.string(),
              avatarUrl: z.httpUrl(),
            }),
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
        user: {
          name: user.name,
          username: user.username,
          avatarUrl: user.avatarUrl,
        },
      })
    }
  )
}
