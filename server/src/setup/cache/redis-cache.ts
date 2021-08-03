import { RedisAuthCodeRepo } from "../../modules/users/infra/repos/auth-code-repo/implementations/redis-auth-code-repo"
import { AuthCodeEntity } from "../../shared/infra/cache/entities/auth-code-entity"
import { RedisRepository } from "../../shared/infra/cache/redis-repository"
import { Cache, Repos } from "./types"

interface RedisEntityRepos {
  authCode: RedisRepository<AuthCodeEntity>
}

const setupRedisEntityRepos = (): RedisEntityRepos => {
  return {
    authCode: new RedisRepository<AuthCodeEntity>()
  }
}

interface RedisRepos extends Repos {
  authCode: RedisAuthCodeRepo
}

const setupRedisRepos = (redisEntityRepos: RedisEntityRepos): RedisRepos => {
  return {
    authCode: new RedisAuthCodeRepo(redisEntityRepos.authCode)
  }
}

interface RedisCache extends Cache {
  entityRepos: RedisEntityRepos
  repos: RedisRepos
}

const setupRedisCache = async (): Promise<RedisCache> => {
  const entityRepos = setupRedisEntityRepos()
  const repos = setupRedisRepos(entityRepos)
  
  return {
    entityRepos,
    repos
  }
}
  
export { RedisEntityRepos, RedisRepos, RedisCache, setupRedisCache }
