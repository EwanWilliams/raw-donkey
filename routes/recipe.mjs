import express from "express";


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
router.post('/new', (req, res) => {
    // add new recipe
    res.json({message: "Add recipe endpoint."});
});

export default router;