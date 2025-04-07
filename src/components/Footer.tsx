
import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-6 px-6 bg-white border-t">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Daily Bright. All rights reserved.
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 md:mt-0">
          <span>Made with</span>
          <Heart className="h-4 w-4 text-red-400" />
          <span>for your reflective journey</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
