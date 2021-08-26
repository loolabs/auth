import Joi from 'joi'

export interface DiscoverSPDTO {
  client_name: string
  redirect_uri: string
}

export const discoverSPDTOSchema = Joi.object<DiscoverSPDTO>({
  client_name: Joi.string().required(),
  redirect_uri: Joi.string().uri().required(),
}).options({ abortEarly: false })
