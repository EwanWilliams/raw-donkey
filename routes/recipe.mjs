import express from "express";
import Recipe from "../models/Recipe.mjs"

const router = express.Router();

// request for recipe details from the database
router.get('/:id', (req, res) => {
    // return json with details of recipe
    res.json({message: "Recipe ID endpoint."});
});


// request for list of recipes for homepage
router.get('/list/:range', (req, res) => {
    // return recipe overviews for homepage
    res.json({message: "Recipe list endpoint."});
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

export default router;