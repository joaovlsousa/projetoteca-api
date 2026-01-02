import { BadGatewayError } from '@core/errors/bad-gateway-error.ts'
import { BadRequestError } from '@core/errors/bad-request-error.ts'
import { ForbiddenError } from '@core/errors/forbidden-error.ts'
import { NotFoundError } from '@core/errors/not-found-error.ts'
import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {
  if (error instanceof ZodError || error.validation) {
    return reply.status(400).send({
      message: 'Erro ao validar os dados da requisição',
    })
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      message: error.message,
    })
  }

  if (error instanceof ForbiddenError) {
    return reply.status(403).send({
      message: error.message,
    })
  }

  if (error instanceof NotFoundError) {
    return reply.status(404).send({
      message: error.message,
    })
  }

  if (error instanceof BadGatewayError) {
    return reply.status(502).send({
      message: error.message,
    })
  }

  console.error(error)

  return reply.status(500).send({ message: 'Erro interno do servidor' })
}
