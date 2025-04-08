
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import VideoGrid from '@/components/VideoGrid';
import { videoService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const HomePage = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <Layout>
      <div className="space-y-8">
        <section className="text-center py-12 bg-gradient-to-r from-brand-dark to-brand-DEFAULT text-white rounded-lg">
          <h1 className="text-4xl font-bold mb-4">Welcome to VideoVoyage</h1>
          <p className="text-xl mb-6 max-w-2xl mx-auto">
            Your platform for uploading, managing, and sharing videos
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-brand-accent hover:bg-opacity-90 text-brand-dark">
              Explore Videos
            </Button>
            <Button className="bg-white text-brand-DEFAULT hover:bg-gray-100">
              Learn More
            </Button>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Latest Videos</h2>
          </div>
          <VideoGrid videos={videos} loading={loading} />
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;
