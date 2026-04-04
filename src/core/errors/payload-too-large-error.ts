export class PayloadTooLargeError extends Error {
  constructor(message?: string) {
    super(message ?? 'Este arquivo é muito grande')
  }
}
