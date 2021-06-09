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
    const authCodeBuffer = crypto.randomBytes(32)
    return authCodeBuffer.toString('hex')
  }

  public getValue(){
    return this.value
  }
}
