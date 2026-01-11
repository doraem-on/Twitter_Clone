import express from 'express';
import authRoutes from './models/auth.routes.js';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import connectMongoDB from './db/connectMongoDB.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;
console.log('MONGO_URI:', process.env.MONGO_URI);

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded bodies
app.use("/api/auth", authRoutes);



app.listen (PORT, () => {
    console.log (`Server is running on http://localhost:${PORT}`);
    connectMongoDB();
});