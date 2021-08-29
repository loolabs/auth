import { Migration } from '@mikro-orm/migrations';

export class Migration20210829055229 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop column "access_token";');
    this.addSql('alter table "user" drop column "refresh_token";');

    this.addSql('alter table "auth_secret" add column "decoded_redirect_uri" varchar(255) not null, add column "client_name" varchar(255) not null;');
  }

}
