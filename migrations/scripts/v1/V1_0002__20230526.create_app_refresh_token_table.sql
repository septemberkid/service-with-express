drop table if exists public.app_refresh_token;
create table public.app_refresh_token
(
    id         uuid not null constraint app_refresh_token_pk
            primary key,
    user_id    integer   not null
        constraint app_refresh_token_app_user_id_fk
            references public.app_user
            on update cascade on delete cascade,
    expired_at timestamp not null
);

alter table public.app_refresh_token
    owner to postgres;




