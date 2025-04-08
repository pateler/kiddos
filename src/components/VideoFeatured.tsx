import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { videoService } from '@/services/api';
import VideoPlayer from './VideoPlayer';
import { PlayCircleIcon } from 'lucide-react';

const VideoFeatured = () => {
  const [featuredVideo, setFeaturedVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedVideo = async () => {
      try {
        setLoading(true);
        const response = await videoService.getAllVideos();
        if (response.videos && response.videos.length > 0) {
          // Get the first video as featured
          setFeaturedVideo(response.videos[0]);
        }
      } catch (error) {
        console.error('Error fetching featured video:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedVideo();
  }, []);

  if (loading) {
    return (
      <Card className="w-full overflow-hidden">
        <Skeleton className="w-full aspect-video" />
        <CardContent className="p-4">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (!featuredVideo) {
    return (
      <Card className="w-full overflow-hidden">
        <div className="aspect-video bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">No featured videos available</p>
        </div>
      </Card>
    );
  }

  const videoUrl = videoService.getStreamUrl(featuredVideo._id);

  return (
    <Card className="w-full overflow-hidden">
      <div className="relative">
        <VideoPlayer 
          videoUrl={videoUrl} 
          controls={true} 
          autoplay={false} 
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold mb-2">{featuredVideo.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{featuredVideo.description}</p>
        <Button onClick={() => navigate(`/videos/${featuredVideo._id}`)}>
          <PlayCircleIcon className="mr-2 h-4 w-4" /> Watch Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default VideoFeatured;