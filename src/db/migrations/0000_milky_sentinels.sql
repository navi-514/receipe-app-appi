CREATE TABLE "favourite_recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"recipe_id" integer NOT NULL,
	"title" text NOT NULL,
	"image" text,
	"cooking_time" text,
	"servings" text,
	"added_at" timestamp DEFAULT now() NOT NULL
);
