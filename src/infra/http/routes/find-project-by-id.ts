import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { FindProjectsByIdUseCase } from '@domain/application/use-cases/find-projects-by-id.ts'
import { DrizzleProjectsRepository } from '@infra/database/drizzle/repositories/drizzle-projects-respository.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authMiddleware } from '../middlewares/auth-middleware.ts'

export const findProjectByIdRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/projects/:projectId',
    {
      schema: {
        summary: 'Get project by id',
        tags: ['Projects'],
        params: z.object({
          projectId: z.cuid2(),
        }),
        response: {
          200: z.object({
            project: z.object({
              id: z.cuid2(),
              name: z.string(),
              description: z.string(),
              type: z.union([
                z.literal('frontend'),
                z.literal('backend'),
                z.literal('fullstack'),
              ]),
              imageUrl: z.httpUrl().nullable(),
              githubUrl: z.httpUrl(),
              deployUrl: z.httpUrl().nullable(),
              techs: z.array(
                z.object({
                  id: z.cuid2(),
                  name: z.string(),
                  imageUrl: z.httpUrl().nullable(),
                })
              ),
              createdAt: z.date(),
              updatedAt: z.date().nullable(),
            }),
          }),
          204: z.void(),
          401: httpErrorSchema,
          403: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
      preHandler: [authMiddleware],
    },
    async (request, reply) => {
      request.getCurrentUserId()

      const { projectId } = request.params

      const findProjectsByIdUseCase = new FindProjectsByIdUseCase(
        new DrizzleProjectsRepository()
      )

      const { project } = await findProjectsByIdUseCase.execute({ projectId })

      if (!project) {
        return reply.status(204).send()
      }

      return reply.status(200).send({
        project: {
          id: project.id.toString(),
          name: project.name.toString(),
          description: project.description.toString(),
          type: project.type,
          imageUrl: project.imageUrl ?? null,
          githubUrl: project.githubUrl,
          deployUrl: project.deployUrl ?? null,
          techs: project.techs.map((tech) => ({
            id: tech.id.toString(),
            name: tech.name,
            imageUrl: tech.imageUrl,
          })),
          createdAt: project.createdAt,
          updatedAt: project.updatedAt ?? null,
        },
      })
    }
  )
}
