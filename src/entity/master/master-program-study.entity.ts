import { Entity, EntityRepositoryType, Property, wrap } from '@mikro-orm/core';
import { BaseEntity } from '@entity/base.entity';
import PaginationRepository from '@repository/pagination.repository';

@Entity({
  tableName: 'mst_program_study',
  schema: 'public',
  customRepository: () => PaginationRepository<MasterProgramStudyEntity>
})
export default class MasterProgramStudyEntity extends BaseEntity {
  [EntityRepositoryType]?: PaginationRepository<MasterProgramStudyEntity>;
  
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

  toJSON(strict = true, strip = ['id', 'faculty_id'], ...args: any[]): { [p: string]: any } {
    const o = wrap(this, true).toObject(...args);
    if (strict) {
      strip.forEach(k => delete o[k]);
    }

    return o;
  }
}