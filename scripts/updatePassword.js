import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const updateUserPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the user
    const user = await User.findOne({ email: 'oubay.arfaoui@gmail.com' });
    if (!user) {
      console.log('User not found');
      process.exit(1);
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    console.log('Password updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateUserPassword(); 