import { EncryptedClientSecret } from '../encrypted-client-secret'

//Since this is a subclass implementation that mirrors UserPassword, some unit tests are omitted.
describe('EncryptedAuthSecret ValueObject', () => {
  test('When an EncryptedAuthSecret is compared with its hashed original value, it reports them to be the same', async () => {
    const rawEncryptedAuthSecret = 'AciXefCYfMzB782g2zjeStzUt5eCzgnUC7kVNKd2PlNGz3Szr9yalno1m6tjv5EM'
    const hashed = false

    const encryptedAuthSecretResult = EncryptedClientSecret.create({
      value: rawEncryptedAuthSecret,
      hashed,
    })

    const duplicateEncryptedAuthSecretResult = EncryptedClientSecret.create({
      value: rawEncryptedAuthSecret,
      hashed,
    })
    expect(encryptedAuthSecretResult.isOk())
    expect(duplicateEncryptedAuthSecretResult.isOk())
    if (encryptedAuthSecretResult.isErr() || duplicateEncryptedAuthSecretResult.isErr()) throw new Error('Result should be isOk, not isErr')
    const encryptedAuthSecret = encryptedAuthSecretResult.value
    const duplicateEncryptedAuthSecret = duplicateEncryptedAuthSecretResult.value

    const encryptedAuthSecretsEqualResult = await encryptedAuthSecret.compareSecret(await duplicateEncryptedAuthSecret.getHashedValue())
    
    const encryptedAuthSecretsEqual = encryptedAuthSecretsEqualResult.isOk() && encryptedAuthSecretsEqualResult.value
    expect(encryptedAuthSecretsEqual).toBe(true)
  })

  test('When an EncryptedAuthSecret is compared with a different value, it reports them to be different', async () => {
    const rawEncryptedAuthSecret = 'AciXefCYfMzB782g2zjeStzUt5eCzgnUC7kVNKd2PlNGz3Szr9yalno1m6tjv5EM'
    const hashed = false

    const encryptedAuthSecretResult = EncryptedClientSecret.create({
      value: rawEncryptedAuthSecret,
      hashed,
    })

    const wrongEncryptedAuthSecret = 'AciXefCYfMzB782g2zjeStzUt5eCzgnUC7kVNKd2PlNGz3Szr9yalno1m6tjv5Ek'

    const duplicateEncryptedAuthSecretResult = EncryptedClientSecret.create({
      value: wrongEncryptedAuthSecret,
      hashed,
    })
    expect(encryptedAuthSecretResult.isOk())
    expect(duplicateEncryptedAuthSecretResult.isOk())
    if (encryptedAuthSecretResult.isErr() || duplicateEncryptedAuthSecretResult.isErr()) throw new Error('Result should be isOk, not isErr')
    const encryptedAuthSecret = encryptedAuthSecretResult.value
    const duplicateEncryptedAuthSecret = duplicateEncryptedAuthSecretResult.value

    const encryptedAuthSecretsEqualResult = await encryptedAuthSecret.compareSecret(await duplicateEncryptedAuthSecret.getHashedValue())
    
    const encryptedAuthSecretsEqual = encryptedAuthSecretsEqualResult.isOk() && encryptedAuthSecretsEqualResult.value
    expect(encryptedAuthSecretsEqual).toBe(false)
  })
})
