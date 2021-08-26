export namespace DiscoverSPErrors {
  export class ClientNameAlreadyInUse extends Error {
    public constructor(clientName: string) {
      super()
      this.message = `The provided client name ${clientName} is already in use.`
    }
  }
}
