import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, UserCircle, Rocket, LineChart, ChevronDown } from 'lucide-react'; // Updated icons
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Added Avatar for profile

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-6 bg-white border-b border-border">
      <div className="flex items-center space-x-4">
        {/* Placeholder for actual Netcore Logo Component/Image */}
        <span className="text-xl font-bold text-orange-600">Netcore</span> 
        <span className="px-2 py-0.5 text-xs font-semibold text-netcore-dark-blue bg-netcore-light-blue rounded">
          CUSTOMER ENGAGEMENT
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="default" size="sm" className="bg-netcore-dark-blue text-white hover:bg-netcore-blue">
          <Rocket className="w-4 h-4 mr-2" />
          Create
        </Button>
        {/* Icons from image */}
        <Avatar className="w-6 h-6 cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> {/* Placeholder image */} 
          <AvatarFallback>IN</AvatarFallback> {/* Initials */} 
        </Avatar>
        <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
        <LineChart className="w-5 h-5 text-green-500 cursor-pointer hover:text-green-700" /> {/* Analytics Icon */}
        
        <div className="flex items-center space-x-1 cursor-pointer">
           {/* Live Indicator */}
           <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          <span className="text-sm font-medium text-gray-700">Inshaal</span>
          <ChevronDown className="h-4 w-4 text-gray-600" />
        </div>
      </div>
    </header>
  );
};

export default Header;