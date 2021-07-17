export namespace AppError {
  export class UnexpectedError extends Error {
    public constructor(error: string) {
      super(error)
    }
  }
}
