import { Result } from '../../../../shared/core/result'
import { EncryptedSecret } from './encrypted-secret'
import { UserValueObjectErrors } from './errors'

export interface EncryptedClientSecretProps {
  value: string
  hashed: boolean
}

export class EncryptedClientSecret extends EncryptedSecret {
  protected static minLength: number = 64
  
  public static create(
    props: EncryptedClientSecretProps
  ): Result<EncryptedClientSecret, UserValueObjectErrors.InvalidSecretValue> {
    if (!props.hashed && !this.isAppropriateLength(props.value)) {
      return Result.err(
        new UserValueObjectErrors.InvalidSecretValue(`Encrypted auth secret doesn't meet criteria [${this.minLength} chars min].`)
      )
    }

    return Result.ok(
      new EncryptedClientSecret({
        value: props.value,
        hashed: props.hashed,
      })
    )
  }

  private constructor(props: EncryptedClientSecretProps) {
    super(props)
  }
}
