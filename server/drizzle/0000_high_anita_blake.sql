-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "departments" (
	"id" serial NOT NULL,
	"code" varchar(4) NOT NULL,
	"capital" varchar(10) NOT NULL,
	"region" varchar(4) NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "departments_code_key" UNIQUE("code"),
	CONSTRAINT "departments_capital_key" UNIQUE("capital"),
	CONSTRAINT "departments_name_key" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "towns" (
	"id" serial NOT NULL,
	"code" varchar(10) NOT NULL,
	"article" text,
	"name" text NOT NULL,
	"department" varchar(4) NOT NULL,
	"latitude" double precision,
	"longitude" double precision
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" serial NOT NULL,
	"code" varchar(4) NOT NULL,
	"capital" varchar(10) NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "regions_code_key" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"cognitoId" text NOT NULL,
	CONSTRAINT "users_username_key" UNIQUE("username"),
	CONSTRAINT "users_email_key" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"town_code" varchar(10) NOT NULL,
	"user_id" integer NOT NULL,
	"rating" smallint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"department" varchar(4) DEFAULT '' NOT NULL,
	CONSTRAINT "ratings_town_department_user_unique" UNIQUE("town_code","user_id","department"),
	CONSTRAINT "ratings_rating_check" CHECK ((rating >= 1) AND (rating <= 5))
);
--> statement-breakpoint
CREATE TABLE "descriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"town_code" varchar(10) NOT NULL,
	"department" varchar(4) NOT NULL,
	"language" varchar(2) NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "descriptions_town_code_department_language_key" UNIQUE("town_code","department","language")
);
--> statement-breakpoint
CREATE TABLE "bookmarks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"town_name" text NOT NULL,
	"department_code" varchar(4),
	CONSTRAINT "bookmarks_user_id_town_name_key" UNIQUE("user_id","town_name")
);
--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_region_fkey" FOREIGN KEY ("region") REFERENCES "public"."regions"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "towns" ADD CONSTRAINT "towns_department_fkey" FOREIGN KEY ("department") REFERENCES "public"."departments"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_ratings_town_code" ON "ratings" USING btree ("town_code" text_ops);
*/