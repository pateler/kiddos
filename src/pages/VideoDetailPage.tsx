
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import VideoPlayer from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { videoService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { 
  EyeIcon, 
  CalendarIcon, 
  UserIcon, 
  PencilIcon, 
  TrashIcon,
  Share2Icon,
} from 'lucide-react';

const VideoDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  
  const isOwner = user && video && user._id === video.uploadedBy._id;
  const canEdit = isOwner || isAdmin;
  
  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await videoService.getVideo(id);
        setVideo(response.video);
      } catch (error: any) {
        console.error('Error fetching video:', error);
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to load video',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id, toast]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied',
        description: 'Video link copied to clipboard',
      });
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await videoService.deleteVideo(id);
        toast({
          title: 'Video deleted',
          description: 'The video has been deleted successfully',
        });
        // Redirect to home page
        window.location.href = '/';
      } catch (error: any) {
        console.error('Error deleting video:', error);
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to delete video',
          variant: 'destructive',
        });
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-DEFAULT"></div>
        </div>
      </Layout>
    );
  }

  if (!video) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700">Video not found</h2>
        </div>
      </Layout>
    );
  }

  const videoUrl = videoService.getStreamUrl(id || '');

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video player and details */}
        <div className="lg:col-span-2">
          <div className="rounded-lg overflow-hidden mb-4">
            <VideoPlayer videoUrl={videoUrl} />
          </div>

          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{video.title}</h1>
            
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-600">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  <span>{video.views} views</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>{formatDate(video.createdAt)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <UserIcon className="h-4 w-4 mr-1" />
                  <span>{video.uploadedBy.username}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleShare}
                >
                  <Share2Icon className="h-4 w-4 mr-1" />
                  Share
                </Button>

                {canEdit && (
                  <>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => window.location.href = `/videos/${id}/edit`}
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={handleDelete}
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            <div className="py-4 border-t border-gray-200">
              <p className="text-gray-700 whitespace-pre-wrap">
                {video.description || 'No description.'}
              </p>
            </div>
          </div>
        </div>

        {/* Related videos section */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Related Videos</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Related videos feature coming soon...</p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default VideoDetailPage;
