import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, UserCircle, Rocket, LineChart, ChevronDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDashboard } from '@/contexts/DashboardContext';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { setCurrentView, currentView } = useDashboard();
  const navigate = useNavigate();

  const handleAiCopilotClick = () => {
    console.log('[Header.tsx] handleAiCopilotClick called. Setting view to insightGenerator.');
    setCurrentView('insightGenerator');
    // console.log('[Header.tsx] setCurrentView called with insightGenerator'); // Keep this if still needed for debugging setCurrentView itself
  };

  useEffect(() => {
    // Only navigate if the currentView was intentionally set to insightGenerator by this component's action
    // and the navigation hasn't already occurred or isn't for a different purpose.
    // This check might need refinement if currentView can be 'insightGenerator' through other means.
    if (currentView === 'insightGenerator') {
      console.log('[Header.tsx] useEffect detected currentView is insightGenerator, navigating to /.');
      navigate('/');
    }
  }, [currentView, navigate]); // Depend on currentView and navigate

  // SVG as a component or inline
  const AiCopilotIcon = () => (
    <svg 
      width="24"
      height="24"
      viewBox="0 0 34 34" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="!w-6 !h-6"
    >
      <path d="M8.25645 8.7627C8.56812 8.7627 8.81251 10.0698 9.17816 10.4366C9.54381 10.8033 10.8469 11.0485 10.8469 11.3611C10.8469 11.6738 9.54381 11.9189 9.17816 12.2857C8.81251 12.6525 8.56812 13.9596 8.25645 13.9596C7.94478 13.9596 7.70039 12.6525 7.33474 12.2857C6.96909 11.9189 5.66602 11.6738 5.66602 11.3611C5.66602 11.0485 6.96909 10.8033 7.33474 10.4366C7.70039 10.0698 7.94478 8.7627 8.25645 8.7627Z" fill="#0A8FFD"/>
      <path d="M24.0594 5.66602C24.7804 5.66602 24.9596 7.42093 25.7713 8.23521C26.5831 9.04949 28.3326 9.22918 28.3326 9.95245C28.3326 10.6757 26.5831 10.8554 25.7713 11.6697C24.9596 12.484 24.7804 14.2389 24.0594 14.2389C23.3383 14.2389 23.1592 12.484 22.3474 11.6697C21.5356 10.8554 19.7861 10.6757 19.7861 9.95245C19.7861 9.22918 21.5356 9.04949 22.3474 8.23521C23.1592 7.42093 23.3383 5.66602 24.0594 5.66602Z" fill="#0A8FFD"/>
      <path d="M16.5336 10.7412C17.5666 10.7412 18.4164 15.2061 19.6338 16.4273C20.8513 17.6486 25.3025 18.5009 25.3025 19.5372C25.3025 20.5734 20.8513 21.4258 19.6338 22.647C18.4164 23.8682 17.5666 28.3331 16.5336 28.3331C15.5005 28.3331 14.6508 23.8682 13.4333 22.647C12.2158 21.4258 7.76465 20.5734 7.76465 19.5372C7.76465 18.5009 12.2158 17.6486 13.4333 16.4273C14.6508 15.2061 15.5005 10.7412 16.5336 10.7412Z" fill="#0A8FFD"/>
    </svg>
  );

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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleAiCopilotClick} className="text-gray-600 hover:text-gray-800">
              <AiCopilotIcon />
              <span className="sr-only">Ask AI for Insights</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ask AI for insights</p>
          </TooltipContent>
        </Tooltip>
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