import AuditEntity, {IPerson} from '@entity/audit.entity';
import {Entity, ManyToOne, PrimaryKey, Property, Ref} from '@mikro-orm/core';
import NumericType from '@core/NumericType';
import MstStudentEntity from '@entity/master/mst-student.entity';

@Entity({
    tableName: 'trx_submission',
    schema: 'public'
})
export default class TrxSubmissionEntity extends AuditEntity {
    @PrimaryKey({
        autoincrement: true,
        columnType: 'int4'
    })
    id: number;

    @Property({
        columnType: 'int4'
    })
    period_id: number;

    @Property({
        columnType: 'int4'
    })
    student_id: number;

    @Property({
        columnType: 'varchar',
        length: 10
    })
    entry_period: string;

    @Property({
        columnType: 'int4',
    })
    semester: number;

    @Property({
        columnType: 'varchar',
    })
    class: string;

    @Property({
        columnType: 'text',
        nullable: true
    })
    learning_achievement?: string;

    @Property({
        nullable: true,
        default: 0,
        columnType: 'numeric',
        type: NumericType,
    })
    ipk: number;

    @Property({
        columnType: 'numeric',
        nullable: true,
        default: 0,
        type: NumericType,
    })
    total_sks: number;

    @Property({
        columnType: 'numeric',
        nullable: true,
        default: 0,
        type: NumericType,
    })
    achievement: number;

    @Property({
        columnType: 'numeric',
        nullable: true,
        default: 0,
        type: NumericType,
    })
    rpl: number;

    @Property({
        columnType: 'numeric',
        nullable: true,
        default: 0,
        type: NumericType,
    })
    jarkom: number;

    @Property({
        columnType: 'numeric',
        nullable: true,
        default: 0,
        type: NumericType,
    })
    sistem_operasi: number;

    @Property({
        columnType: 'numeric',
        nullable: true,
        default: 0,
        type: NumericType,
    })
    basis_data: number;

    @Property({
        columnType: 'numeric',
        nullable: true,
        default: 0,
        type: NumericType,
    })
    pengembangan_aplikasi_web: number;

    @Property({
        columnType: 'varchar',
        length: 20
    })
    status: string;

    @Property({
        type: 'json',
        nullable: true,
    })
    approved_by?: IPerson & {readonly reason?: string} = null

    @Property({
        name: 'approved_at',
        nullable: true,
    })
    approved_at?: string = null;

    @ManyToOne(() => MstStudentEntity, {
        nullable: true,
        ref: true
    })
    student?: Ref<MstStudentEntity>
}