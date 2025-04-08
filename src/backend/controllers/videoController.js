import fs from 'fs';
import path from 'path';
import Video from '../models/Video.js';

// @desc    Upload a video
// @route   POST /api/videos
// @access  Private
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video file uploaded' });
    }

    const { title, description, isPublic } = req.body;

    const video = new Video({
      title: title || 'Untitled Video',
      description: description || '',
      filename: req.file.filename,
      filepath: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user._id,
      isPublic: isPublic === 'true'
    });

    await video.save();

    res.status(201).json({
      success: true,
      video
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all videos (with filter options)
// @route   GET /api/videos
// @access  Public/Private (public videos for all, private for authorized)
export const getVideos = async (req, res) => {
  try {
    let query = {};

    if (!req.user || req.user.role !== 'admin') {
      if (req.user) {
        query = {
          $or: [
            { isPublic: true },
            { uploadedBy: req.user._id }
          ]
        };
      } else {
        query = { isPublic: true };
      }
    }

    const videos = await Video.find(query)
      .populate('uploadedBy', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: videos.length,
      videos
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Public/Private (depends on video visibility)
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('uploadedBy', 'username');

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    // Check if video is private and user is not admin or uploader
    if (!video.isPublic) {
      if (!req.user || (req.user.role !== 'admin' && video.uploadedBy._id.toString() !== req.user._id.toString())) {
        return res.status(403).json({ success: false, message: 'Not authorized to access this video' });
      }
    }

    // Increment view count
    video.views += 1;
    await video.save();

    res.json({
      success: true,
      video
    });
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update video details
// @route   PUT /api/videos/:id
// @access  Private (owner or admin)
export const updateVideo = async (req, res) => {
  try {
    let video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    // Check if user is video owner or admin
    if (video.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this video' });
    }

    const { title, description, isPublic } = req.body;

    video = await Video.findByIdAndUpdate(
      req.params.id,
      {
        title: title || video.title,
        description: description !== undefined ? description : video.description,
        isPublic: isPublic !== undefined ? isPublic === 'true' : video.isPublic,
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.json({
      success: true,
      video
    });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private (owner or admin)
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    // Check if user is video owner or admin
    if (video.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this video' });
    }

    // Delete file from storage
    fs.unlink(video.filepath, async (err) => {
      if (err) {
        console.error('File deletion error:', err);
      }

      // Delete from database regardless of file deletion success
      await Video.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: 'Video removed'
      });
    });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Stream video
// @route   GET /api/videos/:id/stream
// @access  Public/Private (depends on video visibility)
export const streamVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    // Check if video is private and user is not admin or uploader
    if (!video.isPublic) {
      if (!req.user || (req.user.role !== 'admin' && video.uploadedBy.toString() !== req.user._id.toString())) {
        return res.status(403).json({ success: false, message: 'Not authorized to access this video' });
      }
    }

    const filePath = video.filepath;
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': video.mimetype,
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': video.mimetype,
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.error('Stream error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
