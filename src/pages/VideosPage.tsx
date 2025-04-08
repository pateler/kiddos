
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import VideoGrid from '@/components/VideoGrid';
import { videoService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';

const VideosPage = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await videoService.getAllVideos();
        setVideos(response.videos);
      } catch (error: any) {
        console.error('Error fetching videos:', error);
        toast({
          title: 'Error',
          description: 'Failed to load videos',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [toast]);

  const filteredVideos = searchTerm
    ? videos.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.uploadedBy.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : videos;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Videos</h1>
          <div className="relative w-64">
            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <VideoGrid videos={filteredVideos} loading={loading} />
      </div>
    </AppLayout>
  );
};

export default VideosPage;
