export namespace GetUserErrors {
  export class GetUserByIdFailedError extends Error {
    public constructor(id: string) {
      super()
      this.message = `No account with the id ${id} exists`
    }
  }
}
