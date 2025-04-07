
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, X } from 'lucide-react';

interface EntryCardProps {
  id: string;
  title: string;
  content: string;
  date: string;
  onDelete?: (id: string) => void;
}

const EntryCard = ({ id, title, content, date, onDelete }: EntryCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const aiSummary = "This entry shows reflection on key concepts you've learned. Consider connecting these ideas to your previous knowledge for deeper integration.";

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
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
        <p className="text-gray-600 line-clamp-3">
          {content}
        </p>
        {isExpanded && (
          <div className="mt-4 p-3 bg-bright-50 rounded-md border border-bright-100">
            <div className="flex items-center gap-2 text-sm font-medium text-bright-700 mb-2">
              <MessageSquare className="h-4 w-4" />
              <span>AI Insight</span>
            </div>
            <p className="text-sm text-gray-600">{aiSummary}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-bright-600 hover:text-bright-700 hover:bg-bright-50 w-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EntryCard;
