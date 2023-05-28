import {Entity, PrimaryKey, Property, wrap} from '@mikro-orm/core';
import TimestampEntity from '@entity/timestamp.entity';

@Entity({
  tableName: 'app_user',
  schema: 'public',
})
export default class AppUserEntity extends TimestampEntity {
  @PrimaryKey({
    autoincrement: true,
    type: 'int4',
  })
  id: number;

  @Property({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  email: string;

  @Property({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Property({
    type: 'text',
  })
  password: string;

  @Property({
    type: 'varchar',
    length: 20,
    name: 'user_type'
  })
  userType: string;

  @Property({
    type: 'varchar',
    length: 20,
  })
  status: string;

  @Property({
    type: 'timestamp',
    nullable: true,
    name: 'last_logged_in_at'
  })
  lastLoggedInAt: string;
  
  toJSON(strict = true, strip = ['password'], ...args: any[]): { [p: string]: any } {
    const o = wrap(this, true).toObject(...args);
    if (strict) {
      strip.forEach(k => delete o[k]);
    }
    return o;
  }
}
