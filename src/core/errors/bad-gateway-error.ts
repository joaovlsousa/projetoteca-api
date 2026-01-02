export class BadGatewayError extends Error {
  constructor(message?: string) {
    super(message ?? 'Erro ao comunicar com serviço terceiro')
  }
}
