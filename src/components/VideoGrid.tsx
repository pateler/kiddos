
import React from 'react';
import VideoCard from '@/components/VideoCard';

interface Video {
  _id: string;
  title: string;
  thumbnailPath: string;
  views: number;
  createdAt: string;
  uploadedBy: {
    _id: string;
    username: string;
  };
}

interface VideoGridProps {
  videos: Video[];
  loading?: boolean;
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="rounded-lg overflow-hidden">
            <div className="aspect-video bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-5 bg-gray-200 animate-pulse mb-2 rounded"></div>
              <div className="h-4 bg-gray-200 animate-pulse mb-1 rounded max-w-[70%]"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded max-w-[50%]"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-xl">No videos found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <VideoCard
          key={video._id}
          id={video._id}
          title={video.title}
          thumbnailUrl={video.thumbnailPath || undefined}
          username={video.uploadedBy.username}
          views={video.views}
          createdAt={video.createdAt}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
