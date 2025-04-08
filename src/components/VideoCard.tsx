
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircleIcon, ClockIcon, EyeIcon } from 'lucide-react';

interface VideoCardProps {
  id: string;
  title: string;
  thumbnailUrl?: string;
  username: string;
  views: number;
  createdAt: string;
}

const VideoCard: React.FC<VideoCardProps> = ({
  id,
  title,
  thumbnailUrl,
  username,
  views,
  createdAt
}) => {
  const formattedDate = new Date(createdAt).toLocaleDateString();
  
  return (
    <Link to={`/videos/${id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-video bg-gray-200 overflow-hidden">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand-DEFAULT">
              <PlayCircleIcon className="h-12 w-12 text-white" />
            </div>
          )}
        </div>
        
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg font-medium line-clamp-2">{title}</CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-gray-600">{username}</p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <EyeIcon className="h-3 w-3 mr-1" />
            <span>{views} views</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-3 w-3 mr-1" />
            <span>{formattedDate}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default VideoCard;
