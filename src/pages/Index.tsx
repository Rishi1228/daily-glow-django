
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EntryForm from '@/components/EntryForm';
import EntryList from '@/components/EntryList';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has a token stored
    const token = localStorage.getItem('dailyBrightToken');
    
    // If token exists, validate it (in a real app, you would verify the token with the server)
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 animate-fade-in">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Bright</h1>
            <p className="text-gray-600">
              Track your daily learnings and receive AI-powered insights to enhance your personal growth journey.
            </p>
          </div>
          
          <div className="space-y-8">
            <EntryForm />
            
            <Separator className="my-8" />
            
            {isAuthenticated ? (
              <EntryList />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Sign in to view your past reflections</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
