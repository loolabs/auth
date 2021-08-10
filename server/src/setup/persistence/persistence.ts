import { DB } from '../database'
import { Cache } from '../cache'

export interface Persistence {
  db: DB
  cache: Cache
}
