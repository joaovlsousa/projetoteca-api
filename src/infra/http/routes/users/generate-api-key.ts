import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { GenerateApiKeyUseCase } from '@domain/application/use-cases/users/generate-api-key.ts'
import { DrizzleUsersRepository } from '@infra/database/drizzle/repositories/drizzle-users-respository.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authMiddleware } from '../../middlewares/auth-middleware.ts'

export const generateApiKeyRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/users/api-key',
    {
      schema: {
        summary: 'Generate API Key',
        tags: ['Users'],
        response: {
          201: z.object({
            apiKey: z.string(),
          }),
          401: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      const userId = request.getCurrentUserId()

      const generateApiKeyUseCase = new GenerateApiKeyUseCase(
        new DrizzleUsersRepository()
      )

      const { apiKey } = await generateApiKeyUseCase.execute({
        userId,
      })

      return reply.status(201).send({
        apiKey,
      })
    }
  )
}
