import { Result } from '../../../../../shared/core/result'
import { AggregateRoot } from '../../../../../shared/domain/aggregate-root'
import { UniqueEntityID } from '../../../../../shared/domain/unique-entity-id'
import { EncryptedClientSecret } from '../../value-objects/encrypted-client-secret'

interface AuthSecretProps {
  clientId: string,
  encryptedClientSecret: EncryptedClientSecret
}

export class AuthSecret extends AggregateRoot<AuthSecretProps> {
  public static create(props: AuthSecretProps, id?: UniqueEntityID): Result<AuthSecret, Error> {
    const authSecret = new AuthSecret(
      {
        ...props,
      },
      id
    )

    return Result.ok(authSecret)
  }

  private constructor(props: AuthSecretProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get clientId(): string {
    return this.props.clientId
  }

  get encryptedClientSecret(): EncryptedClientSecret {
    return this.props.encryptedClientSecret
  }
}
