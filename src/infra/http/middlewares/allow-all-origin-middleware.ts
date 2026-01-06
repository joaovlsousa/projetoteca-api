import type { FastifyReply, FastifyRequest } from 'fastify'

export async function allowAllOriginMiddleware(
  _request: FastifyRequest,
  reply: FastifyReply
) {
  reply.header('Access-Control-Allow-Origin', '*')
  reply.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
}
