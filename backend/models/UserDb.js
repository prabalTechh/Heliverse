import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Principal', 'Teacher', 'Student'],
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
  
  userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
  });


  
  const User = mongoose.model('User', userSchema);

  // In your user schema file
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      return next();
    }
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err);
    }
  });
export default User;