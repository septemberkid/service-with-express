import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({
  tableName: 'app_refresh_token',
  schema: 'public'
})
export default class AppRefreshTokenEntity {
  @PrimaryKey({
    type: 'uuid'
  })
  id: string;
  
  @Property({
    type: 'int4',
  })
  user_id: number;
  
  @Property({
    type: 'timestamp'
  })
  expired_at: string;
}