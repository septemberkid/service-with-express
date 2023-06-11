import {Entity, PrimaryKey, Property} from '@mikro-orm/core';

@Entity({
  tableName: 'mst_faculty',
  schema: 'public',
})
export default class MstFacultyEntity {
  @PrimaryKey({
    columnType: 'int4',
    autoincrement: true
  })
  id: number;

  @Property({
    columnType: 'string'
  })
  name: string;

  @Property({
    columnType: 'boolean',
    default: true
  })
  is_active: boolean;
}