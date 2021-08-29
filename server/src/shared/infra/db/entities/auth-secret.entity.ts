import { Entity, Property, Index } from '@mikro-orm/core'
import { BaseEntity } from './base.entity'

@Entity()
export class AuthSecretEntity extends BaseEntity {
  @Property()
  @Index()
  clientId!: string

  @Property()
  decodedRedirectUri!: string

  @Property()
  clientName!: string

  @Property()
  encryptedClientSecret!: string

  @Property()
  isVerified!: boolean
}
