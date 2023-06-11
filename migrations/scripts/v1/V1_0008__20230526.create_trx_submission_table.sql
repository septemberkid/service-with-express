drop table if exists public.trx_submission;
create table public.trx_submission
(
    id                        integer generated by default as identity
        constraint trx_submission_pk
            primary key,
    period_id                 integer      not null
        constraint trx_submission_trx_submission_period_id_fk
            references public.trx_submission_period
            on update cascade on delete cascade,
    student_id                integer      not null
        constraint trx_submission_mst_student_id_fk
            references public.mst_student
            on update cascade on delete cascade,
    entry_period              varchar(10)  not null,
    semester                  integer      not null,
    class                     varchar(255) not null,
    learning_achievement      text,
    ipk                       numeric      default 0,
    total_sks                 numeric      default 0,
    achievement               numeric      default 0,
    rpl                       numeric      default 0,
    jarkom                    numeric      default 0,
    sistem_operasi            numeric      default 0,
    basis_data                numeric      default 0,
    pengembangan_aplikasi_web numeric      default 0,
    status                    varchar(20)  not null,
    approved_by               json,
    approved_at               timestamp(6),
    created_by                json,
    created_at                timestamp(6) default CURRENT_TIMESTAMP,
    updated_by                json,
    updated_at                timestamp(6),
    deleted_by                json,
    deleted_at                timestamp(6)
);

alter table public.trx_submission
    owner to postgres;