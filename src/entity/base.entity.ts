import { PrimaryKey, Property } from '@mikro-orm/core';
import ModifiedByInterface from '@interface/modified-by.interface';
import { nowAsTimestamp } from '@util/date-time';

export abstract class BaseEntity {

  @PrimaryKey({
    autoincrement: true,
    type: 'int',
  })
  id: number;

  @Property({
    type: 'int4'
  })
  version: number;

  @Property({
    type: 'json',
    nullable: true
  })
  modified_by: ModifiedByInterface;

  @Property({
    type: 'timestamp',
    onCreate: () => nowAsTimestamp()
  })
  created_at: string;

  @Property({
    type: 'timestamp',
    nullable: true,
    onUpdate: () => nowAsTimestamp()
  })
  updated_at: string;
}