
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { BookOpen, Send, Sparkles } from 'lucide-react';

const EntryForm = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isLoggedIn = !!localStorage.getItem('dailyBrightToken');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to save your reflection.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would connect to a Django backend endpoint
      const response = await fetch('http://localhost:8000/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('dailyBrightToken')}`,
        },
        body: JSON.stringify({
          title,
          content,
          date: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save entry');
      }
      
      toast({
        title: "Entry Saved",
        description: "Your reflection has been saved successfully.",
      });
      
      setTitle('');
      setContent('');
      setFeedback(null);
      
      // Force a reload to show the new entry in the list
      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save your entry. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateFeedback = async () => {
    if (!content) {
      toast({
        variant: "destructive",
        title: "Content Required",
        description: "Please write your reflection first to get AI feedback.",
      });
      return;
    }
    
    setIsGeneratingFeedback(true);
    
    try {
      // In a real implementation, this would connect to a Django backend endpoint
      const response = await fetch('http://localhost:8000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': isLoggedIn ? `Bearer ${localStorage.getItem('dailyBrightToken')}` : '',
        },
        body: JSON.stringify({
          content,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate feedback');
      }
      
      const data = await response.json();
      setFeedback(data.feedback);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate AI feedback. Please try again.",
      });
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-bright-600" />
            <span>Today's Reflection</span>
          </CardTitle>
          <p className="text-sm text-gray-500">{today}</p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="What did you learn today? (Title)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-bright-200 focus:border-bright-400"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Textarea
              placeholder="Describe your learnings, insights or reflections..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] border-bright-200 focus:border-bright-400"
              required
            />
          </div>
          
          {feedback && (
            <div className="mt-4 p-3 bg-bright-50 rounded-md border border-bright-100">
              <div className="flex items-center gap-2 text-sm font-medium text-bright-700 mb-2">
                <Sparkles className="h-4 w-4" />
                <span>AI Feedback</span>
              </div>
              <p className="text-sm text-gray-600">{feedback}</p>
            </div>
          )}
          
          {!feedback && content.length > 20 && (
            <Button
              type="button"
              variant="outline"
              className="w-full border-bright-200 text-bright-600 hover:bg-bright-50"
              onClick={handleGenerateFeedback}
              disabled={isGeneratingFeedback}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isGeneratingFeedback ? 'Generating...' : 'Get AI Feedback'}
            </Button>
          )}
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="bg-bright-600 hover:bg-bright-700 text-white w-full"
            disabled={isSubmitting || !title || !content || !isLoggedIn}
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Saving...' : isLoggedIn ? 'Save Reflection' : 'Sign In to Save'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EntryForm;
