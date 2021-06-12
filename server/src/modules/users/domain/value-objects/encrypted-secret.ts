import bcrypt from 'bcrypt'

import { Result } from '../../../../shared/core/result'
import { ValueObject } from '../../../../shared/domain/value-object'
import { UserValueObjectErrors } from './errors'

export interface EncryptedSecretProps {
  value: string
  hashed: boolean
}

//The protected and public members of this base class can be inherited as needed
export abstract class EncryptedSecret extends ValueObject<EncryptedSecretProps> {
  protected static minLength: number = 64

  public constructor(props: EncryptedSecretProps) {
    super(props)
  }

  protected static isAppropriateLength(secret: string): boolean {
    return secret.length >= this.minLength
  }

  get value(): string {
    return this.props.value
  }

  public isAlreadyHashed(): boolean {
    return this.props.hashed
  }

  public getHashedValue(): Promise<string> {
    return new Promise((resolve) => {
      if (this.isAlreadyHashed()) {
        return resolve(this.props.value)
      } else {
        return resolve(this.hashSecret(this.props.value))
      }
    })
  }

  protected hashSecret(secret: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(secret, 10, (err, hash) => {
        if (err) return reject(err)
        resolve(hash)
      })
    })
  }

  public async compareSecret(hashedSecret: string): Promise<Result<boolean, UserValueObjectErrors.InvalidSecretValueComparison>> {
    if (this.isAlreadyHashed()) return Result.err(new UserValueObjectErrors.InvalidSecretValueComparison("Comparing two hashed secrets"))
    return Result.ok(await this.bcryptCompare(this.value, hashedSecret))
  }

  protected bcryptCompare(plainText: string, hashed: string): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      bcrypt.compare(plainText, hashed, (err, compareResult) => {
        if (err) return resolve(false)
        return resolve(compareResult)
      })
    })
  }
}
