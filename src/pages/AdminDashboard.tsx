
import React from 'react';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, MessageSquare, Bell, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Students', value: '156', icon: Users, color: 'text-blue-600' },
    { title: 'Active Quizzes', value: '8', icon: BookOpen, color: 'text-green-600' },
    { title: 'Course Notes', value: '24', icon: BookOpen, color: 'text-purple-600' },
    { title: 'Forum Posts', value: '43', icon: MessageSquare, color: 'text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="space-x-2">
              <Link to="/quiz">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Quiz
                </Button>
              </Link>
              <Link to="/announcements">
                <Button variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Post Announcement
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            {stat.title}
                          </dt>
                          <dd className="text-lg font-medium text-gray-900">
                            {stat.value}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Quiz Submissions</CardTitle>
                <CardDescription>Latest student quiz attempts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { student: 'Alice Johnson', quiz: 'Network Security Basics', score: '85%', time: '2 hours ago' },
                    { student: 'Bob Smith', quiz: 'Cryptography Fundamentals', score: '92%', time: '4 hours ago' },
                    { student: 'Carol Davis', quiz: 'Ethical Hacking', score: '78%', time: '6 hours ago' },
                  ].map((submission, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{submission.student}</p>
                        <p className="text-sm text-gray-600">{submission.quiz}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">{submission.score}</p>
                        <p className="text-sm text-gray-500">{submission.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Forum Activity</CardTitle>
                <CardDescription>Latest discussions and questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { student: 'Mike Wilson', topic: 'Help with SQL Injection prevention', replies: 3, time: '1 hour ago' },
                    { student: 'Sarah Brown', topic: 'Question about firewall configuration', replies: 1, time: '3 hours ago' },
                    { student: 'Tom Anderson', topic: 'Malware analysis tools recommendation', replies: 5, time: '5 hours ago' },
                  ].map((post, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{post.student}</p>
                        <p className="text-sm text-gray-600">{post.topic}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{post.replies} replies</p>
                        <p className="text-sm text-gray-500">{post.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
