import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface Note {
  id: string;
  title: string;
  description: string;
  file_name: string;
  file_type: string;
  file_url: string | null;
  upload_date: string;
  download_count: number;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) throw error;

      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Error",
        description: "Failed to load notes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = async (title: string, description: string, file: File) => {
    if (!user) return false;

    try {
      // First upload the file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `notes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Then create the note record with the file URL
      const { error } = await supabase
        .from('notes')
        .insert({
          title,
          description,
          file_name: file.name,
          file_type: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
          file_url: filePath,
          author_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note uploaded successfully",
      });

      await fetchNotes();
      return true;
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: "Error",
        description: "Failed to upload note",
        variant: "destructive",
      });
      return false;
    }
  };

  const downloadNote = async (note: Note) => {
    try {
      if (!note.file_url) {
        toast({
          title: "Error",
          description: "File not available for download",
          variant: "destructive",
        });
        return;
      }

      console.log('Attempting to download file:', note.file_url);

      // Get the file from Supabase Storage
      const { data, error } = await supabase.storage
        .from('course-files')
        .download(note.file_url);

      if (error) {
        console.error('Download error:', error);
        toast({
          title: "Error",
          description: `Download failed: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        toast({
          title: "Error",
          description: "No file data received",
          variant: "destructive",
        });
        return;
      }

      // Create a blob URL and trigger download
      const blob = new Blob([data], { type: data.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = note.file_name || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Increment download count
      await incrementDownloadCount(note.id);

      toast({
        title: "Success",
        description: "File downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading note:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const incrementDownloadCount = async (noteId: string) => {
    try {
      // First get the current download count
      const { data: currentNote, error: fetchError } = await supabase
        .from('notes')
        .select('download_count')
        .eq('id', noteId)
        .single();

      if (fetchError) throw fetchError;

      // Increment the download count
      const { error } = await supabase
        .from('notes')
        .update({ download_count: (currentNote?.download_count || 0) + 1 })
        .eq('id', noteId);

      if (error) throw error;

      await fetchNotes();
    } catch (error) {
      console.error('Error updating download count:', error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      // First get the note to find the file URL
      const { data: note, error: fetchError } = await supabase
        .from('notes')
        .select('file_url')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Delete the file from storage if it exists
      if (note?.file_url) {
        const { error: storageError } = await supabase.storage
          .from('course-files')
          .remove([note.file_url]);

        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
        }
      }

      // Delete the note record
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Note deleted successfully",
      });

      await fetchNotes();
      return true;
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return {
    notes,
    isLoading,
    createNote,
    downloadNote,
    incrementDownloadCount,
    deleteNote,
    refetch: fetchNotes
  };
};
