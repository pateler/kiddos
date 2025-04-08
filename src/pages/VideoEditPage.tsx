import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { videoService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/AppLayout';

const VideoEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await videoService.getVideo(id);
        const video = response.video;
        
        // Check if user is authorized to edit
        if (!user || (user._id !== video.uploadedBy._id && !isAdmin)) {
          toast({
            title: 'Unauthorized',
            description: 'You do not have permission to edit this video',
            variant: 'destructive',
          });
          navigate(`/videos/${id}`);
          return;
        }
        
        setTitle(video.title);
        setDescription(video.description || '');
        setIsPublic(video.isPublic);
      } catch (error: any) {
        console.error('Error fetching video:', error);
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to load video',
          variant: 'destructive',
        });
        navigate('/videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id, navigate, toast, user, isAdmin]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    try {
      setSubmitting(true);
      await videoService.updateVideo(id, {
        title,
        description,
        isPublic: String(isPublic)
      });
      
      toast({
        title: 'Success',
        description: 'Video details updated successfully',
      });
      
      navigate(`/videos/${id}`);
    } catch (error: any) {
      console.error('Error updating video:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update video',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
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
  
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Video</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Video title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Video description"
                  rows={5}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="public"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
                <Label htmlFor="public">Make video public</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => navigate(`/videos/${id}`)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default VideoEditPage;