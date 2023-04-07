import { Entity, Property, wrap } from '@mikro-orm/core';
import { BaseEntity } from '@entity/base.entity';

@Entity({
  tableName: 'mst_faculty',
  schema: 'public',
})
export default class MasterFacultyEntity extends BaseEntity {
  @Property({
    unique: true,
    type: 'uuid',
    nullable: false
  })
  xid: string;

  @Property({
    type: 'string',
    nullable: false
  })
  name: string;

  toJSON(strict = true, strip = ['id'], ...args: any[]): { [p: string]: any } {
    const o = wrap(this, true).toObject(...args);
    if (strict) {
      strip.forEach(k => delete o[k]);
    }
    return o;
  }
}