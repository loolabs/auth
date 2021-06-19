import { Result } from '../../../../shared/core/result'
import { EncryptedSecret } from './encrypted-secret'
import { UserValueObjectErrors } from './errors'

export interface UserPasswordProps {
  value: string
  hashed: boolean
}

export class UserPassword extends EncryptedSecret {
  protected static minLength: number = 8

  public static create(
    props: UserPasswordProps
  ): Result<UserPassword, UserValueObjectErrors.InvalidSecretValue> {
    if (!props.hashed && !this.isAppropriateLength(props.value)) {
      return Result.err(
        new UserValueObjectErrors.InvalidSecretValue(`Password doesn't meet criteria [${this.minLength} chars min].`)
      )
    }

    return Result.ok(
      new UserPassword({
        value: props.value,
        hashed: props.hashed,
      })
    )
  }

  private constructor(props: UserPasswordProps) {
    super(props)
  }
}
