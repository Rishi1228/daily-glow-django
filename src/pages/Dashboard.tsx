
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 animate-fade-in">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Welcome to your Daily Bright dashboard. Here's a summary of your reflective learning journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Your reflection statistics will appear here.</p>
                <button 
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  onClick={() => navigate('/')}
                >
                  Return Home
                </button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Your recent reflections will appear here.</p>
                <button 
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  onClick={() => navigate('/timeline')}
                >
                  View Timeline
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
