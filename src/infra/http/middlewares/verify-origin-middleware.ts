import { env } from '@config/env.ts'
import { ForbiddenError } from '@core/errors/forbidden-error.ts'
import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import { HashService } from '@core/services/hash-service.ts'
import type { FastifyRequest } from 'fastify'

export async function verifyOriginMiddleware(request: FastifyRequest) {
  request.getPortfolioAccessToken = async () => {
    const { origin } = request.headers

    if (!origin || origin === env.CLIENT_APP_URL) {
      return null
    }

    const token = request.headers.authorization

    if (!token) {
      throw new UnauthorizedError()
    }

    const [tokenType, hashedPortfolioUrl] = token.split(' ')

    if (tokenType !== 'Bearer') {
      throw new UnauthorizedError()
    }

    const portfolioUrl = await HashService.decode(hashedPortfolioUrl)

    if (origin !== portfolioUrl) {
      throw new ForbiddenError()
    }

    return hashedPortfolioUrl
  }
}
