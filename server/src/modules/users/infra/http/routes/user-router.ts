import { Router } from 'express'
import { Controllers } from '../../../../../setup/application'

class UserRouter {
  static using(controllers: Controllers): Router {
    const userRouter = Router()

    userRouter.post('/', (req, res): void => {
      controllers.createUser.execute(req, res)
    })

    userRouter.post('/login', (req, res): void => {
      controllers.loginUser.execute(req, res)
    })

    userRouter.get('/protected', (req, res) =>
      controllers.protectedUser.execute(req, res)
    )

    return userRouter
  }
}

export { UserRouter }
