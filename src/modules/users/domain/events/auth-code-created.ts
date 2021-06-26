import { DomainEvent } from '../../../../shared/domain/events/domain-event'
import { UniqueEntityID } from '../../../../shared/domain/unique-entity-id'
import { AuthCode } from '../entities/auth-code/auth-code'

export class AuthCodeCreated implements DomainEvent {
  public dateTimeOccurred: Date
  public authCode: AuthCode

  constructor(authCode: AuthCode) {
    this.dateTimeOccurred = new Date()
    this.authCode = authCode
  }

  public getAggregateId(): UniqueEntityID {
    return this.authCode.id
  }
}
