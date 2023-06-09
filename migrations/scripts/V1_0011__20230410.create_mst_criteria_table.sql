DROP TABLE IF EXISTS "public"."mst_criteria";
CREATE TABLE "public"."mst_criteria" (
  "id" int4 NOT NULL GENERATED BY DEFAULT AS IDENTITY (
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
),
  "name" varchar(100) COLLATE "pg_catalog"."default" NOT NULL,
  "score" numeric NOT NULL,
  "is_active" bool NOT NULL DEFAULT true,
  "order" numeric,
  CONSTRAINT "mst_criteria_pkey" PRIMARY KEY ("id")
)
;

ALTER TABLE "public"."mst_criteria"
  OWNER TO "postgres";

CREATE INDEX "mst_criteria-is_active-idx" ON "public"."mst_criteria" USING btree (
  "is_active" "pg_catalog"."bool_ops" ASC NULLS LAST
);

CREATE INDEX "mst_criteria-name-idx" ON "public"."mst_criteria" USING btree (
  "name" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

CREATE INDEX "mst_criteria-order-idx" ON "public"."mst_criteria" USING btree (
  "order" "pg_catalog"."numeric_ops" ASC NULLS LAST
);