import {Property} from '@mikro-orm/core';
import {nowAsTimestamp} from '@util/date-time';

export default class TimestampEntity {
    @Property({
        name: 'created_at',
        nullable: true,
        onCreate: () => nowAsTimestamp()
    })
    created_at: string;
    
    @Property({
        name: 'updated_at',
        nullable: true,
        onUpdate: () => nowAsTimestamp()
    })
    updated_at: string;
}