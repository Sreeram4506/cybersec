import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Download, FileText, Trash, Plus, Search } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';

const Notes = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    file: null as File | null
  });

  const { notes, isLoading, createNote, downloadNote, deleteNote } = useNotes();

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = async () => {
    if (!uploadData.title || !uploadData.file) {
      return;
    }

    const success = await createNote(uploadData.title, uploadData.description, uploadData.file);
    
    if (success) {
      setUploadData({ title: '', description: '', file: null });
      setIsUploadOpen(false);
    }
  };

  const handleDownload = async (note: typeof notes[0]) => {
    await downloadNote(note);
  };

  const handleDelete = async (noteId: string) => {
    await deleteNote(noteId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="text-center">Loading notes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Course Notes</h1>
          {user?.role === 'admin' && (
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload New Note</DialogTitle>
                  <DialogDescription>
                    Add a new note or material for students to download.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={uploadData.title}
                      onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                      placeholder="Enter note title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={uploadData.description}
                      onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                      placeholder="Enter description (optional)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="file">File</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
                      onChange={(e) => setUploadData({...uploadData, file: e.target.files?.[0] || null})}
                    />
                  </div>
                  <Button onClick={handleFileUpload} className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Note
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                    {note.file_type}
                  </span>
                </div>
                <CardTitle className="text-lg">{note.title}</CardTitle>
                <CardDescription>{note.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <p>Uploaded: {new Date(note.upload_date).toLocaleDateString()}</p>
                    <p>Downloads: {note.download_count}</p>
                  </div>
                  
                  <div className="flex space-x-2">
                    {/* Show download button for all authenticated users */}
                    {user && (
                      <Button 
                        onClick={() => handleDownload(note)}
                        className="flex-1"
                        size="sm"
                        disabled={!note.file_url}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {note.file_url ? 'Download' : 'No file available'}
                      </Button>
                    )}
                    
                    {user?.role === 'admin' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(note.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Try adjusting your search terms.'
                  : 'No course notes have been uploaded yet.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Notes;
