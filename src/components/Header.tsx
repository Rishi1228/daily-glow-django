
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, BookOpen, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-bright-600" />
          <h1 className="text-2xl font-bold text-gray-800">Daily Bright</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Sun className="h-5 w-5" />
          </Button>
          <Link to="/auth">
            <Button variant="outline" className="bg-bright-50 text-bright-700 border-bright-200 hover:bg-bright-100">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
