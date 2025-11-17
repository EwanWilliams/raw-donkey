import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.mjs';
import recipeRoutes from './routes/recipe.mjs';
import userRoutes from './routes/user.mjs';

const app = express();
const PORT = process.env._PORT;
const db_username = encodeURIComponent(process.env.db_user);
const db_password = encodeURIComponent(process.env.db_password);
const db_cluster = process.env.db_cluster;
const DB_URI = `mongodb+srv://${db_username}:${db_password}@${db_cluster}`;

// middleware
app.use(express.json({ limit: '256kb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
    origin: ['http://localhost:5173'],
}));

mongoose.connect(DB_URI).then(() => console.log("Connected to DB.")).catch(error => console.log(error));

// use routes in routes folder
app.use('/api/auth', authRoutes);
app.use('/api/recipe', recipeRoutes);
app.use('/api/user', userRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));