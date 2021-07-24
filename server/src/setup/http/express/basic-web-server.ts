import express from 'express'
import session from 'express-session'
import CookieParser from 'cookie-parser'
import cors from 'cors'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import { RequestContext } from '@mikro-orm/core'
import { MikroORM } from '../../database'
import { APIRouter, WebServer } from './types'
import { Controllers, UseCases } from '../../application/types'


interface BasicWebServerOptions {
  mikroORM?: MikroORM
}

const setupBasicWebServer = (apiRouter: APIRouter, _controllers: Controllers, useCases: UseCases, options: BasicWebServerOptions): WebServer => {
  const server = express()
  server.use(cors())
  server.use(CookieParser())
  server.use(express.json())
  server.use(session({ secret: `${process.env.EXPRESS_SESSION_SECRET}` }));

  const entityManager = options?.mikroORM?.em
  if (entityManager !== undefined) {
    server.use((_req, _res, next) => RequestContext.create(entityManager, next))
  }

  server.use(passport.initialize());
  server.use(passport.session());
  passport.use(new LocalStrategy.Strategy({
      usernameField: 'email',
      passwordField: 'password',
  }, function (email, password, cb) {
      useCases.authUser.execute({email, password})
          .then(result => {
              return cb(null, result);
          })
      }
  ));

  passport.serializeUser(function(user: any, done) {
    done(null, user._id.value);
  });
  
  passport.deserializeUser(function(userId: string, cb) {
    useCases.getUser.execute({userId})
    .then(result => {
      if(result.isOk()){
        cb(null, result.value);
      } else {
        cb(result.error, null)
      }
    })
  });

  server.use('/api', apiRouter)

  server.use((_req, res) => res.status(404).json({ message: 'No route found' }))

  return server
}

export { BasicWebServerOptions, setupBasicWebServer }
