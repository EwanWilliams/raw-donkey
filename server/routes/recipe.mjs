import express from "express";
import Recipe from "../models/Recipe.mjs";
import Comment from "../models/Comment.mjs";
import User from "../models/User.mjs";            
import { validateToken } from "../utils/validateToken.mjs";
import jwt from "jsonwebtoken";

const router = express.Router();

/**
 * 🔹 GET all liked recipes for the logged-in user
 * URL: /api/recipe/liked
 * Must come BEFORE "/:id" so it isn't swallowed by that route.
 */
router.get("/liked", async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token || !validateToken(token)) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.decode(token);
    const userId = decoded.userId;

    const user = await User.findById(userId).select("liked_recipes");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.liked_recipes || user.liked_recipes.length === 0) {
      return res.status(200).json([]); // no liked recipes
    }

    const recipes = await Recipe.find({
      _id: { $in: user.liked_recipes },
    });

    res.status(200).json(recipes);
  } catch (err) {
    console.error("Get liked recipes error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// request for recipe details from the database
router.get('/:id', async (req, res) => {
  try {
    const recipeDetails = await Recipe.find({ _id: req.params.id });
    if (recipeDetails.length == 0) {
      res.status(400).json({ message: "Recipe not found." });
    } else {
      res.status(200).json(recipeDetails);
    }
  } catch (err) {
    console.error("Recipe detail error: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// request for list of recipes for homepage
router.get('/list/:page/:range', async (req, res) => {
  try {
    const skipAmount = (req.params.page - 1) * req.params.range;
    const recipesFound = await Recipe.find(
      {},
      { _id: 1, title: 1, recipe_img: 1 },
      { skip: skipAmount, limit: req.params.range }
    );
    res.status(200).json(recipesFound);
  } catch (err) {
    console.error("Recipe list error: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// like a recipe (requires authentication)
router.post('/:id/like', async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token || !validateToken(token)) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.decode(token);
    const userId = decoded.userId;
    const recipeId = req.params.id;

    const recipeExists = await Recipe.exists({ _id: recipeId });
    if (!recipeExists) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only push if not already liked
    if (!user.liked_recipes.some(id => id.toString() === recipeId)) {
      user.liked_recipes.push(recipeId);
      await user.save();
    }

    res.status(200).json({ success: true, liked: true });
  } catch (err) {
    console.error("Like recipe error: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// unlike a recipe (requires authentication)
router.delete('/:id/like', async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (!token || !validateToken(token)) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.decode(token);
    const userId = decoded.userId;
    const recipeId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.liked_recipes = user.liked_recipes.filter(
      (id) => id.toString() !== recipeId
    );
    await user.save();

    res.status(200).json({ success: true, liked: false });
  } catch (err) {
    console.error("Unlike recipe error: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get comments for a specific recipe
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ recipeId: req.params.id })
      .sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    console.error("Get comments error: ", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// add a new comment to a recipe (requires authentication)
router.post('/:id/comments', async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token || !validateToken(token)) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const decoded = jwt.decode(token);

    const newComment = await Comment.create({
      recipeId: req.params.id,
      userId: decoded.userId,
      username: decoded.username,
      commentText: req.body.commentText
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment
    });
  } catch (err) {
    console.error("Add comment error: ", err);
    if (err.name === 'ValidationError') {
      res.status(400).json({ error: "Validation Error: " + err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

export default router;
