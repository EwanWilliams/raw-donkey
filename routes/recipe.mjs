import express from "express";


const router = express.Router();

// request for recipe details from the database
router.get('/:id', (req, res) => {
    // return json with details of recipe
});


// request for list of recipes for homepage
router.get('/list/:range', (req, res) => {
    // return recipe overviews for homepage
});


// add new recipe to database
router.post('/new', (req, res) => {
    // 
});

export default router;