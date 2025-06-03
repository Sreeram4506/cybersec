
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Question {
  id: string;
  type: 'mcq' | 'short';
  question: string;
  options?: string[];
  points: number;
}

const TakeQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock quiz data - replace with Supabase fetch
  const quiz = {
    id: id,
    title: 'Network Security Basics',
    description: 'Test your knowledge of network security fundamentals',
    questions: [
      {
        id: '1',
        type: 'mcq' as const,
        question: 'What does VPN stand for?',
        options: ['Virtual Private Network', 'Virtual Public Network', 'Verified Private Network', 'Verified Public Network'],
        points: 5
      },
      {
        id: '2',
        type: 'mcq' as const,
        question: 'Which port is commonly used for HTTPS?',
        options: ['80', '443', '22', '21'],
        points: 5
      },
      {
        id: '3',
        type: 'short' as const,
        question: 'Explain what a firewall does in network security.',
        points: 10
      }
    ]
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitQuiz = () => {
    // Calculate score for MCQs
    const correctAnswers = {
      '1': 'Virtual Private Network',
      '2': '443'
    };
    
    let score = 0;
    let totalPoints = 0;
    
    quiz.questions.forEach(question => {
      totalPoints += question.points;
      if (question.type === 'mcq' && answers[question.id] === correctAnswers[question.id as keyof typeof correctAnswers]) {
        score += question.points;
      }
    });

    const percentage = Math.round((score / totalPoints) * 100);
    
    console.log('Quiz submitted:', { answers, score, percentage });
    setIsSubmitted(true);
    
    toast({
      title: "Quiz submitted successfully",
      description: `Your score: ${percentage}%`,
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-2xl mx-auto py-12 px-4">
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
              <p className="text-gray-600 mb-6">Your answers have been submitted successfully.</p>
              <Button onClick={() => navigate('/dashboard')}>
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-3xl mx-auto py-6 px-4">
        {/* Quiz Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{quiz.title}</CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </div>
              <div className="flex items-center space-x-2 text-lg font-medium">
                <Clock className="h-5 w-5" />
                <span className={timeLeft < 300 ? 'text-red-600' : 'text-gray-700'}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>

        {/* Current Question */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
            <CardDescription>{currentQuestion.points} points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-lg">{currentQuestion.question}</p>
              
              {currentQuestion.type === 'mcq' ? (
                <RadioGroup
                  value={answers[currentQuestion.id] || ''}
                  onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
                >
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div>
                  <Label htmlFor="shortAnswer">Your Answer</Label>
                  <Input
                    id="shortAnswer"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                    placeholder="Enter your answer here..."
                    className="mt-2"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          <div className="space-x-2">
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button onClick={submitQuiz}>
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={nextQuestion}>
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
