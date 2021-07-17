import { Router } from 'express'
import { APIRouter } from './types'
import { Controllers } from '../../application'
import { UserRouter } from '../../../modules/users/infra/http/routes/user-router'


const setupV1APIRouter = (controllers: Controllers): APIRouter => {

  const router = Router()
  router.get('/', (_req, res) => {
    return res.json({ message: 'Water, water, water. Loo, loo loo.' })
  })
  router.use('/users/', UserRouter.using(controllers))
  return router
}

const setupVersionedAPIRouter = (controllers: Controllers): APIRouter => {
  const v1Router = setupV1APIRouter(controllers)
  const router = Router()
  router.use('/v1', v1Router)
  return router
}

export { setupVersionedAPIRouter }
