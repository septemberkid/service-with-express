drop view if exists public.view_spk_result;
create view public.view_spk_result
            (id, period_id, submission_id, periode, nim, name, rank, preference_value, criteria, status,
             processed_at, processed_by)
as
SELECT tspk.id,
       tspk.period_id,
       student.submission_id,
       tsp.name AS periode,
       student.nim,
       student.name,
       tspk.rank,
       tspk.preference_value,
       tspk.criteria,
       student.status,
       tspk.processed_at,
       tspk.processed_by
FROM trx_spk tspk
         LEFT JOIN trx_submission_period tsp ON tspk.period_id = tsp.id
         LEFT JOIN (SELECT ts.id AS submission_id,
                           ts.period_id,
                           st.id,
                           st.nim,
                           st.name,
                           ts.status
                    FROM trx_submission ts
                             LEFT JOIN mst_student st ON st.id = ts.student_id
                    ORDER BY ts.id) student
                   ON student.submission_id = tspk.submission_id AND student.period_id = tspk.period_id;

alter table public.view_spk_result
    owner to postgres;

