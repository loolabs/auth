import { v4 } from 'uuid'

export abstract class RedisEntity {
  id = v4()
  public abstract getEntityKey(): string
  public abstract toJSON(): object
}
