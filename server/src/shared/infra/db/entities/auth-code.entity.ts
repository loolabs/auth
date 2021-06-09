import { AfterCreate, Entity, Property, Index } from '@mikro-orm/core'
import { DomainEvents } from '../../../domain/events/domain-events'
import { UniqueEntityID } from '../../../domain/unique-entity-id'
import { BaseEntity } from './base.entity'

@Entity()
export class AuthCodeEntity extends BaseEntity {
  @Property()
  @Index()
  clientId!: string

  @Property()
  authCode!: string

  // TODO: fix any type
  @AfterCreate()
  afterCreate(target: any) {
    const id = target.entity.id
    const aggregateId = new UniqueEntityID(id)
    DomainEvents.dispatchEventsForAggregate(aggregateId)
  }
}
