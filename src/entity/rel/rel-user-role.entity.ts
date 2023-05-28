import {Entity, PrimaryKey, Property} from '@mikro-orm/core';

@Entity({
    tableName: 'rel_user_role',
    schema: 'public'
})
export default class RelUserRoleEntity {
    @PrimaryKey({
        type: 'int4',
        autoincrement: true
    })
    id: number;

    @Property({
        type: 'int4',
    })
    user_id: number;

    @Property({
        type: 'varchar',
        length: 10
    })
    role_code: string
}