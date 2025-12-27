import { pgTable, serial,text,timestamp, integer } from "drizzle-orm/pg-core";

export const favouriteTable = pgTable("favourite_recipes", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    recipeId: integer("recipe_id").notNull(),
    title: text("title").notNull(),
    image: text("image"),
    cookingTime: text("cooking_time"),
    servings: text("servings"),
    addedAt: timestamp("added_at").defaultNow(),
});