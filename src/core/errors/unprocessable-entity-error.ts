export class UnprocessableEntityError extends Error {
  constructor(message?: string) {
    super(message ?? 'Erro ao processar entidade')
  }
}
