CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"impersonated_by" text,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'seller' NOT NULL,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicle_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicle_id" uuid NOT NULL,
	"storage_key" varchar(255) NOT NULL,
	"position" smallint NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(180) NOT NULL,
	"brand" varchar(60) NOT NULL,
	"model" varchar(80) NOT NULL,
	"version" varchar(120),
	"manufacture_year" smallint NOT NULL,
	"model_year" smallint NOT NULL,
	"mileage_km" integer NOT NULL,
	"price_in_cents" bigint NOT NULL,
	"transmission" varchar(20) NOT NULL,
	"fuel_type" varchar(20) NOT NULL,
	"body_type" varchar(20) NOT NULL,
	"color" varchar(40) NOT NULL,
	"doors" smallint,
	"description" text,
	"features" text[] DEFAULT '{}'::text[] NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"published_at" timestamp with time zone,
	"created_by_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vehicles_slug_unique" UNIQUE("slug"),
	CONSTRAINT "vehicles_transmission_check" CHECK ("vehicles"."transmission" in ('manual', 'automatic', 'cvt', 'automated')),
	CONSTRAINT "vehicles_fuel_type_check" CHECK ("vehicles"."fuel_type" in ('flex', 'gasoline', 'ethanol', 'diesel', 'hybrid', 'electric')),
	CONSTRAINT "vehicles_body_type_check" CHECK ("vehicles"."body_type" in ('hatch', 'sedan', 'suv', 'pickup', 'van', 'coupe', 'convertible', 'wagon')),
	CONSTRAINT "vehicles_status_check" CHECK ("vehicles"."status" in ('draft', 'published', 'sold')),
	CONSTRAINT "vehicles_mileage_check" CHECK ("vehicles"."mileage_km" >= 0),
	CONSTRAINT "vehicles_price_check" CHECK ("vehicles"."price_in_cents" > 0),
	CONSTRAINT "vehicles_year_check" CHECK ("vehicles"."model_year" >= "vehicles"."manufacture_year")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicle_photos" ADD CONSTRAINT "vehicle_photos_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_user_id_index" ON "accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_user_id_index" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verifications_identifier_index" ON "verifications" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "vehicle_photos_vehicle_id_position_index" ON "vehicle_photos" USING btree ("vehicle_id","position");--> statement-breakpoint
CREATE INDEX "vehicles_status_published_at_index" ON "vehicles" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "vehicles_brand_index" ON "vehicles" USING btree ("brand");