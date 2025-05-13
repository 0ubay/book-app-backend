import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const testUser = {
  name: 'Oubay Arfaoui',
  email: 'oubay.arfaoui@gmail.com',
  password: 'password123'
};

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      // Check if user exists
      const existingUser = await User.findOne({ email: testUser.email });
      if (existingUser) {
        console.log('User already exists:', existingUser);
      } else {
        // Create new user
        const user = await User.create(testUser);
        console.log('User created successfully:', user);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(error => {
    console.error('Connection error:', error);
    process.exit(1);
  }); 