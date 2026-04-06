import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { DeleteApiKeyUseCase } from '@domain/application/use-cases/users/delete-api-key.ts'
import { DrizzleUsersRepository } from '@infra/database/drizzle/repositories/drizzle-users-respository.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authMiddleware } from '../../middlewares/auth-middleware.ts'

export const deleteApiKeyRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/users/api-key',
    {
      schema: {
        summary: 'Delete API Key',
        tags: ['Users'],
        response: {
          204: z.void(),
          401: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      const userId = request.getCurrentUserId()

      const deleteApiKeyUseCase = new DeleteApiKeyUseCase(
        new DrizzleUsersRepository()
      )

      await deleteApiKeyUseCase.execute({
        userId,
      })

      return reply.status(204).send()
    }
  )
}
