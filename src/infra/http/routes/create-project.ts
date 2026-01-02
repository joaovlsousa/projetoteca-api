import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { CreateProjectUseCase } from '@domain/application/use-cases/projects/create-project.ts'
import { DrizzleProjectsRepository } from '@infra/database/drizzle/repositories/drizzle-projects-respository.ts'
import { DrizzleTechsRepository } from '@infra/database/drizzle/repositories/drizzle-techs-respository.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authMiddleware } from '../middlewares/auth-middleware.ts'

export const createProjectRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/projects',
    {
      schema: {
        summary: 'Create a project',
        tags: ['Projects'],
        body: z.object({
          name: z.string().min(1).max(50),
          description: z.string().min(1).max(300),
          type: z.union([
            z.literal('frontend'),
            z.literal('backend'),
            z.literal('fullstack'),
          ]),
          techsIds: z.array(z.cuid2()),
          githubUrl: z.httpUrl(),
          deployUrl: z.httpUrl().optional(),
        }),
        response: {
          201: z.object({
            projectId: z.cuid2(),
          }),
          400: httpErrorSchema,
          401: httpErrorSchema,
          403: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      const createProjectUseCase = new CreateProjectUseCase(
        new DrizzleProjectsRepository(),
        new DrizzleTechsRepository()
      )

      const { name, description, type, githubUrl, deployUrl, techsIds } =
        request.body
      const userId = request.getCurrentUserId()

      const { project } = await createProjectUseCase.execute({
        name,
        description,
        type,
        githubUrl,
        deployUrl,
        userId,
        techsIds,
      })

      return reply.status(201).send({
        projectId: project.id.toString(),
      })
    }
  )
}
