import {Entity, Property} from '@mikro-orm/core';
import TimestampEntity from '@entity/timestamp.entity';

export interface IPerson {
    readonly id: number,
    readonly name: string,
}
@Entity({abstract: true})
export default class AuditEntity extends TimestampEntity {
    @Property({
        type: 'json',
        nullable: true,
    })
    created_by?: IPerson = null

    @Property({
        type: 'json',
        nullable: true
    })
    updated_by?: IPerson = null

    @Property({
        type: 'json',
        nullable: true
    })
    deleted_by?: IPerson = null
}