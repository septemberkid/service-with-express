import {Entity, Property} from '@mikro-orm/core';
import {ICreatedBy, IUpdatedBy} from '@interface/entity.interface';
import {nowAsTimestamp} from '@util/date-time';

@Entity({abstract: true})
export abstract class AuditEntity {
    @Property({
        type: 'json',
        nullable: true
    })
    created_by: ICreatedBy

    @Property({
        type: 'timestamp',
        nullable: true,
        onCreate: () => nowAsTimestamp()
    })
    created_at: string

    @Property({
        type: 'json',
        nullable: true
    })
    updated_by: IUpdatedBy

    @Property({
        type: 'timestamp',
        nullable: true,
        onUpdate: () => nowAsTimestamp()
    })
    updated_at: string
}