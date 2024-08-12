import express from 'express';
import mongoose from 'mongoose';
import Timetable from '../models/TimeTableDb.js';
import Classroom from '../models/ClassroomDb.js';
import User from '../models/UserDb.js';

const router = express.Router();

// Create a new timetable period
router.post('/', async (req, res) => {
  try {
    const { classroomId, teacherName, teacherId, subject, day, startTime, endTime } = req.body;

    // Fetch classroom and teacher details
    const classroom = await Classroom.findById(classroomId);
    const teacher = await User.findById(teacherId);

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found.' });
    }

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found.' });
    }

    // Check that the period is within the classroom's time range
    const classroomStartTime = new Date(`1970-01-01T${classroom.startTime}:00Z`);
    const classroomEndTime = new Date(`1970-01-01T${classroom.endTime}:00Z`);
    const periodStartTime = new Date(`1970-01-01T${startTime}:00Z`);
    const periodEndTime = new Date(`1970-01-01T${endTime}:00Z`);

    if (periodStartTime < classroomStartTime || periodEndTime > classroomEndTime) {
      return res.status(400).json({ message: 'Period must be within the classroom’s start and end time.' });
    }

    // Check for overlapping periods
    const overlappingPeriods = await Timetable.find({
      classroomId: classroomId,
      day: day,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
      ]
    });

    if (overlappingPeriods.length > 0) {
      return res.status(400).json({ message: 'Periods overlap. Please choose a different time.' });
    }

    // Create timetable
    const timetable = new Timetable({ classroomId,teacherName, teacherId, subject, day, startTime, endTime });
    await timetable.save();
    res.status(201).json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all timetables for a classroom
// Get all timetables for a classroom
router.get('/:classroomId', async (req, res) => {
  const { classroomId } = req.params;

  // Validate if the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(classroomId)) {
    return res.status(400).json({ message: 'Invalid classroom ID format' });
  }

  try {
    const timetables = await Timetable.find({ classroomId });

    if (timetables.length === 0) {
      return res.status(404).json({ message: 'No timetables found for this classroom.' });
    }

    res.status(200).json(timetables);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
