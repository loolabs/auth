import { Router } from 'express'
import { Controllers } from '../../../../../setup/application'
import RateLimit from 'express-rate-limit'

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
})

class UserRouter {
  static using(controllers: Controllers): Router {
    const userRouter = Router()

    userRouter.post('/', (req, res): void => {
      controllers.createUser.execute(req, res)
    })

    userRouter.post('/login', (req, res): void => {
      controllers.loginUser.execute(req, res)
    })

    userRouter.get('/protected', (req, res) => controllers.protectedUser.execute(req, res))
    userRouter.use(limiter)

    return userRouter
  }
}

export { UserRouter }
