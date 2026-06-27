alter table "public"."caterers" add column "announcement_active" boolean not null default false;
alter table "public"."caterers" add column "announcement_bg_color" text default 'primary'::text;
alter table "public"."caterers" add column "announcement_text" text;

alter table "public"."planners" add column "announcement_active" boolean not null default false;
alter table "public"."planners" add column "announcement_bg_color" text default 'primary'::text;
alter table "public"."planners" add column "announcement_text" text;

alter table "public"."restaurants" add column "announcement_active" boolean not null default false;
alter table "public"."restaurants" add column "announcement_bg_color" text default 'primary'::text;
alter table "public"."restaurants" add column "announcement_text" text;
