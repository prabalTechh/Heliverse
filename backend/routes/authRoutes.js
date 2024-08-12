import express from 'express';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import User from '../models/UserDb.js'; // Ensure the path is correct
import bcrypt from 'bcryptjs';
import Classroom from '../models/ClassroomDb.js';
import authenticateToken from "../middleware/authernticateToken.js"; // Adjust path as needed
import authorizeRoles from '../middleware/authorizeRoles.js'; // Ensure this middleware is implemented

const router = express.Router();

// Sign up route
router.post('/signup', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  check('role', 'Role is required').isIn(['Principal', 'Teacher', 'Student']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ email, password: await bcrypt.hash(password, 10), role });
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login route
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch all classrooms
router.get('/classrooms', async (req, res) => {
  try {
    const classrooms = await Classroom.find();
    res.json(classrooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Assign a classroom to a teacher (Principal-only)
router.post('/classrooms/assign-classroom', [authenticateToken, authorizeRoles('Principal')], async (req, res) => {
  const { teacherId, classroomId } = req.body;
  try {
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      return res.status(404).json({ msg: 'Classroom not found' });
    }

    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ msg: 'Teacher not found' });
    }

    teacher.classroomId = classroomId;
    await teacher.save();

    res.status(200).json({ msg: 'Classroom assigned successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Fetch all teachers (Principal-only)
router.get('/users/teachers', [authenticateToken, authorizeRoles('Principal')], async (req, res) => {
  try {
    const teachers = await User.find({ role: 'Teacher' });
    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Fetch all students (Principal-only)
router.get('/users/students', [authenticateToken, authorizeRoles('Principal')], async (req, res) => {
  try {
    const students = await User.find({ role: 'Student' });
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Route to get user details
router.get('/details', authenticateToken, async (req, res) => {
  try {
    // Find user by ID from token
    const user = await User.findById(req.user.id).select('email role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
