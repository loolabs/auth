import { Application } from './types'
import { setupControllers } from './controllers'
import { setupUseCases } from './use-cases'
import { Persistence } from '../..'

export const setupApplication = (persistence: Persistence): Application => {
  const useCases = setupUseCases(persistence)
  const controllers = setupControllers(useCases)

  return {
    useCases,
    controllers,
  }
}
