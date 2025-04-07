
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, Sparkles, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface EntryCardProps {
  id: string;
  title: string;
  content: string;
  date: string;
  feedback?: string;
  onDelete?: (id: string) => void;
}

const EntryCard = ({ id, title, content, date, feedback, onDelete }: EntryCardProps) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(feedback || '');
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };
  
  const generateFeedback = async () => {
    setIsGeneratingFeedback(true);
    
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem('dailyBrightToken');
      
      // In a real implementation, this would connect to a Django backend endpoint
      const response = await fetch('http://localhost:8000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          entryId: id,
          content,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate feedback');
      }
      
      const data = await response.json();
      setAiFeedback(data.feedback);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate AI feedback",
      });
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  return (
    <Card className="w-full bg-white shadow-sm hover:shadow-md entry-card-transition">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-400 hover:text-red-500"
            onClick={handleDelete}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          {formattedDate}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className={`text-gray-600 ${!isExpanded && 'line-clamp-3'}`}>
          {content}
        </p>
        {isExpanded && aiFeedback && (
          <div className="mt-4 p-3 bg-bright-50 rounded-md border border-bright-100">
            <div className="flex items-center gap-2 text-sm font-medium text-bright-700 mb-2">
              <Sparkles className="h-4 w-4" />
              <span>AI Insight</span>
            </div>
            <p className="text-sm text-gray-600">{aiFeedback}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-bright-600 hover:text-bright-700 hover:bg-bright-50"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
        
        {isExpanded && !aiFeedback && (
          <Button
            variant="outline"
            size="sm"
            className="border-bright-200 text-bright-600 hover:bg-bright-50"
            onClick={generateFeedback}
            disabled={isGeneratingFeedback}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            {isGeneratingFeedback ? 'Generating...' : 'Get AI Feedback'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EntryCard;
