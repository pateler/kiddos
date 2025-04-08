import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Video from '../models/Video.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sample video data
export const sampleVideos = [
  {
    title: 'Introduction to VideoVoyage',
    description: 'Learn about our amazing video platform and how to use it',
    filename: 'intro.mp4',
    mimetype: 'video/mp4',
    isPublic: true
  },
  {
    title: 'Nature Scenery',
    description: 'Beautiful landscapes and natural wonders from around the world',
    filename: 'nature.mp4',
    mimetype: 'video/mp4',
    isPublic: true
  },
  {
    title: 'Coding Tutorial',
    description: 'Learn programming with this comprehensive tutorial',
    filename: 'coding.mp4',
    mimetype: 'video/mp4',
    isPublic: true
  }
];

// Function to create sample videos
export const createSampleVideos = async () => {
  try {
    console.log('Checking for existing videos...');
    const videosCount = await Video.countDocuments();
    
    if (videosCount > 0) {
      console.log('Sample videos already exist in the database');
      return;
    }

    console.log('Creating sample videos...');
    
    // Find admin user or create one if it doesn't exist
    let adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      adminUser = await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: '$2a$10$0Egd.PUhq3WFTfGghA2SSecnp8m3qrI84HsBRQQanN9TqV8UX9uiK', // password: admin123
        role: 'admin'
      });
      console.log('Admin user created');
    }
    
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Copy sample video files from public directory to backend uploads
    const samplePath = path.join(__dirname, './sample-videos');
    if (!fs.existsSync(samplePath)) {
      fs.mkdirSync(samplePath, { recursive: true });
      
      // Create sample text files as placeholders for videos
      for (const video of sampleVideos) {
        fs.writeFileSync(
          path.join(samplePath, video.filename), 
          `This is a placeholder for ${video.title}`
        );
        console.log(`Created placeholder for ${video.filename}`);
      }
    }
    
    // Create database entries for the videos
    for (const video of sampleVideos) {
      const sourcePath = path.join(samplePath, video.filename);
      const destPath = path.join(uploadsDir, video.filename);
      
      // Copy file if it exists
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
      } else {
        // Create placeholder file
        fs.writeFileSync(destPath, `This is a placeholder for ${video.title}`);
      }
      
      await Video.create({
        title: video.title,
        description: video.description,
        filename: video.filename,
        filepath: destPath,
        mimetype: video.mimetype,
        size: fs.statSync(destPath).size,
        uploadedBy: adminUser._id,
        isPublic: video.isPublic
      });
    }
    
    console.log('Sample videos created successfully');
  } catch (error) {
    console.error('Error creating sample videos:', error);
  }
};

// export default sampleVideos;