
import React from 'react';
import Layout from '@/components/Layout';
import VideoUploadForm from '@/components/VideoUploadForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const UploadPage = () => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading state while checking auth
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-DEFAULT"></div>
        </div>
      </Layout>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
        <VideoUploadForm />
      </div>
    </Layout>
  );
};

export default UploadPage;
