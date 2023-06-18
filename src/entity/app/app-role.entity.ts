import {Collection, Entity, ManyToMany, PrimaryKey, Property} from '@mikro-orm/core';
import AppUserEntity from '@entity/app/app-user.entity';

@Entity({
  tableName: 'app_role',
  schema: 'public'
})
export default class AppRoleEntity {
  @PrimaryKey({
    autoincrement: false,
    columnType: 'varchar'
  })
  code: string;

  @Property({
    columnType: 'varchar',
  })
  name: string;

  @Property({
    columnType: 'boolean',
    default: true
  })
  is_active: boolean;


  @ManyToMany({
    entity: () => AppUserEntity,
    mappedBy: (e) => e.roles,
  })
  users = new Collection<AppUserEntity>(this)
}