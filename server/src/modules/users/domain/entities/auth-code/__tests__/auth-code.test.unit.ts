import { DomainEvents } from '../../../../../../shared/domain/events/domain-events'
import { AuthCodeCreated } from '../../../events/auth-code-created'
import { AuthCodeString } from '../../../value-objects/auth-code-string'
import { AuthCode } from '../auth-code'

jest.mock('../../../events/auth-code-created')
jest.mock('../../../../../../shared/domain/events/domain-events')

describe('Authcode AggregateRoot', () => {
  test('it adds a AuthCodeCreated domain event on new AuthCode creation', () => {
    AuthCode.create({
      clientId: 'test_client_id',
      userId: 'test_user_id',
      userEmail: 'testemail@uwaterloo.ca',
      userEmailVerified: false,
      authCodeString: new AuthCodeString('test_auth_code'),
    })

    expect(AuthCodeCreated).toBeCalled()
    expect(DomainEvents.markAggregateForDispatch).toBeCalled()
  })
})
