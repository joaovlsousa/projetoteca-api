import { env } from '@config/env.ts'
import { UnauthorizedError } from '@core/errors/unauthorized-error.ts'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  sub: string
  username: string
}

export class JwtService {
  public static sign(payload: JwtPayload): string {
    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: '7d',
    })

    return token
  }

  public static verify(token: string): JwtPayload {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload

      return payload
    } catch {
      throw new UnauthorizedError()
    }
  }
}
