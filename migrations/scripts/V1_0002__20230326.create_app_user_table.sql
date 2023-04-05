DROP TABLE IF EXISTS "public"."app_user";
CREATE TABLE "public"."app_user" (
  "id" int4 NOT NULL GENERATED BY DEFAULT AS IDENTITY (
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
),
  "xid" uuid NOT NULL,
  "email" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "password" text COLLATE "pg_catalog"."default" NOT NULL,
  "status" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
  "user_type" varchar(10) COLLATE "pg_catalog"."default",
  "version" int4,
  "modified_by" json,
  "created_at" timestamp(6),
  "updated_at" timestamp(6),
  "last_logged_in_at" timestamp(6),
  CONSTRAINT "app_user_pkey" PRIMARY KEY ("id")
)
;

ALTER TABLE "public"."app_user"
  OWNER TO "postgres";

CREATE UNIQUE INDEX "app_user-email-uq" ON "public"."app_user" USING btree (
  "email" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);