import express from "express";
import Recipe from "../models/Recipe.mjs"

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