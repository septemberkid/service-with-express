import {Entity, ManyToOne, PrimaryKey, Property, Ref} from '@mikro-orm/core';
import MstFacultyEntity from '@entity/master/mst-faculty.entity';

@Entity({
  tableName: 'mst_study_program',
  schema: 'public',
})
export default class MstStudyProgramEntity {
  @PrimaryKey({
    columnType: 'int4',
    autoincrement: true
  })
  id: number;

  @Property({
    columnType: 'string',
  })
  name: string;

  @Property({
    columnType: 'int'
  })
  faculty_id: number;

  @Property({
    columnType: 'boolean',
    default: true
  })
  is_active: boolean;

  @ManyToOne(() => MstFacultyEntity, {
    nullable: true,
    ref: true
  })
  faculty?: Ref<MstFacultyEntity>
}