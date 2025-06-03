
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Plus, Reply, Clock, User } from 'lucide-react';
import { useForumPosts } from '@/hooks/useForumPosts';

const Forum = () => {
  const { user } = useAuth();
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [newReply, setNewReply] = useState('');

  const { posts, isLoading, createPost, createReply } = useForumPosts();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      return;
    }

    const success = await createPost(newPost.title, newPost.content);
    
    if (success) {
      setNewPost({ title: '', content: '' });
      setIsNewPostOpen(false);
    }
  };

  const handleReply = async (postId: string) => {
    if (!newReply.trim()) {
      return;
    }

    const success = await createReply(postId, newReply);
    
    if (success) {
      setNewReply('');
      setSelectedPost(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto py-6 px-4">
          <div className="text-center">Loading forum posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Discussion Forum</h1>
          <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>
                  Ask a question or start a discussion with your classmates and instructor.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="postTitle">Title</Label>
                  <Input
                    id="postTitle"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    placeholder="Enter post title"
                  />
                </div>
                <div>
                  <Label htmlFor="postContent">Content</Label>
                  <Textarea
                    id="postContent"
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    placeholder="Enter your question or discussion topic"
                    rows={4}
                  />
                </div>
                <Button onClick={handleCreatePost} className="w-full">
                  Create Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span className={post.author_role === 'admin' ? 'font-medium text-blue-600' : ''}>
                          {post.author_name}
                          {post.author_role === 'admin' && ' (Instructor)'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(post.created_at)}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {post.reply_count} replies
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{post.content}</p>
                
                {post.replies.length > 0 && (
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="font-medium text-gray-900">Replies</h4>
                    {post.replies.map((reply) => (
                      <div key={reply.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span className={reply.author_role === 'admin' ? 'font-medium text-blue-600' : ''}>
                            {reply.author_name}
                            {reply.author_role === 'admin' && ' (Instructor)'}
                          </span>
                          <span>{formatDate(reply.created_at)}</span>
                        </div>
                        <p className="text-gray-700">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="border-t pt-4 mt-4">
                  <div className="space-y-3">
                    <Textarea
                      value={selectedPost === post.id ? newReply : ''}
                      onChange={(e) => {
                        setSelectedPost(post.id);
                        setNewReply(e.target.value);
                      }}
                      placeholder="Write a reply..."
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => handleReply(post.id)}
                        size="sm"
                        disabled={!newReply.trim() || selectedPost !== post.id}
                      >
                        <Reply className="h-4 w-4 mr-2" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {posts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions yet</h3>
              <p className="text-gray-600">Be the first to start a discussion!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Forum;
