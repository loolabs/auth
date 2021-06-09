export namespace UserValueObjectErrors {
  export class InvalidEmail {
    public message: string
    public constructor(email: string) {
      this.message = `The email address, ${email} is invalid.`
    }
  }

  export class InvalidSecret {
    public message: string
    public constructor(message: string) {
      this.message = message
    }
  }

  export class InvalidSecretComparison {
    public message: string
    public constructor(message: string) {
      this.message = message
    }
  }

  export class InvalidCodeGenerated {
    public message: string
    public constructor(message: string) {
      this.message = message
    }
  }
}
