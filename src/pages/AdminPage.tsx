
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import AdminVideoList from '@/components/admin/AdminVideoList';
import { videoService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminPage = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin, loading: authLoading } = useAuth();

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

    if (isAdmin) {
      fetchVideos();
    }
  }, [isAdmin, toast]);

  const handleDeleteVideo = (id: string) => {
    setVideos(videos.filter(video => video._id !== id));
  };

  const refreshVideos = async () => {
    setLoading(true);
    try {
      const response = await videoService.getAllVideos();
      setVideos(response.videos);
    } catch (error) {
      console.error('Error refreshing videos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-DEFAULT"></div>
        </div>
      </Layout>
    );
  }
  
  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        
        <Tabs defaultValue="videos">
          <TabsList className="mb-4">
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-DEFAULT"></div>
              </div>
            ) : (
              <AdminVideoList 
                videos={videos} 
                onDeleteVideo={handleDeleteVideo}
                refreshVideos={refreshVideos}
              />
            )}
          </TabsContent>
          
          <TabsContent value="users">
            <div className="p-4 border rounded-md">
              <p className="text-center text-gray-500">User management coming soon</p>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="p-4 border rounded-md">
              <p className="text-center text-gray-500">Settings coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPage;
