import Joi from 'joi'
import express from 'express'

export interface LoginUserDTOBody {
  email: string
  password: string
}

export interface LoginUserDTOParams {
  client_id: string
  scope: string
  response_type: string
  redirect_uri: string
}

export interface LoginUserDTO {
  req: express.Request
  res: express.Response
  body: LoginUserDTOBody
  params?: LoginUserDTOParams
}

export const loginUserDTOBodySchema = Joi.object<LoginUserDTOBody>({
  email: Joi.string().required(),
  password: Joi.string().required(),
}).options({ abortEarly: false })

export const loginUserDTOSchema = Joi.object<LoginUserDTO>({
  req: Joi.object().required(),
  res: Joi.object().required(),
  body: loginUserDTOBodySchema.required(),
  params: Joi.object().optional(),
}).options({ abortEarly: false })
