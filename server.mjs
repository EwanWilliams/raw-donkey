import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import ViteExpress from 'vite-express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.mjs';
import recipeRoutes from './routes/recipe.mjs';

const app = express();
const PORT = process.env._PORT;
const DB_URL = process.env.database_url;

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// database connection
mongoose.connect(DB_URL).then(() => console.log("Connected to DB.")).catch(error => console.log(error));

// use routes in routes folder
app.use('/auth', authRoutes);
app.use('/recipe', recipeRoutes);

ViteExpress.listen(app, PORT, () => {
    console.log(`Server running on port ${PORT}`);
});