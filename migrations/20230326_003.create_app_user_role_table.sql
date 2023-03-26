DROP TABLE IF EXISTS "public"."app_user_role";
CREATE TABLE "public"."app_user_role" (
  "id" int4 NOT NULL GENERATED BY DEFAULT AS IDENTITY (
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
),
  "user_id" int4 NOT NULL,
  "role_code" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "faculty_id" int4,
  "program_study_id" int4,
  CONSTRAINT "app_user_role_pkey" PRIMARY KEY ("id")
)
;

ALTER TABLE "public"."app_user_role"
  OWNER TO "postgres";