import { RedisEntity } from "../redis-entity"

export class AuthCodeEntity extends RedisEntity {
  clientId!: string

  userId!: string

  authCodeString!: string

  getEntityKey(){
    return `${this.constructor.name}/${this.authCodeString}`
  }

  toJSON(): object {
    const { clientId, userId, authCodeString, id } = this
    return {
      clientId,
      userId,
      authCodeString,
      id
    }
  }
}
