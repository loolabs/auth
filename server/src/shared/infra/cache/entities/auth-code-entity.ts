import { RedisEntity } from '../redis-entity'

export class AuthCodeEntity extends RedisEntity {
  clientId!: string

  userId!: string

  userEmail!: string

  userEmailVerified!: boolean

  authCodeString!: string

  getEntityKey() {
    return `${this.constructor.name}/${this.authCodeString}`
  }

  toJSON(): object {
    const { clientId, userId, userEmail, userEmailVerified, authCodeString, id } = this
    return {
      clientId,
      userId,
      userEmail,
      userEmailVerified,
      authCodeString,
      id,
    }
  }
}
