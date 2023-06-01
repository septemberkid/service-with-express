import {Entity, Property} from '@mikro-orm/core';
import {nowAsTimestamp} from '@util/date-time';

@Entity({abstract: true})
export default abstract class TimestampEntity {
    @Property({
        name: 'created_at',
        nullable: true,
        onCreate: () => nowAsTimestamp()
    })
    created_at?: string = null;
    
    @Property({
        name: 'updated_at',
        nullable: true,
        onUpdate: () => nowAsTimestamp()
    })
    updated_at?: string = null;

    @Property({
        name: 'deleted_at',
        nullable: true,
    })
    deleted_at?: string = null;
}