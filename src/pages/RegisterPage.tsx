
import React from 'react';
import Layout from '@/components/Layout';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Layout>
      <div className="max-w-md mx-auto my-12">
        <RegisterForm />
      </div>
    </Layout>
  );
};

export default RegisterPage;
