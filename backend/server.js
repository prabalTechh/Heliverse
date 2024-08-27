import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv/config';
import mongoose from 'mongoose';
import UserDb from './models/UserDb.js';
import ClassroomDb from './models/ClassroomDb.js'; 
import bcrypt from 'bcryptjs';
import authRoutes from './routes/authRoutes.js'; 
import classroomRoutes from './routes/classroomRoutes.js'; 
import timetableRoutes from "./routes/timetableRoutes.js";


const app = express();
app.use(cors());
app.use(express.json());

// Registering routes
app.use('/api/auth', authRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/Timetables', timetableRoutes);

// Connecting to Mongoose
mongoose.connect(process.env.MONGO_CONN)
  .then(() => console.log('MongoDB is Connected'))
  .catch(err => console.log(err));

// Listening to the Port
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
