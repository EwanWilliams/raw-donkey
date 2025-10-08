import express from 'express';
import session from 'express-session';
import ViteExpress from 'vite-express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from "./models/user.mjs";
import authRoutes from './routes/auth.mjs';
import recipeRoutes from './routes/recipe.mjs';

const app = express();
const PORT = 3000;

// middleware
app.use(express.json());
app.use(morgan('dev'));

// session config
app.use(session({
    secret: 'secret-key-update-before-prod',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000 // 24 hrs
    }
}));

// passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// database connection
mongoose.connect('mongodb+srv://node-server-user:rW3QfvSYsEeDzYfb@raw-donkey.me2whry.mongodb.net/?retryWrites=true&w=majority&appName=raw-donkey').then(() => console.log("Connected to DB.")).catch(error => console.log(error));


// use routes in routes folder
app.use('/auth', authRoutes);
app.use('/recipe', recipeRoutes);


// testing auth
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello World - Authentication Server',
    authenticated: req.isAuthenticated ? req.isAuthenticated() : false
  });
});


ViteExpress.listen(app, PORT, () => {
    console.log(`Server running on port ${PORT}`);
});