import { Entity, LoadStrategy, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '@entity/base.entity';
import MasterFacultyEntity from '@entity/master/master-faculty.entity';
import MasterStudyProgramEntity from '@entity/master/master-study-program.entity';

@Entity({
  tableName: 'mst_student',
  schema: 'public'
})
export default class MasterStudentEntity extends BaseEntity {
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

  @Property({
    type: 'int',
  })
  faculty_id: number;

  @Property({
    type: 'int',
  })
  study_program_id: number;

  @ManyToOne(() => MasterFacultyEntity, {
    strategy: LoadStrategy.JOINED,
    nullable: true
  })
  faculty?: MasterFacultyEntity

  @ManyToOne(() => MasterStudyProgramEntity, {
    strategy: LoadStrategy.JOINED,
    nullable: true
  })
  studyProgram?: MasterStudyProgramEntity
}