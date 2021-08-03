import { RedisClient } from "../../../setup/cache/redis"
import { AppError } from "../../core/app-error"
import { Result } from "../../core/result"
import { RedisEntity } from "./redis-entity"

export type RedisSaveEntityResponse = Result<RedisSaveEntitySuccess, RedisSaveEntityError>
export type RedisSaveEntitySuccess = boolean
export type RedisSaveEntityError = AppError.UnexpectedError

export type RedisGetEntityResponse<RedisEntityType> = Result<RedisEntityType, RedisGetEntityError>
export type RedisGetEntityError = AppError.UnexpectedError

export type RedisDeleteEntityResponse = Result<RedisDeleteEntitySuccess, RedisDeleteEntityError>
export type RedisDeleteEntitySuccess = boolean
export type RedisDeleteEntityError = AppError.UnexpectedError
export interface RedisSetOptions {
    mode: string
    value: number
}

export class RedisRepository<RedisEntityType> {

    async getEntity(entityKey: string): Promise<RedisGetEntityResponse<RedisEntityType>>{
        return new Promise((resolve) => {
            RedisClient.get(entityKey, (err, value) => {
                if(err || value === null){
                    resolve(Result.err(new AppError.UnexpectedError("Redis get operation failed.")))
                } else {
                    resolve(Result.ok(JSON.parse(value) as RedisEntityType)) 
                }
            })
        })
    }

    async saveEntity(redisEntity: RedisEntity, options?: RedisSetOptions): Promise<RedisSaveEntityResponse>{
        return new Promise((resolve) => {
            const callback = (err: Error | null) => {
                if(err){
                    resolve(Result.err(new AppError.UnexpectedError("Redis save operation failed.")))
                } else {
                    resolve(Result.ok(true))
                }
            }
            if(options){
                RedisClient.set(redisEntity.getEntityKey(), JSON.stringify(redisEntity), options.mode, options.value, callback)
            } else {
                RedisClient.set(redisEntity.getEntityKey(), JSON.stringify(redisEntity),  callback)
            } 
        })
    }

    async removeEntity(redisEntity: RedisEntity): Promise<RedisDeleteEntityResponse>{
        return new Promise((resolve) => {
            RedisClient.del(redisEntity.getEntityKey(), (err) => {
                if(err){
                    resolve(Result.err(new AppError.UnexpectedError("Redis delete operation failed.")))
                } else {
                    resolve(Result.ok(true))
                }
            })
        })
    }

}
