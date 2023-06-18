import {Entity, ManyToOne, PrimaryKey, Property, Ref} from '@mikro-orm/core';
import AppUserEntity from '@entity/app/app-user.entity';
import AppRoleEntity from '@entity/app/app-role.entity';

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
        length: 10,
    })
    role_code: string

    @ManyToOne(() => AppUserEntity)
    user?: Ref<AppUserEntity>

    @ManyToOne(() => AppRoleEntity)
    role?: Ref<AppUserEntity>
}