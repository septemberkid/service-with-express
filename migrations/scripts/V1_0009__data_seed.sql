-- app role
INSERT INTO "app_role" ("code", "name") VALUES ('STUDENT', 'MAHASISWA');
INSERT INTO "app_role" ("code", "name") VALUES ('KAPRODI', 'KAPRODI');

-- master reference
INSERT INTO "mst_reference" ("id", "type", "value", "name", "is_active") VALUES (1, 'USER_STATUS', 'ACTIVE', 'ACTIVE', 't');
INSERT INTO "mst_reference" ("id", "type", "value", "name", "is_active") VALUES (2, 'USER_STATUS', 'INACTIVE', 'INACTIVE', 't');
INSERT INTO "mst_reference" ("id", "type", "value", "name", "is_active") VALUES (3, 'SUBMISSION_STATUS', 'DRAFT', 'DRAFT', 't');
INSERT INTO "mst_reference" ("id", "type", "value", "name", "is_active") VALUES (4, 'SUBMISSION_STATUS', 'NEW', 'NEW', 't');
INSERT INTO "mst_reference" ("id", "type", "value", "name", "is_active") VALUES (5, 'SUBMISSION_STATUS', 'APPROVED', 'APPROVED', 't');
INSERT INTO "mst_reference" ("id", "type", "value", "name", "is_active") VALUES (6, 'SUBMISSION_STATUS', 'REJECTED', 'REJECTED', 't');

-- master faculty
INSERT INTO "mst_faculty" ("id", "xid", "name", "version", "modified_by", "created_at", "updated_at") VALUES (2, 'a5dd6247-10c2-4506-bffd-c5edb0b821d5', 'Fakultas Teknik', 1, NULL, '2023-03-22 17:29:51.730744', NULL);
INSERT INTO "mst_faculty" ("id", "xid", "name", "version", "modified_by", "created_at", "updated_at") VALUES (3, 'ef6fef71-2964-45a2-ae2e-45943a545ec8', 'Fakultas Ilmu Budaya', 1, NULL, '2023-03-22 17:29:51.731894', NULL);
INSERT INTO "mst_faculty" ("id", "xid", "name", "version", "modified_by", "created_at", "updated_at") VALUES (4, '3c167802-9564-441e-bc7b-815271e394c0', 'Fakultas Desain Komunikasi dan Visual (DKV)', 1, NULL, '2023-03-22 17:29:51.732383', NULL);
INSERT INTO "mst_faculty" ("id", "xid", "name", "version", "modified_by", "created_at", "updated_at") VALUES (5, '47b797a4-0b87-476c-81e3-069931407629', 'Fakultas Ilmu Sosial dan Ilmu Politik', 1, NULL, '2023-03-22 17:29:51.733011', NULL);
INSERT INTO "mst_faculty" ("id", "xid", "name", "version", "modified_by", "created_at", "updated_at") VALUES (1, '9a268423-22f9-4fe0-8ba3-19795084fc7d', 'Fakultas Ekonomi & Bisnis', 1, NULL, '2023-03-22 17:29:39.478579', NULL);

-- master study program
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (1, 'd40108ab-a122-4946-99b8-5df6eb167ebb', 'Program Studi Akuntansi S1', 1, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (2, 'a57a2478-95c9-4144-95a5-0b3e8a25a1ed', 'Program Studi Akuntansi D3', 1, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (3, '4ef54210-43db-4d5d-a914-977864999db9', 'Program Studi Magister Akuntansi', 1, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (4, '20e9e223-800c-48ff-b2b3-ad7c5f99d1d7', 'Program Profesi Akuntansi (PPAk)', 1, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (5, 'f68f99dd-cb25-4067-833b-30232287a87f', 'Program Studi Manajemen S1', 1, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (6, '5f220d88-4589-4f5b-97b7-1a11a9651e2b', 'Program Studi Manajemen D3', 1, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (7, 'b97b6444-e035-4ccd-8dae-c43004f76c43', 'Program Studi Magister Manajemen', 1, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (8, '538bccea-0ea8-4cd5-a206-20dc4c057858', 'Program Studi Teknik Informatika S1', 2, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (9, 'a803c9b5-2b32-41a7-885b-3dea8f9458bf', 'Program Studi Teknik Industri S1', 2, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (10, '5d09eff7-3dcc-4d56-b79b-a90c75ac20fe', 'Program Studi Sistem Informasi S1', 2, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (11, '56de063c-b8a3-4c4b-a0b4-44039856a7d2', 'Program Studi Teknik Elektro S1', 2, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (12, '56bb3b0b-86bf-4b78-943e-ec36411cb7cb', 'Program Studi Teknik Mesin D3', 2, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (13, 'ac0934b1-8f9b-468e-bea3-ead156d71b17', 'Program Studi Teknik Mesin S1', 2, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (14, '0e5e6de6-a43e-468a-8727-d824f3ca1c06', 'Program Studi Teknik Sipil S1', 2, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (15, '6ae229c9-8e05-40dd-adab-4881984eb05d', 'Program Studi Bahasa Jepang S1', 3, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (16, '0578b427-1a8e-4f45-ba4a-817be018ae5c', 'Program Studi Bahasa Jepang D3', 3, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (17, '09da28a0-71cb-480b-96e2-dd942de1906d', 'Program Studi Bahasa Inggris S1', 3, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (18, '9b97ac6f-7310-4b91-8b1c-2c18f2392bf4', 'Program Studi Desain Grafis D4', 4, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (19, '3db72c17-fa74-4dc4-8885-8c1a8af9caab', 'Program Studi Multimedia D3', 4, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (20, 'f5e7d53d-4303-4093-9106-45869222aa2a', 'Program Studi Perdagangan Internasional ', 5, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (21, '1cc26d48-a004-4ddc-9b09-7621889d3054', 'Program Studi Perpustakaan & Sains Informasi', 5, 1, NULL, '2023-03-23 01:20:30', NULL);
INSERT INTO "mst_study_program" ("id", "xid", "name", "faculty_id", "version", "modified_by", "created_at", "updated_at") VALUES (22, '09eab205-1af6-4543-91e0-d8398199f7fb', 'Program Studi Produksi Film & Televisi ', 5, 1, NULL, '2023-03-23 01:20:30', NULL);