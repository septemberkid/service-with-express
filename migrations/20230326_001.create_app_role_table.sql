DROP TABLE IF EXISTS "public"."app_role";
CREATE TABLE "public"."app_role" (
  "code" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  CONSTRAINT "app_role_pkey" PRIMARY KEY ("code")
)
;

ALTER TABLE "public"."app_role"
  OWNER TO "postgres";