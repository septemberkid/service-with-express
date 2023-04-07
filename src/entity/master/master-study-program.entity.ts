import { Collection, Entity, OneToMany, Property, wrap } from '@mikro-orm/core';
import { BaseEntity } from '@entity/base.entity';
import MasterStudentEntity from '@entity/master/master-student.entity';

@Entity({
  tableName: 'mst_study_program',
  schema: 'public',
})
export default class MasterStudyProgramEntity extends BaseEntity {
  @Property({
    unique: true,
    type: 'uuid',
    nullable: false
  })
  xid: string;

  @Property({
    type: 'string',
    nullable: false
  })
  name: string;

  @Property({
    type: 'int'
  })
  faculty_id: number;

  @OneToMany(() => MasterStudentEntity, (s) => s.studyProgram)
  students = new Collection<MasterStudentEntity>(this)
  toJSON(strict = true, strip = ['id', 'faculty_id'], ...args: any[]): { [p: string]: any } {
    const o = wrap(this, true).toObject(...args);
    if (strict) {
      strip.forEach(k => delete o[k]);
    }

    return o;
  }
}