
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface ForumReply {
  id: string;
  content: string;
  author_name: string;
  author_role: 'admin' | 'student';
  created_at: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author_name: string;
  author_role: 'admin' | 'student';
  created_at: string;
  reply_count: number;
  replies: ForumReply[];
}

export const useForumPosts = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      // Fetch topics using the secure function
      const { data: topicsData, error: topicsError } = await supabase
        .rpc('get_forum_posts_with_authors');

      if (topicsError) throw topicsError;

      // Fetch replies for all topics
      const postsWithReplies = await Promise.all(
        (topicsData || []).map(async (topic) => {
          const { data: repliesData, error: repliesError } = await supabase
            .rpc('get_forum_replies_with_authors', { topic_id_param: topic.id });

          if (repliesError) {
            console.error('Error fetching replies for topic:', topic.id, repliesError);
            return {
              id: topic.id,
              title: topic.title,
              content: topic.content,
              author_name: topic.author_name || 'Unknown',
              author_role: (topic.author_role as 'admin' | 'student') || 'student',
              created_at: topic.created_at,
              reply_count: topic.reply_count || 0,
              replies: []
            };
          }

          return {
            id: topic.id,
            title: topic.title,
            content: topic.content,
            author_name: topic.author_name || 'Unknown',
            author_role: (topic.author_role as 'admin' | 'student') || 'student',
            created_at: topic.created_at,
            reply_count: topic.reply_count || 0,
            replies: repliesData?.map(reply => ({
              id: reply.id,
              content: reply.content,
              author_name: reply.author_name || 'Unknown',
              author_role: (reply.author_role as 'admin' | 'student') || 'student',
              created_at: reply.created_at
            })) || []
          };
        })
      );

      setPosts(postsWithReplies);
    } catch (error) {
      console.error('Error fetching forum posts:', error);
      toast({
        title: "Error",
        description: "Failed to load forum posts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (title: string, content: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('topics')
        .insert({
          title,
          content,
          author_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post created successfully",
      });

      await fetchPosts();
      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
      return false;
    }
  };

  const createReply = async (topicId: string, content: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          content,
          topic_id: topicId,
          author_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reply posted successfully",
      });

      await fetchPosts();
      return true;
    } catch (error) {
      console.error('Error creating reply:', error);
      toast({
        title: "Error",
        description: "Failed to post reply",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    isLoading,
    createPost,
    createReply,
    refetch: fetchPosts
  };
};
