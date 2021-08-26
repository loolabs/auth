import Joi from 'joi'
import express from 'express'

export const SUPPORTED_OPEN_ID_RESPONSE_TYPES = ['code']
export const SUPPORTED_OPEN_ID_SCOPE = ['openid']

export interface AuthorizeUserDTOParams {
  client_id: string
  scope: string
  response_type: string
  redirect_uri: string
}

export interface AuthorizeUserDTO {
  req: express.Request
  params: AuthorizeUserDTOParams
}

export const AuthorizeUserDTOParamsSchema = Joi.object<AuthorizeUserDTOParams>({
  client_id: Joi.string().required(),
  scope: Joi.string()
    .valid(...SUPPORTED_OPEN_ID_SCOPE)
    .required(),
  response_type: Joi.string()
    .valid(...SUPPORTED_OPEN_ID_RESPONSE_TYPES)
    .required(),
  redirect_uri: Joi.string().uri().required(),
}).options({ abortEarly: false })

export const AuthorizeUserDTOSchema = Joi.object<AuthorizeUserDTO>({
  req: Joi.object().required(),
  params: AuthorizeUserDTOParamsSchema.optional(), // this ensures that all of the necessary request params for client authentication are present, not just an insufficient subset
}).options({ abortEarly: false })
