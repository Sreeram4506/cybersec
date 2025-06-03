
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  BookOpen, 
  MessageSquare, 
  Bell, 
  Settings,
  LogOut
} from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: Shield },
    { path: '/quiz', label: 'Manage Quizzes', icon: BookOpen },
    { path: '/notes', label: 'Manage Notes', icon: BookOpen },
    { path: '/forum', label: 'Forum', icon: MessageSquare },
    { path: '/announcements', label: 'Announcements', icon: Bell },
  ];

  const studentLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: Shield },
    { path: '/notes', label: 'Course Notes', icon: BookOpen },
    { path: '/forum', label: 'Discussion Forum', icon: MessageSquare },
    { path: '/announcements', label: 'Announcements', icon: Bell },
  ];

  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">CyberSec Academy</span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(link.path)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.name}
            </span>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
