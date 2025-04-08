
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { videoService } from '@/services/api';
import { Loader2Icon, UploadIcon } from 'lucide-react';

const VideoUploadForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [filename, setFilename] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is video
      if (!file.type.startsWith('video/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a video file.',
          variant: 'destructive',
        });
        return;
      }

      // Check file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Video size should be less than 100MB.',
          variant: 'destructive',
        });
        return;
      }

      setVideoFile(file);
      setFilename(file.name);
      if (!title) {
        // Set title to filename without extension
        const nameWithoutExt = file.name.split('.').slice(0, -1).join('.');
        setTitle(nameWithoutExt);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      toast({
        title: 'No video selected',
        description: 'Please select a video to upload.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setUploading(true);
      // For demo progress simulation
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 90) {
            clearInterval(interval);
            return 90;
          }
          return newProgress;
        });
      }, 500);

      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('isPublic', String(isPublic));

      const response = await videoService.uploadVideo(formData);
      clearInterval(interval);
      setUploadProgress(100);
      
      toast({
        title: 'Upload successful',
        description: 'Your video has been uploaded successfully.',
      });
      
      // Navigate to the video page
      navigate(`/videos/${response.video._id}`);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.response?.data?.message || 'An error occurred during upload.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Upload Video</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="video">Video File</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="border border-gray-200"
                />
              </div>
              {filename && (
                <p className="text-sm text-gray-500 mt-1">{filename}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={uploading}
                required
                placeholder="Enter video title"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploading}
                placeholder="Describe your video..."
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
                disabled={uploading}
              />
              <Label htmlFor="public">Make video public</Label>
            </div>

            {uploading && (
              <div className="mt-4">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-accent"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-center mt-2 text-sm text-gray-500">
                  Uploading: {uploadProgress}%
                </p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <Button 
              type="submit" 
              className="w-full bg-brand-DEFAULT hover:bg-brand-light" 
              disabled={!videoFile || uploading}
            >
              {uploading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload Video
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VideoUploadForm;
