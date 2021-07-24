import Joi from 'joi'
import { User } from '../../../domain/entities/user'

export interface ProtectedUserDTO {
  user: User
}

export const protectedUserDTOSchema = Joi.object<ProtectedUserDTO>({
  user: Joi.object().required()
}).options({ abortEarly: false })
