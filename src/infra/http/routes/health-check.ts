import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { allowAllOriginMiddleware } from '../middlewares/allow-all-origin-middleware.ts'

export const healthCheckRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/public/health',
    {
      schema: {
        summary: 'Get API status',
        tags: ['Public'],
        response: {
          200: z.object({
            status: z.literal('ready'),
          }),
          503: z.object({
            status: z.literal('off'),
          }),
        },
      },
      preHandler: [allowAllOriginMiddleware],
    },
    async (_request, reply) => {
      const isReady = app.server.listening

      if (!isReady) {
        return reply.status(503).send({
          status: 'off',
        })
      }

      return reply.status(200).send({
        status: 'ready',
      })
    }
  )
}
