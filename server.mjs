import express from 'express';
import ViteExpress from 'vite-express';
import mongo from 'mongodb';

const app = express();
const PORT = 3000;


app.use(express.json());

// request for recipe details from the database
app.get('/recipe/:id', (req, res) => {
    // return json with details of recipe
});


// request for list of recipes for homepage
app.get('/recipe/list/:range', (req, res) => {
    // return recipe overviews for homepage
});


// add new recipe to database
app.post('/recipe/new', (req, res) => {
    // 
});


// TODO USER LOGIN/REGISTER/PROFILE UPDATE ROUTES


ViteExpress.listen(app, PORT, () => {
    console.log(`Server running on port ${PORT}`);
});