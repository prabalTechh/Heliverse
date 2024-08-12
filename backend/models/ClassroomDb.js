import mongoose from "mongoose"

const classroomSchema = new mongoose.Schema({
  name: {
    type: String,
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
  days: {
    type: [String],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
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

classroomSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Classroom = mongoose.model('Classroom', classroomSchema);
export default Classroom;


