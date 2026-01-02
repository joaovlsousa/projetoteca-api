export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message ?? 'Usuário não autenticado')
  }
}
