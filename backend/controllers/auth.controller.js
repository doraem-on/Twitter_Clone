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
    try{
        const {username, password} =  req.body;
        const user = await User.findOne({username});
        const passwordMatch = user ? await bcrypt.compare(password, user?.password || "") : false;
        
        if(!user || !passwordMatch){
            return res.status(401).json({ error: "Invalid username or password"});
        }

        generateToken (user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImage: user.profileImage,
            coverImage: user.coverImage,
        });
       
}
 catch(error){
            console.error(error);
            res.status(500).json({ error: "Server error" });
        }
    };

export const logout = async(req, res) => {
    try{
        res.cookie("jwt", "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: "strict",
            secure : process.env.NODE_ENV === "production",
        });
        res.status(200).json({ message: "Logged out successfully" });
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }

};