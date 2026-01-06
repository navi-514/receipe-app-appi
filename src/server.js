import express from "express";
import cors from "cors";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { favouriteTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";
import { job } from "./config/cron.js";


const app = express();
const PORT = ENV.PORT || 5001;


if(ENV.NODE_ENV === "production") job.start();

app.use(cors());
app.use(express.json()); 

app.get("/api/health", (req, res) => {
 res.status(200).json({ status: "OK" });
});


app.post("/api/favorites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookingTime, servings } = req.body;

    if (!userId || !recipeId || !title) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const rid = Number(recipeId);
    if (Number.isNaN(rid)) {
      return res.status(400).json({ error: "recipeId must be a number" });
    }

    await db.insert(favouriteTable).values({
      userId: String(userId),
      recipeId: rid,
      title,
      image: image ?? null,
      cookingTime: cookingTime ?? null,
      servings: servings ?? null,
    });

    res.status(201).json({ message: "Favourite added successfully" });
  } catch (error) {
    console.error("Error adding favourite recipe:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.get("/api/favorites/:userId", async (req, res) => {
  try{
    const { userId } = req.params;

    const userFavourites = await db
       .select()
        .from(favouriteTable)
        .where(eq(favouriteTable.userId,userId));  

    res.status(200).json(userFavourites);
  }
  catch (error) {
    console.error("Error fetching favourite recipes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    if (!userId || !recipeId) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const rid = Number(recipeId);
    if (Number.isNaN(rid)) {
      return res.status(400).json({ error: "recipeId must be a number" });
    }

    await db
      .delete(favouriteTable)
      .where(
        and(
          eq(favouriteTable.userId, String(userId)),
          eq(favouriteTable.recipeId, rid)
        )
      );

    res.status(200).json({ message: "Favourite deleted successfully" });
  } catch (error) {
    console.error("Error deleting favourite recipe:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});

