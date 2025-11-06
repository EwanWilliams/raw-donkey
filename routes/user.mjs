import express from "express";
import User from "../models/User.mjs";

const router = express.Router();


router.put('/settings', async (req, res) => {
    try {
        // make this work
    } catch (err) {
        console.error("User update unit error: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;