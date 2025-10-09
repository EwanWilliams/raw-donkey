import express from "express";
import User from "../models/user.mjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.mjs";


const router = express.Router();


// TODO USER LOGIN/REGISTER/PROFILE UPDATE ROUTES
router.post('/register', async (req, res) => {
    try {
        const existingUser = await User.findOne({username: req.body.username});
        if (existingUser) {
            res.status(400).json({error: "username already in use"});
        } else {
            const user = await User.create({
                username: req.body.username,
                password: req.body.password
            });
            // set login cookie
            generateTokenAndSetCookie(user._id, res);
            res.status(201).json({message: "user created successfully"});
        }
    }
    catch(err) {
        console.error("Registration error: ", err);
        res.status(500).json({error: err});
    }
});



// login route
router.post('/login', (req, res, next) => {
});

export default router;