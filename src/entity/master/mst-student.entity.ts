import {Entity, ManyToOne, OneToMany, PrimaryKey, Property, Ref} from '@mikro-orm/core';
import TimestampEntity from '@entity/timestamp.entity';
import MstStudyProgramEntity from '@entity/master/mst-study-program.entity';
import TrxSubmissionEntity from '@entity/trx/trx-submission.entity';

@Entity({
  tableName: 'mst_student',
  schema: 'public'
})
export default class MstStudentEntity extends TimestampEntity {
  @PrimaryKey({
    autoincrement: true,
    columnType: 'int',
  })
  id: number;

  @Property({
    unique: true,
    columnType: 'varchar',
    length: 12
  })
  nim: string;

  @Property({
    columnType: 'varchar',
    length: 100
  })
  name: string;

  @Property({
    unique: true,
    columnType: 'varchar',
    length: 100
  })
  email: string;

  @Property({
    columnType: 'int4',
  })
  study_program_id: number;

  @ManyToOne(() => MstStudyProgramEntity, {
    nullable: true,
    ref: true
  })
  studyProgram?: Ref<MstStudyProgramEntity>

  @OneToMany(() => TrxSubmissionEntity, (submission) =>submission.student)
  submissions: TrxSubmissionEntity[]
}