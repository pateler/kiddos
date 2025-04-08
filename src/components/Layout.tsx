
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { FilmIcon, HomeIcon, UploadIcon, UserIcon, LogInIcon, LogOutIcon, SettingsIcon } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/', text: 'Home', Icon: HomeIcon },
    { path: '/videos', text: 'Videos', Icon: FilmIcon },
  ];

  const authLinks = isAuthenticated
    ? [
        { path: '/upload', text: 'Upload', Icon: UploadIcon },
        { path: '/profile', text: 'Profile', Icon: UserIcon },
        ...(isAdmin ? [{ path: '/admin', text: 'Admin', Icon: SettingsIcon }] : []),
      ]
    : [
        { path: '/login', text: 'Login', Icon: LogInIcon },
        { path: '/register', text: 'Register', Icon: UserIcon },
      ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-brand-DEFAULT text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <FilmIcon size={24} />
            <Link to="/" className="text-xl font-bold">VideoVoyage</Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-brand-light'
                    : 'hover:bg-brand-light hover:bg-opacity-70 transition-colors'
                }`}
              >
                {link.text}
              </Link>
            ))}
            
            {authLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-brand-light'
                    : 'hover:bg-brand-light hover:bg-opacity-70 transition-colors'
                }`}
              >
                {link.text}
              </Link>
            ))}
            
            {isAuthenticated && (
              <Button 
                variant="ghost" 
                onClick={logout}
                className="text-white hover:bg-brand-light hover:bg-opacity-70"
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                Logout
              </Button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            {/* We would add mobile menu logic here */}
            <Button variant="ghost" size="icon" className="text-white">
              <span className="sr-only">Open menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} VideoVoyage. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-brand-accent">Terms</a>
              <a href="#" className="hover:text-brand-accent">Privacy</a>
              <a href="#" className="hover:text-brand-accent">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
