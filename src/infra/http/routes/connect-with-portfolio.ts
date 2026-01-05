import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { ConnectWithPortfolioUseCase } from '@domain/application/use-cases/users/connect-with-portfolio.ts'
import { DrizzleUsersRepository } from '@infra/database/drizzle/repositories/drizzle-users-respository.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authMiddleware } from '../middlewares/auth-middleware.ts'

export const connectWithPortfolioRoute: FastifyPluginAsyncZod = async (app) => {
  app.patch(
    '/users/portfolio/connect',
    {
      schema: {
        summary: 'Connect with user portfolio',
        tags: ['Users'],
        body: z.object({
          portfolioUrl: z.httpUrl(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
          400: httpErrorSchema,
          401: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      const userId = request.getCurrentUserId()
      const { portfolioUrl } = request.body

      const connectWithPortfolioUseCase = new ConnectWithPortfolioUseCase(
        new DrizzleUsersRepository()
      )

      const { token } = await connectWithPortfolioUseCase.execute({
        userId,
        portfolioUrl,
      })

      return reply.status(201).send({
        token,
      })
    }
  )
}
