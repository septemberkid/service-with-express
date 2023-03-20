import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({
  tableName: 'app_user',
  schema: 'public',
})
export class AppUserEntity extends BaseEntity<any, any> {
  @PrimaryKey()
  @Property({
    autoincrement: true,
    fieldName: 'id',
  })
  id: number;

  @Property({
    fieldName: 'username',
    name: 'user',
    type: 'string',
  })
  username: string;
}
