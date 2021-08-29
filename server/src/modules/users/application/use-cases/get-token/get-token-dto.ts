import Joi from 'joi'

export const SUPPORTED_OPEN_ID_GRANT_TYPES = ['authorization_code']
export const SUPPORTED_OPEN_ID_RESPONSE_TYPES = ['id']

export interface GetTokenDTOParams {
  code: string
  grant_type: string
  response_type: string
}

export interface GetTokenDTO {
  authHeader: string
  params: GetTokenDTOParams
}

export const getTokenDTOParamsSchema = Joi.object<GetTokenDTOParams>({
  code: Joi.string().required(),
  grant_type: Joi.string()
    .valid(...SUPPORTED_OPEN_ID_GRANT_TYPES)
    .required(),
  response_type: Joi.string()
    .valid(...SUPPORTED_OPEN_ID_RESPONSE_TYPES)
    .required(),
}).options({ abortEarly: false })

export const getTokenDTOSchema = Joi.object<GetTokenDTO>({
  //Example: Authorization: Basic 3904238orfiefiekfhjri3u24r789
  authHeader: Joi.string().pattern(new RegExp('^Basic .+$')).required(),
  params: getTokenDTOParamsSchema.required(),
}).options({ abortEarly: false })
