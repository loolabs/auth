import { Migration } from '@mikro-orm/migrations';

export class Migration20210810042639 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "auth_secret" add column "is_verified" bool not null;');

    this.addSql('drop table if exists "auth_code" cascade;');
  }

}
