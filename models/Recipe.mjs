import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
    item: {type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }
});

const recipeSchema = new mongoose.Schema({
    title: {type: String, required: true},
    recipe_img: { data: Buffer, contentType: String },
    ingredients: [ingredientSchema],
    instructions: [String]
});

const Recipe = mongoose.model('Recipes', recipeSchema, 'Recipes');
export default Recipe;