import { Result } from '../../../../../shared/core/result'
import { AggregateRoot } from '../../../../../shared/domain/aggregate-root'
import { UniqueEntityID } from '../../../../../shared/domain/unique-entity-id'
import { AuthCodeCreated } from '../../events/auth-code-created'
import { AuthCodeString } from '../../value-objects/auth-code'

interface AuthCodeProps {
  clientId: string,
  authCode: AuthCodeString
}

export class AuthCode extends AggregateRoot<AuthCodeProps> {
  public static create(props: AuthCodeProps, id?: UniqueEntityID): Result<AuthCode, Error> {
    const isNewAuthCode = !!id === false
    const authCode = new AuthCode(
      {
        ...props,
      },
      id
    )

    if (isNewAuthCode) 
      authCode.addDomainEvent(new AuthCodeCreated(authCode))
    return Result.ok(authCode)
  }

  private constructor(props: AuthCodeProps, id?: UniqueEntityID) {
    super(props, id)
  }

  get clientId(): string {
    return this.props.clientId
  }

  get authCode(): AuthCodeString {
    return this.props.authCode
  }
}
