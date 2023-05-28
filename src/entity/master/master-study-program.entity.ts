import {Entity, ManyToOne, PrimaryKey, Property, Ref} from '@mikro-orm/core';
import MasterFacultyEntity from '@entity/master/master-faculty.entity';

@Entity({
  tableName: 'mst_study_program',
  schema: 'public',
})
export default class MasterStudyProgramEntity {
  @PrimaryKey({
    type: 'int4',
    autoincrement: true
  })
  id: number;

  @Property({
    type: 'string',
  })
  name: string;

  @Property({
    type: 'int'
  })
  faculty_id: number;

  @Property({
    type: 'boolean',
    default: true
  })
  is_active: boolean;

  @ManyToOne(() => MasterFacultyEntity, {
    nullable: true,
    ref: true
  })
  faculty?: Ref<MasterFacultyEntity>
}