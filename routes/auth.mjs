import express from "express";
import User from "../models/user.mjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.mjs";
import bcrypt from 'bcrypt';


const router = express.Router();


// USER REGISTRATION ROUTE
router.post('/register', async (req, res) => {
    try {
        // check username is unique
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            res.status(400).json({error: "username already in use"});
        } else {
            // create new user
            const user = await User.create({
                username: req.body.username,
                password: req.body.password
            });
            // set login cookie and response
            generateTokenAndSetCookie(user._id, res);
            res.status(201).json({message: "user created successfully"});
        }
    } catch(err) {
        console.error("Registration error: ", err);
        res.status(500).json({error: err});
    }
});


// USER LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const userFound = await User.findOne({ username: req.body.username });
        if (userFound) {
            const passwordCorrect =  await bcrypt.compare(req.body.password, userFound.password);

            if (passwordCorrect) {
                generateTokenAndSetCookie(userFound._id, res);
                res.status(200).json({ message: "Logged in!" });
            } else {
                res.status(400).json({ error: "Invalid username or password." });
            }

        } else {
            res.status(400).json({ error: "Invalid username or password." });
        }
    } catch(err) {
        console.error("Login error: ", err);
        res.status(500).json({error: err});
    }
});

export default router;