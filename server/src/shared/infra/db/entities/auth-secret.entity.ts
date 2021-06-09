import { Entity, Property } from '@mikro-orm/core'
import { BaseEntity } from './base.entity'

@Entity()
export class AuthSecretEntity extends BaseEntity {
  @Property()
  clientId!: string

  @Property()
  encryptedClientSecret!: string
}
