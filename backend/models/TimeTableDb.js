import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
  classroomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teacherName: {
    type: String,
    ref: 'User',
    required: true,
  },

  subject: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  startTime: {
    type: String, // Could also be `Date` if you prefer, but using string for simplicity
    required: true,
  },
  endTime: {
    type: String, // Same as above
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

timetableSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Timetable = mongoose.model('Timetables', timetableSchema);
export default Timetable;
