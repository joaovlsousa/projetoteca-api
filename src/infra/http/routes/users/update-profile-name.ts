import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { UpdateProfileNameUseCase } from '@domain/application/use-cases/users/update-profile-name.ts'
import { DrizzleUsersRepository } from '@infra/database/drizzle/repositories/drizzle-users-respository.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authMiddleware } from '../../middlewares/auth-middleware.ts'

export const updateProfileNameRoute: FastifyPluginAsyncZod = async (app) => {
  app.patch(
    '/users/profile/name',
    {
      schema: {
        summary: 'Update profile name',
        tags: ['Users'],
        body: z.object({
          name: z.string().min(1),
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
      const { name } = request.body

      const updateProfileNameUseCase = new UpdateProfileNameUseCase(
        new DrizzleUsersRepository()
      )

      await updateProfileNameUseCase.execute({
        userId,
        name,
      })

      return reply.status(204).send()
    }
  )
}
