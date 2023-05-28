import {Entity, LoadStrategy, ManyToOne, PrimaryKey, Property, Ref} from '@mikro-orm/core';
import TimestampEntity from '@entity/timestamp.entity';
import MasterStudyProgramEntity from "@entity/master/master-study-program.entity";

@Entity({
  tableName: 'mst_student',
  schema: 'public'
})
export default class MasterStudentEntity extends TimestampEntity {
  @PrimaryKey({
    autoincrement: true,
    type: 'int',
  })
  id: number;

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
    type: 'int4',
    name: 'study_program_id'
  })
  studyProgramId: number;

  @ManyToOne(() => MasterStudyProgramEntity, {
    nullable: true,
    ref: true
  })
  studyProgram?: Ref<MasterStudyProgramEntity>
}