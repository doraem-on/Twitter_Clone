import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../lib/utils/generateToken.js";


export const signup = async(req, res) => {
    try{
        const { fullName, username, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({ error: "Username already taken" });
        }

        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({ error: "Email already registered" });
        }

        if(password.length < 6){
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword
        });

        if(newUser){
            await newUser.save();
            generateToken(newUser._id, res);
            

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImage: newUser.profileImage,
                coverImage: newUser.coverImage,
            })
        } else {
            res.status(400).json({ error: "Invalid user data"});

        }

    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

export const login = async(req, res) => {
    res.json({ 
        data: "Login route" 
    });
}

export const logout = async(req, res) => {
    res.json({ 
        data: "Logout route" 
    });
}