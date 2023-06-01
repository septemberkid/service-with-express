import {Entity, PrimaryKey, Property} from '@mikro-orm/core';
import {IPerson} from '@entity/audit.entity';
import NumericType from '@core/NumericType';

@Entity({
    tableName: 'view_spk_result',
    schema: 'public'
})
export default class ViewSpkResultEntity {
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
        columnType: 'varchar',
        length: 100
    })
    period: string;

    @Property({
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
        columnType: 'int4'
    })
    rank: number;

    @Property({
        columnType: 'numeric',
        type: NumericType
    })
    preference_value: number;

    @Property({
        columnType: 'json'
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