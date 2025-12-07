import express from "express";
import User from "../models/User.mjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.mjs";
import bcrypt from 'bcrypt';
import { validateToken } from "../utils/validateToken.mjs";

const router = express.Router();


// USER REGISTRATION ROUTE
router.post('/register', async (req, res) => {
    try {
        // check username is unique
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            res.status(400).json({error: "username already in use"});
        } else if (req.body.password == "") {
            // check password has been entered
            res.status(400).json({error: "password can't be empty"})
        } else {
            // create new user
            const user = await User.create({
                username: req.body.username,
                password: req.body.password
            });
            // set login cookie and response
            generateTokenAndSetCookie(user._id, user.username, res);
            res.status(201).json({message: "user created successfully"});
        }
    } catch(err) {
        console.error("Registration error: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// USER LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const userFound = await User.findOne({ username: req.body.username });
        if (userFound) {
            const passwordCorrect =  await bcrypt.compare(req.body.password, userFound.password);

            if (passwordCorrect) {
                generateTokenAndSetCookie(userFound._id, userFound.username, res);
                res.status(200).json({ message: "logged in", username: userFound.username  });
            } else {
                res.status(400).json({ error: "Invalid username or password." });
            }

        } else {
            res.status(400).json({ error: "Invalid username or password." });
        }
    } catch(err) {
        console.error("Login error: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.head('/verify', async (req, res) => {
    const token = req.cookies.jwt;

    try {
        if (validateToken(token)) {
            res.status(200).json({ message: "token verified" });
        } else {
            res.cookie("jwt", "", { maxAge: 0 });
            res.status(401).json({ message: "token invalid, jwt cleared" });
        }
    } catch (err) {
        console.log("Verify error: ", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// USER LOGOUT ROUTE
router.post('/logout', async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "logged out" });
    } catch(err) {
        console.log("Logout error: ", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// DELETE TEST USER FOR TESING PURPOSES ROUTE, DO NOT CALL FROM APP
router.delete('/deltestuser', async (req, res) => {
    try {
        const userFound = await User.findOne({ username: "cypress_test_user" });
        if (userFound) {
            const result = await User.findByIdAndDelete(userFound._id);
            if (result) { res.status(204).json({ message: "Deleted test user." }) }
        } else {
            res.status(404).json({ error: "test user not found" });
        }
    } catch(err) {
        console.log("Delete test user error: ", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;