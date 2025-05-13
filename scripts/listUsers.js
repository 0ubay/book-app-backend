import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      const users = await User.find({});
      console.log('Users in database:', JSON.stringify(users, null, 2));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(error => {
    console.error('Connection error:', error);
    process.exit(1);
  }); 