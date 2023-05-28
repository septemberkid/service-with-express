-- app role
INSERT INTO "app_role" ("code", "name") VALUES ('STUDENT', 'MAHASISWA');
INSERT INTO "app_role" ("code", "name") VALUES ('KAPRODI', 'KAPRODI');

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

INSERT INTO "public"."mst_criteria" ("name", "score", "order") VALUES ('IPK',0.033819086228285,'1');
INSERT INTO "public"."mst_criteria" ("name", "score", "order") VALUES ('Jumlah SKS yang diambil',0.184802000913143,'2');
INSERT INTO "public"."mst_criteria" ("name", "score", "order") VALUES ('Kesesuaian Capaian Pembelajaran',0.232137495501076,'3');
INSERT INTO "public"."mst_criteria" ("name", "score", "order") VALUES ('Nilai MK RPL',0.151324580396684,'4');
INSERT INTO "public"."mst_criteria" ("name", "score", "order") VALUES ('Nilai MK Jarkom',0.0821974188547088,'5');
INSERT INTO "public"."mst_criteria" ("name", "score", "order") VALUES ('Nilai MK Sistem Operasi',0.0821974188547088,'6');
INSERT INTO "public"."mst_criteria" ("name", "score", "order") VALUES ('Nilai MK Basis Data',0.0821974188547088,'7');
INSERT INTO "public"."mst_criteria" ("name", "score", "order") VALUES ('Nilai MK Pengembangan Aplikasi Berbasis Web',0.151324580396684,'8');
