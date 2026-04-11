import { httpErrorSchema } from '@core/schemas/http-error-schema.ts'
import { GetProjectsByUsernameAndApiKeyUseCase } from '@domain/application/use-cases/projects/get-projects-by-username-and-api-key.ts'
import { DrizzleProjectsRepository } from '@infra/database/drizzle/repositories/drizzle-projects-respository.ts'
import { DrizzleUsersRepository } from '@infra/database/drizzle/repositories/drizzle-users-respository.ts'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getPublicProjectsRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/public/projects/:username',
    {
      schema: {
        summary: 'Get projects by username',
        tags: ['Public'],
        params: z.object({
          username: z.string(),
        }),
        querystring: z.object({
          apiKey: z.string().optional(),
        }),
        response: {
          200: z.object({
            projects: z.array(
              z.object({
                id: z.cuid2(),
                name: z.string(),
                description: z.string(),
                type: z.union([
                  z.literal('frontend'),
                  z.literal('backend'),
                  z.literal('fullstack'),
                ]),
                techs: z.array(
                  z.object({
                    id: z.cuid2(),
                    name: z.string(),
                    imageUrl: z.httpUrl().nullable(),
                  })
                ),
                imageUrl: z.httpUrl().nullable(),
                githubUrl: z.httpUrl(),
                deployUrl: z.httpUrl().nullable(),
                createdAt: z.date(),
                updatedAt: z.date().nullable(),
              })
            ),
            user: z
              .object({
                name: z.string(),
                username: z.string(),
                avatarUrl: z.httpUrl(),
              })
              .optional(),
          }),
          400: httpErrorSchema,
          403: httpErrorSchema,
          404: httpErrorSchema,
          500: httpErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { username } = request.params
      const { apiKey = null } = request.query

      const getProjectsByUsernameAndApiKeyUseCase =
        new GetProjectsByUsernameAndApiKeyUseCase(
          new DrizzleUsersRepository(),
          new DrizzleProjectsRepository()
        )

      const { projects, user } =
        await getProjectsByUsernameAndApiKeyUseCase.execute({
          username,
          apiKey,
        })

      return reply.status(200).send({
        projects: projects.map((project) => ({
          id: project.id.toString(),
          name: project.name.toString(),
          description: project.description.toString(),
          type: project.type,
          techs: project.techs.map((tech) => ({
            id: tech.id.toString(),
            name: tech.name,
            imageUrl: tech.imageUrl,
          })),
          imageUrl: project.imageUrl ?? null,
          githubUrl: project.githubUrl,
          deployUrl: project.deployUrl ?? null,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt ?? null,
        })),
        user: user
          ? {
              name: user.name,
              username: user.username,
              avatarUrl: user.avatarUrl,
            }
          : undefined,
      })
    }
  )
}
