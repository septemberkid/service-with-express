import {Entity, PrimaryKey, Property} from '@mikro-orm/core';

@Entity({
  tableName: 'mst_faculty',
  schema: 'public',
})
export default class MasterFacultyEntity {
  @PrimaryKey({
    type: 'int4',
    autoincrement: true
  })
  id: number;

  @Property({
    type: 'string'
  })
  name: string;

  @Property({
    type: 'boolean',
    default: true
  })
  is_active: boolean;
}