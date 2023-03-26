DROP TABLE IF EXISTS "public"."app_refresh_token";
CREATE TABLE "public"."app_refresh_token" (
  "id" uuid NOT NULL,
  "user_id" int4 NOT NULL,
  "expired_at" timestamp(6) NOT NULL,
  CONSTRAINT "app_refresh_token_pkey" PRIMARY KEY ("id")
)
;

ALTER TABLE "public"."app_refresh_token"
  OWNER TO "postgres";