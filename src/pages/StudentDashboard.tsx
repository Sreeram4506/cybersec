
import React from 'react';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, MessageSquare, Bell, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const recentQuizzes = [
    { id: 1, title: 'Network Security Basics', score: 85, completed: true, dueDate: 'Completed' },
    { id: 2, title: 'Cryptography Fundamentals', score: null, completed: false, dueDate: 'Due in 2 days' },
    { id: 3, title: 'Web Application Security', score: null, completed: false, dueDate: 'Due in 5 days' },
  ];

  const recentNotes = [
    { title: 'Introduction to Cybersecurity', uploadDate: '2 days ago', type: 'PDF' },
    { title: 'Network Security Protocols', uploadDate: '1 week ago', type: 'DOC' },
    { title: 'Ethical Hacking Guidelines', uploadDate: '1 week ago', type: 'PDF' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your learning progress.</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Completed Quizzes</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Pending Quizzes</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Average Score</p>
                    <p className="text-2xl font-bold text-gray-900">87%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quizzes */}
            <Card>
              <CardHeader>
                <CardTitle>Your Quizzes</CardTitle>
                <CardDescription>Complete your assignments and track your progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentQuizzes.map((quiz) => (
                    <div key={quiz.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">{quiz.title}</h3>
                        <p className="text-sm text-gray-600">
                          {quiz.completed ? `Score: ${quiz.score}%` : quiz.dueDate}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {quiz.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Link to={`/quiz/${quiz.id}`}>
                            <Button size="sm">Take Quiz</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Course Notes</CardTitle>
                <CardDescription>Latest materials uploaded by your instructor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentNotes.map((note, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">{note.title}</h3>
                        <p className="text-sm text-gray-600">{note.uploadDate}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {note.type}
                        </span>
                        <Button size="sm" variant="outline">Download</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link to="/notes">
                    <Button variant="outline" className="w-full">View All Notes</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Announcements */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
              <CardDescription>Important updates from your instructor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: 'New Assignment: Web Security Analysis', content: 'Complete the web security analysis assignment by Friday.', date: '2 days ago' },
                  { title: 'Quiz Reminder: Cryptography Fundamentals', content: 'Don\'t forget about the upcoming cryptography quiz.', date: '1 week ago' },
                ].map((announcement, index) => (
                  <div key={index} className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <h3 className="font-medium text-blue-900">{announcement.title}</h3>
                    <p className="text-blue-700 mt-1">{announcement.content}</p>
                    <p className="text-blue-600 text-sm mt-2">{announcement.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
