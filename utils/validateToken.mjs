import jwt from 'jsonwebtoken';

export const validateToken = (token) => {
    try {
        const result = jwt.verify(token, process.env.token_secret);
        return result;
    } catch (err) {
        return null;
    }
};