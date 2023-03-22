import { Entity, PrimaryKey, Property, wrap } from '@mikro-orm/core';
import ModifiedByInterface from '@interface/modified-by.interface';

@Entity({
  tableName: 'mst_faculty',
  schema: 'public'
})
export default class FacultyMasterEntity {
  @PrimaryKey()
  @Property({
    autoincrement: true,
  })
  id: number;

  @Property({
    unique: true,
    type: 'uuid'
  })
  xid: string;

  @Property({
    type: 'string',
  })
  name: string;

  @Property()
  version: number;

  @Property()
  metadata: string;

  @Property({
    type: 'json'
  })
  modified_by: ModifiedByInterface

  @Property({
    type: 'timestamp'
  })
  created_at: string;

  @Property({
    type: 'timestamp'
  })
  updated_at: string;

  toJSON(strict = true, strip = ['id'], ...args: any[]): { [p: string]: any } {
    const o = wrap(this, true).toObject(...args);
    if (strict) {
      strip.forEach(k => delete o[k]);
    }

    return o;
  }
}