import express from 'express'
import Joi from 'joi'

export const SUPPORTED_OPEN_ID_RESPONSE_TYPES = ['code']
export const SUPPORTED_OPEN_ID_SCOPE = ['openid']

export interface CreateUserDTOBody {
  email: string
  password: string
}

export interface CreateUserDTOParams {
  client_id: string
  scope: string
  response_type: string
  redirect_uri: string
}

export interface CreateUserDTO {
  req: express.Request
  res: express.Response
  body: CreateUserDTOBody
  params?: CreateUserDTOParams
}

export const createUserDTOBodySchema = Joi.object<CreateUserDTOBody>({
  email: Joi.string().required(),
  password: Joi.string().required(),
}).options({ abortEarly: false })

export const createUserDTOSchema = Joi.object<CreateUserDTO>({
  req: Joi.object().required(),
  res: Joi.object().required(),
  body: createUserDTOBodySchema.required(),
  params: Joi.object().optional(),
}).options({ abortEarly: false })
