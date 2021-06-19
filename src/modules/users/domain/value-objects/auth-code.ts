import crypto from 'crypto'

export class AuthCodeString {
  private value: string;
  
  public constructor(hashedValue?: string) {
    if(hashedValue){
      this.value = hashedValue
    } else {
      this.value = this.getRandomCode()
    }
  }

  private getRandomCode() {
    /*motivation for a 256 bit (= 32 byte) crypographic key can be found here
      https://www.geeksforgeeks.org/node-js-crypto-randombytes-method/
    */
    const authCodeBuffer = crypto.randomBytes(32)
    return authCodeBuffer.toString('hex')
  }

  public getValue(){
    return this.value
  }
}
