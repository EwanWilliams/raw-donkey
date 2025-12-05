import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (userId, username, res) => {
    // cookies max age set to 7 days
    const token = jwt.sign({ userId, username }, process.env.token_secret, { expiresIn: "7d" });
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict"
    });
};