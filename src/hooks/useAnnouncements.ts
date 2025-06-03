
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'urgent';
  created_at: string;
  author_name: string;
  author_role: string;
}

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_announcements_with_authors');

      if (error) throw error;

      const formattedData = data?.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        type: item.type as 'info' | 'warning' | 'urgent',
        created_at: item.created_at,
        author_name: item.author_name || 'Unknown',
        author_role: item.author_role || 'student'
      })) || [];

      setAnnouncements(formattedData);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast({
        title: "Error",
        description: "Failed to load announcements",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createAnnouncement = async (title: string, content: string, type: 'info' | 'warning' | 'urgent') => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('announcements')
        .insert({
          title,
          content,
          type,
          author_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Announcement created successfully",
      });

      await fetchAnnouncements();
      return true;
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });

      await fetchAnnouncements();
      return true;
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return {
    announcements,
    isLoading,
    createAnnouncement,
    deleteAnnouncement,
    refetch: fetchAnnouncements
  };
};
