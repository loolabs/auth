import { AppError } from '../../../../../shared/core/app-error'
import { Result } from '../../../../../shared/core/result'
import { AggregateRoot } from '../../../../../shared/domain/aggregate-root'
import { UniqueEntityID } from '../../../../../shared/domain/unique-entity-id'
import { AuthCodeCreated } from '../../events/auth-code-created'
import { AuthCodeString } from '../../value-objects/auth-code'

interface AuthCodeProps {
  clientId: string,
  userId: string,
  authCodeString: AuthCodeString
}

export class AuthCode extends AggregateRoot<AuthCodeProps> {
  public static create(props: AuthCodeProps, id?: UniqueEntityID): Result<AuthCode, AppError.UnexpectedError> {
    const isNewAuthCode = (id === undefined)
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

  get userId(): string {
    return this.props.userId
  }

  get authCodeString(): AuthCodeString {
    return this.props.authCodeString
  }
  
}
