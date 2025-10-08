import express from "express";
import passport from "passport";
import User from "../models/user.js";
const router = express.Router();


// TODO USER LOGIN/REGISTER/PROFILE UPDATE ROUTES
router.post('/register', async (req, res) => {
    try {
        const user = await User.create({
            username: req.body.username,
            password: req.body.password
        });
        res.status(201).json({message: "user created successfully"})
    }
    catch(err) {
        console.error("Registration error: ", err);
        res.status(500).json({error: err});
    }
});

export default router;