import express from "express";
import Recipe from "../models/Recipe.mjs";
import Comment from "../models/Comment.mjs";
import { validateToken } from "../utils/validateToken.mjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// request for recipe details from the database
router.get('/:id', async (req, res) => {
    try {
        const recipeDetails = await Recipe.find({_id: req.params.id});
        if (recipeDetails.length == 0) {
            res.status(400).json({message: "Recipe not found."});
        } else {
            res.status(200).json(recipeDetails);
        }
    } catch(err) {
        console.error("Recipe detail error: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// request for list of recipes for homepage
router.get('/list/:page/:range', async (req, res) => {
    try {
        const skipAmount = (req.params.page-1)*req.params.range;
        const recipesFound = await Recipe.find({}, {_id: 1, title: 1, recipe_img: 1}, {skip: skipAmount, limit: req.params.range});
        res.status(200).json(recipesFound);
    } catch(err) {
        console.error("Recipe list error: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// add new recipe to database
router.post('/new', async (req, res) => {
    try {
        let recipeImageData = null;
        
        // Handle base64 image data
        if (req.body.recipe_img) {
            const matches = req.body.recipe_img.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                recipeImageData = {
                    data: Buffer.from(matches[2], 'base64'),
                    contentType: matches[1]
                };
            }
        }

        const newRecipe = await Recipe.create({
            title: req.body.title,
            recipe_img: recipeImageData,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions
        })
        
        res.status(201).json({
            message: "Recipe added successfully",
            recipeId: newRecipe._id
        })
    } catch(err) {
        console.error("Recipe add error: ", err);
        if (err.name === 'ValidationError') {
            res.status(400).json({ error: "Validation Error: " + err.message });
        } else {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
});


// get comments for a specific recipe
router.get('/:id/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ recipeId: req.params.id })
            .sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch(err) {
        console.error("Get comments error: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// add a new comment to a recipe (requires authentication)
router.post('/:id/comments', async (req, res) => {
    try {
        // Validate user is logged in
        const token = req.cookies.jwt;
        if (!token || !validateToken(token)) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const decoded = jwt.decode(token);

        // Create new comment
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
    } catch(err) {
        console.error("Add comment error: ", err);
        if (err.name === 'ValidationError') {
            res.status(400).json({ error: "Validation Error: " + err.message });
        } else {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
});

export default router;