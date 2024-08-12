import express from 'express';
import Classroom from '../models/ClassroomDb.js'; // Adjust path as necessary

const router = express.Router();

// Create a new classroom
router.post('/', async (req, res) => {
  const { name, startTime, endTime, days } = req.body;
  try {
    const classroom = new Classroom({ name, startTime, endTime, days });
    await classroom.save();
    res.status(201).json(classroom);
  } catch (error) {
    res.status(400).json({ message: 'Error creating classroom', error });
  }
});

// Get all classrooms
router.get('/', async (req, res) => {
  try {
    const classrooms = await Classroom.find();
    res.status(200).json(classrooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classrooms', error });
  }
});

// Get a classroom by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const classroom = await Classroom.findById(id);
    if (classroom) {
      res.status(200).json(classroom);
    } else {
      res.status(404).json({ message: 'Classroom not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching classroom', error });
  }
});


// Update a classroom
router.put('/classrooms/:id', async (req, res) => {
  const { id } = req.params;

  // Validate if the ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid classroom ID format' });
  }

  try {
    const updatedClassroom = await Classroom.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedClassroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    res.status(200).json(updatedClassroom);
  } catch (error) {
    res.status(500).json({ message: 'Error updating classroom', error: error.message });
  }
});

// Delete a classroom
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const classroom = await Classroom.findByIdAndDelete(id);
    if (classroom) {
      res.status(200).json({ message: 'Classroom deleted' });
    } else {
      res.status(404).json({ message: 'Classroom not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting classroom', error });
  }
});

export default router;
