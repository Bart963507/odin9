export class UnauthorizedError extends Error {
  constructor() {
    super('Niet ingelogd of sessie verlopen')
    this.name = 'UnauthorizedError'
  }
}

export class InvalidPasswordError extends Error {
  constructor() {
    super('Onjuist wachtwoord')
    this.name = 'InvalidPasswordError'
  }
}

export class TooManyLoginAttemptsError extends Error {
  constructor() {
    super('Te veel pogingen, probeer het over een minuut opnieuw')
    this.name = 'TooManyLoginAttemptsError'
  }
}
