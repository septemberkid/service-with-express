import {Entity, PrimaryKey, Property} from '@mikro-orm/core';

@Entity({
    tableName: 'rel_user_role',
    schema: 'public'
})
export default class RelUserRoleEntity {
    @PrimaryKey({
        columnType: 'int4',
        autoincrement: true
    })
    id: number;

    @Property({
        columnType: 'int4',
    })
    user_id: number;

    @Property({
        columnType: 'varchar',
        length: 10
    })
    role_code: string
}