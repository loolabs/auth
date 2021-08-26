import { AuthCodeString } from '../auth-code-string'

describe('AuthCodeString ValueObject', () => {
  test("When an AuthCodeString is created, it's value is hex", async () => {
    const authCodeResult = new AuthCodeString()

    const hexRegex = /[0-9A-Fa-f]{6}/g

    expect(hexRegex.test(authCodeResult.getValue())).toBe(true)
  })
})
