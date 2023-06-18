import {Collection, Entity, ManyToMany, PrimaryKey, Property, wrap} from '@mikro-orm/core';
import TimestampEntity from '@entity/timestamp.entity';
import AppRoleEntity from '@entity/app/app-role.entity';
import RelUserRoleEntity from '@entity/rel/rel-user-role.entity';

@Entity({
  tableName: 'app_user',
  schema: 'public',
})
export default class AppUserEntity extends TimestampEntity {
  @PrimaryKey({
    autoincrement: true,
    columnType: 'int4',
  })
  id: number;

  @Property({
    columnType: 'varchar',
    length: 100,
    unique: true,
  })
  email: string;

  @Property({
    columnType: 'varchar',
    length: 100,
  })
  name: string;

  @Property({
    columnType: 'text',
  })
  password: string;

  @Property({
    columnType: 'varchar',
    length: 20,
  })
  user_type: string;

  @Property({
    columnType: 'varchar',
    length: 20,
  })
  status: string;

  @Property({
    columnType: 'timestamp',
    nullable: true,
  })
  last_logged_in_at: string;
  
  toJSON(strict = true, strip = ['password'], ...args: any[]): { [p: string]: any } {
    const o = wrap(this, true).toObject(...args);
    if (strict) {
      strip.forEach(k => delete o[k]);
    }
    return o;
  }

  @ManyToMany({
    entity: () => AppRoleEntity,
    pivotEntity: () => RelUserRoleEntity,
    joinColumns: ['user_id'],
    inverseJoinColumns: ['role_code']
  })
  roles = new Collection<AppRoleEntity>(this)
}
