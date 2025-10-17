import express from "express";
import Recipe from "../models/Recipe.mjs"

const router = express.Router();

// request for recipe details from the database
router.get('/:id', (req, res) => {
    // return json with details of recipe
    res.json({message: "Recipe ID endpoint."});
});


// request for list of recipes for homepage
router.get('/list/:page/:range', async (req, res) => {
    try {
        // page must be 1 or more, range must be between 1 & 20
        if(req.params.page >= 1 && 20 >= req.params.range >= 1) {
            recipesFound = await Recipe.find()
        }
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