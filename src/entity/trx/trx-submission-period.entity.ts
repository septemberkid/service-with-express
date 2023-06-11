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
    start_date: string;

    @Property({
        columnType: 'date',
    })
    end_date: string;
}