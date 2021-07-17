import Joi from 'joi'

export interface CreateUserDTOBody {
  email: string
  password: string
}

export interface CreateUserDTOParams {
  client_id: string
  scope: string
  response_type: string,
  redirect_uri: string
}

export interface CreateUserDTO  {
  body: CreateUserDTOBody,
  params?: CreateUserDTOParams
}

export const createUserDTOBodySchema = Joi.object<CreateUserDTOBody>({
  email: Joi.string().required(),
  password: Joi.string().required(),
}).options({ abortEarly: false })

export const createUserDTOParamsSchema = Joi.object<CreateUserDTOParams>({
  client_id: Joi.string().required(),
  scope: Joi.string().required(),
  response_type: Joi.string().required(),
  redirect_uri: Joi.string().required()
}).options({ abortEarly: false })

export const createUserDTOSchema = Joi.object<CreateUserDTO>({
  body: createUserDTOBodySchema.required(),
  params: createUserDTOParamsSchema.optional() // this ensures that all of the necessary request params for client authentication are present, not just an insufficient subset
}).options({ abortEarly: false })
