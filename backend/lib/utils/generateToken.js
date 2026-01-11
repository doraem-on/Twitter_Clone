import jwt from 'jsonwebtoken';
import User from '../../models/user.model.js';

export const generateToken = (UserId, res) => {
    const token = jwt.sign({ id: UserId }, process.env.JWT_SECRET, {
        expiresIn: '15d',
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        httpOnly: true,
        sameSite: "strict",
        secure : process.env.NODE_ENV === "production",
    });

    
};
export default generateToken;