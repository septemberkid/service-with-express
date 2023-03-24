import { Entity, PrimaryKey, Property, wrap } from '@mikro-orm/core';
import ModifiedByInterface from '@interface/modified-by.interface';

@Entity({
  tableName: 'mst_program_study',
  schema: 'public'
})
export default class ProgramStudyMasterEntity {
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

  @Property({
    type: 'int'
  })
  faculty_id: number;

  @Property()
  version: number;

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
  toJSON(strict = true, strip = ['id', 'faculty_id'], ...args: any[]): { [p: string]: any } {
    const o = wrap(this, true).toObject(...args);
    if (strict) {
      strip.forEach(k => delete o[k]);
    }

    return o;
  }
}