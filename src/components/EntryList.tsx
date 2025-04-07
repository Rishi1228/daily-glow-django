
import React, { useState, useEffect } from 'react';
import EntryCard from './EntryCard';
import { Clock } from 'lucide-react';

interface Entry {
  id: string;
  title: string;
  content: string;
  date: string;
}

const EntryList = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load entries from localStorage
    const storedEntries = localStorage.getItem('entries');
    
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries));
    }
    
    setIsLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem('entries', JSON.stringify(updatedEntries));
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
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default EntryList;
