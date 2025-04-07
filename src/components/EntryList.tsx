
import React, { useState, useEffect } from 'react';
import EntryCard from './EntryCard';
import { Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Entry {
  id: string;
  title: string;
  content: string;
  date: string;
  feedback?: string;
}

const EntryList = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        // Get the auth token from localStorage
        const token = localStorage.getItem('dailyBrightToken');
        
        if (!token) {
          setEntries([]);
          setIsLoading(false);
          return;
        }
        
        // In a real implementation, this would connect to a Django backend endpoint
        const response = await fetch('http://localhost:8000/api/entries', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch entries');
        }
        
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Could not load your reflections",
        });
        setEntries([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEntries();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      // Get the auth token from localStorage
      const token = localStorage.getItem('dailyBrightToken');
      
      if (!token) {
        toast({
          variant: "destructive",
          title: "Authentication Required",
          description: "Please sign in to delete entries.",
        });
        return;
      }
      
      // In a real implementation, this would connect to a Django backend endpoint
      const response = await fetch(`http://localhost:8000/api/entries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }
      
      const updatedEntries = entries.filter(entry => entry.id !== id);
      setEntries(updatedEntries);
      
      toast({
        title: "Entry Deleted",
        description: "Your reflection has been deleted successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete entry",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-8">
        <div className="animate-pulse flex flex-col space-y-4 w-full">
          {[1, 2].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Clock className="h-12 w-12 text-bright-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-700">No reflections yet</h3>
        <p className="text-gray-500 mt-2 max-w-md">
          Your past reflections will appear here once you've added them.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <Clock className="h-5 w-5 text-bright-600" />
        Past Reflections
      </h2>
      
      <div className="grid grid-cols-1 gap-4">
        {entries.map((entry) => (
          <EntryCard
            key={entry.id}
            id={entry.id}
            title={entry.title}
            content={entry.content}
            date={entry.date}
            feedback={entry.feedback}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default EntryList;
