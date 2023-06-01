import {Entity, ManyToOne, PrimaryKey, Property, Ref} from '@mikro-orm/core';
import MstStudyProgramEntity from '@entity/master/mst-study-program.entity';
import TimestampEntity from '@entity/timestamp.entity';

@Entity({
  tableName: 'mst_lecture',
  schema: 'public'
})
export default class MstLectureEntity extends TimestampEntity {
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
  nip: string;

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
    name: 'study_program_id'
  })
  studyProgramId: number;

  @ManyToOne(() => MstStudyProgramEntity, {
    nullable: true,
    ref: true
  })
  studyProgram?: Ref<MstStudyProgramEntity>
}