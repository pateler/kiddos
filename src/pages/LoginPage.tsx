
import React from 'react';
import Layout from '@/components/Layout';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Layout>
      <div className="max-w-md mx-auto my-12">
        <LoginForm />
      </div>
    </Layout>
  );
};

export default LoginPage;
