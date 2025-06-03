
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, BookOpen, Users, MessageSquare } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">CyberSec Academy</h1>
            </div>
            <div className="space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Master <span className="text-blue-600">Cybersecurity</span>
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Join our comprehensive cybersecurity course with interactive quizzes, expert notes, and collaborative learning.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="text-center">
                <BookOpen className="h-10 w-10 text-blue-600 mx-auto" />
                <CardTitle>Course Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Access comprehensive study materials and lecture notes
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Shield className="h-10 w-10 text-green-600 mx-auto" />
                <CardTitle>Interactive Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Test your knowledge with auto-graded quizzes and assessments
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <MessageSquare className="h-10 w-10 text-purple-600 mx-auto" />
                <CardTitle>Discussion Forum</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Collaborate with peers and get help from instructors
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="h-10 w-10 text-orange-600 mx-auto" />
                <CardTitle>Expert Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Learn from industry professionals and experienced instructors
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
