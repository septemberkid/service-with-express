import {Entity, PrimaryKey, Property} from '@mikro-orm/core';
import {IPerson} from '@entity/audit.entity';
import NumericType from '@core/NumericType';

@Entity({
    tableName: 'trx_spk',
    schema: 'public'
})
export default class TrxSpkEntity {
    @PrimaryKey({
        autoincrement: true,
        columnType: 'int4'
    })
    id?: number;

    @Property({
        columnType: 'int4'
    })
    period_id: number;

    @Property({
        columnType: 'int4'
    })
    submission_id: number;

    @Property({
        columnType: 'int4'
    })
    rank: number;

    @Property({
        columnType: 'numeric',
        type: NumericType
    })
    preference_value: number;

    @Property({
        columnType: 'json',
    })
    criteria: string;

    @Property({
        columnType: 'json',
    })
    processed_by: IPerson;

    @Property({
        columnType: 'timestamp',
    })
    processed_at: string;
}