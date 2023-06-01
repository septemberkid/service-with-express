-- app role
INSERT INTO "app_role" ("code", "name") VALUES ('STUDENT', 'MAHASISWA');
INSERT INTO "app_role" ("code", "name") VALUES ('KAPRODI', 'KAPRODI');
INSERT INTO "app_role" ("code", "name") VALUES ('SEKPRODI', 'SEKRETARIS PRODI');

-- master faculty
INSERT INTO "mst_faculty" ("id", "name") VALUES (1, 'Fakultas Ekonomi & Bisnis');
INSERT INTO "mst_faculty" ("id", "name") VALUES (2, 'Fakultas Teknik');
INSERT INTO "mst_faculty" ("id", "name") VALUES (3, 'Fakultas Ilmu Budaya');
INSERT INTO "mst_faculty" ("id", "name") VALUES (4, 'Fakultas Desain Komunikasi dan Visual (DKV)');
INSERT INTO "mst_faculty" ("id", "name") VALUES (5, 'Fakultas Ilmu Sosial dan Ilmu Politik');

-- master study program
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (1, 'Program Studi Akuntansi S1', 1);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (2, 'Program Studi Akuntansi D3', 1);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (3, 'Program Studi Magister Akuntansi', 1);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (4, 'Program Profesi Akuntansi (PPAk)', 1);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (5, 'Program Studi Manajemen S1', 1);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (6, 'Program Studi Manajemen D3', 1);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (7, 'Program Studi Magister Manajemen', 1);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (8, 'Program Studi Teknik Informatika S1', 2);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (9, 'Program Studi Teknik Industri S1', 2);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (10, 'Program Studi Sistem Informasi S1', 2);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (11, 'Program Studi Teknik Elektro S1', 2);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (12, 'Program Studi Teknik Mesin D3', 2);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (13, 'Program Studi Teknik Mesin S1', 2);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (14, 'Program Studi Teknik Sipil S1', 2);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (15, 'Program Studi Bahasa Jepang S1', 3);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (16, 'Program Studi Bahasa Jepang D3', 3);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (17, 'Program Studi Bahasa Inggris S1', 3);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (18, 'Program Studi Desain Grafis D4', 4);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (19, 'Program Studi Multimedia D3', 4);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (20, 'Program Studi Perdagangan Internasional ', 5);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (21, 'Program Studi Perpustakaan & Sains Informasi', 5);
INSERT INTO "mst_study_program" ("id", "name", "faculty_id") VALUES (22, 'Program Studi Produksi Film & Televisi ', 5);

INSERT INTO mst_lecture (nip, name, email, study_program_id) VALUES ('00000001', 'Ari Purno Wahyu, S.Kom., M.Kom.', 'ari.purno@widyatama.ac.id', 8);
INSERT INTO mst_lecture (nip, name, email, study_program_id) VALUES ('00000002', 'Yan Puspitarani, S.T., M.T.', 'yan.puspitarani@widyatama.ac.id', 8);

with firstLecture as (
    INSERT INTO app_user (email, name, status, user_type, password) VALUES ('ari.purno@widyatama.ac.id', 'Ari Purno Wahyu, S.Kom., M.Kom.', 'ACTIVE', 'LECTURE', '$2b$10$XUfBc9IuhiTJM3tG33LHVeFVu88hIKeHnTO0y2wXGU6uUTiF9timi') RETURNING id
)
INSERT INTO rel_user_role (user_id, role_code) VALUES ((SELECT id from firstLecture), 'KAPRODI');

with secondLecture as (
    INSERT INTO app_user (email, name, status, user_type, password) VALUES ('yan.puspitarani@widyatama.ac.id', 'Yan Puspitarani, S.T., M.T.', 'ACTIVE', 'LECTURE', '$2b$10$XUfBc9IuhiTJM3tG33LHVeFVu88hIKeHnTO0y2wXGU6uUTiF9timi') RETURNING id
)
INSERT INTO rel_user_role (user_id, role_code) VALUES ((SELECT id from secondLecture), 'SEKPRODI');