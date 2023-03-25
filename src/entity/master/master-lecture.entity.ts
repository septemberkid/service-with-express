import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '@entity/base.entity';

@Entity({
  tableName: 'mst_lecture',
  schema: 'public'
})
export default class MasterLectureEntity extends BaseEntity {
  @Property({
    unique: true,
    type: 'uuid',
    nullable: false
  })
  xid: string;

  @Property({
    unique: true,
    type: 'varchar',
    length: 12
  })
  nim: string;

  @Property({
    type: 'varchar',
    length: 100
  })
  name: string;

  @Property({
    unique: true,
    type: 'varchar',
    length: 100
  })
  email: string;
}