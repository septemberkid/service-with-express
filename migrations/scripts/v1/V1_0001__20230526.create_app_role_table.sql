drop table if exists public.app_role;
create table public.app_role
(
    code      varchar(10)          not null
        constraint app_role_pk
            primary key,
    name      varchar(100)         not null,
    is_active boolean default true not null
);

alter table public.app_role
    owner to postgres;

create index app_role_is_active_index
    on public.app_role (is_active);

create index app_role_name_index
    on public.app_role (name);

