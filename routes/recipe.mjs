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
        const newRecipe = await Recipe.create({
            title: req.body.title,
            recipe_img: req.body.recipe_img,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions
        })
        res.status(201).json({message: "recipe added successfully"})
    } catch(err) {
        console.error("Recipe add error: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;