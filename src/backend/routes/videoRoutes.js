
const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  uploadVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  streamVideo
} = require('../controllers/videoController');

router.post('/', protect, upload.single('video'), uploadVideo);
router.get('/', getVideos);
router.get('/:id', getVideoById);
router.put('/:id', protect, updateVideo);
router.delete('/:id', protect, deleteVideo);
router.get('/:id/stream', streamVideo);

module.exports = router;
