import crypto from 'crypto'

export const getRandom256BitHexCode = () => {
  /*motivation for a 256 bit (= 32 byte) cryptographic key can be found here
    https://www.geeksforgeeks.org/node-js-crypto-randombytes-method/
  */
  const authCodeBuffer = crypto.randomBytes(32)
  return authCodeBuffer.toString('hex')
}

export class AuthCodeString {
  private value: string

  public constructor(hashedValue?: string) {
    if (hashedValue !== undefined) {
      this.value = hashedValue
    } else {
      this.value = getRandom256BitHexCode()
    }
  }

  public getValue() {
    return this.value
  }
}
