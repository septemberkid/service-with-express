import { Entity, Property, wrap } from '@mikro-orm/core';
import { BaseEntity } from '@entity/base.entity';

@Entity({
  tableName: 'app_user',
  schema: 'public',
})
export default class AppUserEntity extends BaseEntity {
  @Property({
    type: 'uuid',
    nullable: false
  })
  xid: string;

  @Property({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false
  })
  email: string;

  @Property({
    type: 'text',
    nullable: false
  })
  password: string;

  @Property({
    type: 'varchar',
    length: 20,
    nullable: false
  })
  status: string;

  @Property({
    type: 'timestamp',
    nullable: true,
  })
  last_logged_in_at: string;

  @Property({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  user_type: string;

  toJSON(strict = true, strip = ['id', 'email', 'password'], ...args: any[]): { [p: string]: any } {
    const o = wrap(this, true).toObject(...args);
    if (strict) {
      strip.forEach(k => delete o[k]);
    }
    return o;
  }
}
