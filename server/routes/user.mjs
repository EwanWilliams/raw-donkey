import express from "express";
import { validateToken } from "../utils/validateToken.mjs";
import User from "../models/User.mjs";
import jwt from 'jsonwebtoken';

const router = express.Router();


router.put('/settings', async (req, res) => {
    try {
        const img = req.body.img;
        const units = req.body.unit;
        const token = req.cookies.jwt;
        let result = null;
        let imgData = null;

        if (validateToken(token)) {
            // Handle base64 image data
            if (img) {
                const matches = img.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                if (matches && matches.length === 3) {
                    imgData = {data: Buffer.from(matches[2], 'base64'), contentType: matches[1]};
                }
            }
            
            const tokenData = jwt.decode(token);

            if (imgData && units) {
                result = await User.updateOne({_id: tokenData.userId}, {unit_pref: units, profile_img: imgData});
                res.status(200).json({message: "image and units updated"});
            } else if (imgData) {
                result = await User.updateOne({_id: tokenData.userId}, {profile_img: imgData});
                res.status(200).json({message: "image updated"});
            } else if (units) {
                result = await User.updateOne({_id: tokenData.userId}, {unit_pref: units});
                res.status(200).json({message: "units updated"});
            } else {
                res.status(400).json({ error: "please provide correct data" })
            }
        } else {
            res.status(401).json({ error: "user not logged in" });
        }
    } catch (err) {
        console.error("User update settings error: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get('/details', async (req, res) => {
    try {
        const token = req.cookies.jwt;

        if (validateToken(token)) {
            const tokenData = jwt.decode(token);
            const userDetails = await User.findOne({_id: tokenData.userId}, 'username unit_pref profile_img');
            if (userDetails.length == 0) {
                res.status(400).json({message: "User not found."});
            } else {
                res.status(200).json(userDetails);
            }
        } else {
            res.status(401).json({ error: "user not logged in" });
        }
    } catch (err) {
        console.error("User details error: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;