import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { GetApiKeyUseCase } from '@domain/application/use-cases/users/get-api-key.ts'
import { DrizzleUsersRepository } from '@infra/database/drizzle/repositories/drizzle-users-respository.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authMiddleware } from '../../middlewares/auth-middleware.ts'

export const getApiKeyRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/users/api-key',
    {
      schema: {
        summary: 'Get API Key',
        tags: ['Users'],
        response: {
          200: z.object({
            apiKey: z.string().nullable(),
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

      const getApiKeyUseCase = new GetApiKeyUseCase(
        new DrizzleUsersRepository()
      )

      const { apiKey } = await getApiKeyUseCase.execute({ userId })

      return reply.status(200).send({
        apiKey,
      })
    }
  )
}
