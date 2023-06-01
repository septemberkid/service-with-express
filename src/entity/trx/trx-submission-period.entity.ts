import {Entity, PrimaryKey, Property} from '@mikro-orm/core';
import AuditEntity from '@entity/audit.entity';

@Entity({
    tableName: 'trx_submission_period',
    schema: 'public'
})
export default class TrxSubmissionPeriodEntity extends AuditEntity {
    @PrimaryKey({
        autoincrement: true,
        columnType: 'int4'
    })
    id: number;

    @Property({
        length: 100,
        columnType: 'varchar'
    })
    name: string;

    @Property({
        length: 20,
        columnType: 'varchar'
    })
    status: string;

    @Property({
        columnType: 'date',
    })
    open_start_date: string;

    @Property({
        columnType: 'date',
    })
    open_end_date: string;

    @Property({
        columnType: 'date',
    })
    review_start_date: string;

    @Property({
        columnType: 'date',
    })
    review_end_date: string;
}