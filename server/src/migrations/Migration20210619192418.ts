import { Migration } from '@mikro-orm/migrations';

export class Migration20210619192418 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "auth_secret" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "client_id" varchar(255) not null, "encrypted_client_secret" varchar(255) not null);');
    this.addSql('alter table "auth_secret" add constraint "auth_secret_pkey" primary key ("id");');
    this.addSql('create index "auth_secret_client_id_index" on "auth_secret" ("client_id");');

    this.addSql('create table "auth_code" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "client_id" varchar(255) not null, "auth_code_string" varchar(255) not null);');
    this.addSql('alter table "auth_code" add constraint "auth_code_pkey" primary key ("id");');
    this.addSql('create index "auth_code_auth_code_string_index" on "auth_code" ("auth_code_string");');

    this.addSql('drop table if exists "club" cascade;');

    this.addSql('drop table if exists "club_events" cascade;');

    this.addSql('drop table if exists "event" cascade;');

    this.addSql('drop table if exists "tag" cascade;');

    this.addSql('drop table if exists "tag_clubs" cascade;');

    this.addSql('drop table if exists "tag_events" cascade;');
  }

}
