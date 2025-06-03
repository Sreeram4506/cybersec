
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bell, Plus, Clock, Trash, AlertCircle } from 'lucide-react';
import { useAnnouncements } from '@/hooks/useAnnouncements';

const Announcements = () => {
  const { user } = useAuth();
  const [isNewAnnouncementOpen, setIsNewAnnouncementOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'info' as 'info' | 'warning' | 'urgent'
  });

  const { announcements, isLoading, createAnnouncement, deleteAnnouncement } = useAnnouncements();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAnnouncementStyle = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'border-l-4 border-red-500 bg-red-50';
      case 'warning':
        return 'border-l-4 border-yellow-500 bg-yellow-50';
      default:
        return 'border-l-4 border-blue-500 bg-blue-50';
    }
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <Bell className="h-5 w-5 text-yellow-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      return;
    }

    const success = await createAnnouncement(
      newAnnouncement.title,
      newAnnouncement.content,
      newAnnouncement.type
    );

    if (success) {
      setNewAnnouncement({ title: '', content: '', type: 'info' });
      setIsNewAnnouncementOpen(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    await deleteAnnouncement(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="text-center">Loading announcements...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          {user?.role === 'admin' && (
            <Dialog open={isNewAnnouncementOpen} onOpenChange={setIsNewAnnouncementOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Announcement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Announcement</DialogTitle>
                  <DialogDescription>
                    Post an announcement to notify all students about important updates.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="announcementTitle">Title</Label>
                    <Input
                      id="announcementTitle"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                      placeholder="Enter announcement title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="announcementType">Type</Label>
                    <select
                      id="announcementType"
                      value={newAnnouncement.type}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, type: e.target.value as 'info' | 'warning' | 'urgent'})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="info">Information</option>
                      <option value="warning">Warning</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="announcementContent">Content</Label>
                    <Textarea
                      id="announcementContent"
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                      placeholder="Enter announcement content"
                      rows={4}
                    />
                  </div>
                  <Button onClick={handleCreateAnnouncement} className="w-full">
                    Post Announcement
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className={getAnnouncementStyle(announcement.type)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getAnnouncementIcon(announcement.type)}
                    <div>
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>By {announcement.author_name}</span>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDate(announcement.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                  {user?.role === 'admin' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAnnouncement(announcement.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {announcements.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements</h3>
              <p className="text-gray-600">Check back later for important updates and announcements.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Announcements;
