import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({
  tableName: 'app_refresh_token',
  schema: 'public'
})
export default class AppRefreshTokenEntity {
  @PrimaryKey({
    columnType: 'uuid'
  })
  id: string;
  
  @Property({
    columnType: 'int4',
  })
  user_id: number;
  
  @Property({
    columnType: 'timestamp'
  })
  expired_at: string;
}