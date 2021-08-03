import { UniqueEntityID } from '../../../shared/domain/unique-entity-id'
import { AuthSecretEntity } from '../../../shared/infra/db/entities/auth-secret.entity'
import { AuthSecret } from '../domain/entities/auth-secret'
import { EncryptedClientSecret } from '../domain/value-objects/encrypted-client-secret'

export class AuthSecretMap {

  public static toDomain(authSecretEntity: AuthSecretEntity): AuthSecret {

    const encryptedClientSecret = EncryptedClientSecret.create({
      value: authSecretEntity.encryptedClientSecret,
      hashed: true,
    })

    if(encryptedClientSecret.isErr()) throw new Error() // TODO: check if we should handle error differently

    const authCodeResult = AuthSecret.create(
      {
        clientId: authSecretEntity.clientId,
        encryptedClientSecret: encryptedClientSecret.value,
        isVerified: authSecretEntity.isVerified
      },
      new UniqueEntityID(authSecretEntity.id)
    )

    if (authCodeResult.isErr()) throw new Error() // TODO: check if we should handle error differently

    return authCodeResult.value
  }

  public static async toPersistence(authSecret: AuthSecret): Promise<AuthSecretEntity> {
    const authSecretEntity = new AuthSecretEntity()
    authSecretEntity.clientId = authSecret.clientId
    authSecretEntity.encryptedClientSecret = authSecret.encryptedClientSecret.value
    authSecretEntity.isVerified = authSecret.isVerified

    return authSecretEntity
  }
}
