import { Entity, PrimaryKey, Property, wrap } from '@mikro-orm/core';

@Entity({
  tableName: 'app_user_role',
  schema: 'public'
})
export default class AppUserRoleEntity {
  @PrimaryKey({
    autoincrement: true
  })
  id: number;

  @Property({
    type: 'int',
  })
  user_id: number;

  @Property({
    type: 'varchar',
    length: 10,
  })
  role_code: string;

  @Property({
    type: 'int',
    nullable: true
  })
  faculty_id: number;

  @Property({
    type: 'int',
    nullable: true
  })
  program_study_id: number;

  toJSON(strict = true, strip = ['id', 'user_id'], ...args: any[]): { [p: string]: any } {
    const o = wrap(this, true).toObject(...args);
    if (strict) {
      strip.forEach(k => delete o[k]);
    }
    return o;
  }
}