import express from 'express';
const router = express.Router();
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { uploadVideo, getVideoById, getVideos, updateVideo, deleteVideo, streamVideo } from '../controllers/videoController.js';


router.post('/', protect, upload.single('video'), uploadVideo);
router.get('/', getVideos);
router.get('/:id', getVideoById);
router.put('/:id', protect, updateVideo);
router.delete('/:id', protect, deleteVideo);
router.get('/:id/stream', streamVideo);

export default router;
