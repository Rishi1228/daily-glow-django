
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { BookOpen, Send } from 'lucide-react';

const EntryForm = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission delay
    setTimeout(() => {
      // Here we would normally connect to backend for saving the entry
      
      // Create a new entry object
      const newEntry = {
        id: Date.now().toString(),
        title,
        content,
        date: new Date().toISOString(),
      };

      // Save to localStorage for now as placeholder
      const existingEntries = JSON.parse(localStorage.getItem('entries') || '[]');
      localStorage.setItem('entries', JSON.stringify([newEntry, ...existingEntries]));
      
      toast({
        title: "Entry Saved",
        description: "Your reflection has been saved successfully.",
      });
      
      setTitle('');
      setContent('');
      setIsSubmitting(false);
      
      // Force a reload to show the new entry in the list
      window.location.reload();
    }, 1000);
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
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="bg-bright-600 hover:bg-bright-700 text-white w-full"
            disabled={isSubmitting || !title || !content}
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Reflection'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EntryForm;
