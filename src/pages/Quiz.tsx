
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Question {
  id: string;
  type: 'mcq' | 'short';
  question: string;
  options?: string[];
  correctAnswer: string;
  points: number;
}

const Quiz = () => {
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: '',
    type: 'mcq',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 1
  });

  const addQuestion = () => {
    if (!currentQuestion.question || !currentQuestion.correctAnswer) {
      toast({
        title: "Incomplete question",
        description: "Please fill in the question and correct answer.",
        variant: "destructive",
      });
      return;
    }

    const newQuestion = {
      ...currentQuestion,
      id: Date.now().toString()
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion({
      id: '',
      type: 'mcq',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1
    });

    toast({
      title: "Question added",
      description: "Question has been added to the quiz.",
    });
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const saveQuiz = () => {
    if (!quizTitle || questions.length === 0) {
      toast({
        title: "Incomplete quiz",
        description: "Please add a title and at least one question.",
        variant: "destructive",
      });
      return;
    }

    // Here you would save to Supabase
    console.log('Saving quiz:', { title: quizTitle, description: quizDescription, questions });
    
    toast({
      title: "Quiz saved",
      description: "Your quiz has been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Quiz</h1>

        {/* Quiz Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quiz Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Enter quiz title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                placeholder="Enter quiz description"
              />
            </div>
          </CardContent>
        </Card>

        {/* Add Question */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="questionType">Question Type</Label>
                <Select
                  value={currentQuestion.type}
                  onValueChange={(value: 'mcq' | 'short') => 
                    setCurrentQuestion({...currentQuestion, type: value, options: value === 'mcq' ? ['', '', '', ''] : undefined})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mcq">Multiple Choice</SelectItem>
                    <SelectItem value="short">Short Answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  value={currentQuestion.points}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, points: parseInt(e.target.value) || 1})}
                  min="1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                placeholder="Enter your question"
              />
            </div>

            {currentQuestion.type === 'mcq' && (
              <div className="space-y-2">
                <Label>Options</Label>
                {currentQuestion.options?.map((option, index) => (
                  <Input
                    key={index}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(currentQuestion.options || [])];
                      newOptions[index] = e.target.value;
                      setCurrentQuestion({...currentQuestion, options: newOptions});
                    }}
                    placeholder={`Option ${index + 1}`}
                  />
                ))}
              </div>
            )}

            <div>
              <Label htmlFor="correctAnswer">Correct Answer</Label>
              {currentQuestion.type === 'mcq' ? (
                <Select
                  value={currentQuestion.correctAnswer}
                  onValueChange={(value) => setCurrentQuestion({...currentQuestion, correctAnswer: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select correct option" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentQuestion.options?.map((option, index) => (
                      option && (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      )
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, correctAnswer: e.target.value})}
                  placeholder="Enter correct answer"
                />
              )}
            </div>

            <Button onClick={addQuestion} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </CardContent>
        </Card>

        {/* Questions List */}
        {questions.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quiz Questions ({questions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Question {index + 1}</h3>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-gray-700 mb-2">{question.question}</p>
                    {question.type === 'mcq' && (
                      <div className="text-sm text-gray-600">
                        <p>Options: {question.options?.join(', ')}</p>
                      </div>
                    )}
                    <p className="text-sm text-green-600">
                      Correct Answer: {question.correctAnswer} ({question.points} points)
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Quiz */}
        <div className="text-center">
          <Button onClick={saveQuiz} size="lg">
            <Save className="h-4 w-4 mr-2" />
            Save Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
