import React from 'react';
import { LayoutGrid, Settings, User, Volume2, Users, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const L1Panel: React.FC = () => {
  const iconSize = 28; // Increase icon size
  // Use standard icon color, e.g., netcore-nav-icon or a suitable gray/blue
  // const iconColor = "text-gray-400"; // Removing this variable as color is applied directly

  const navItems = [
    { icon: LayoutGrid, label: 'Apps' },
    { icon: Volume2, label: 'Campaigns' },
    { icon: Users, label: 'Audience' },
    { icon: FileText, label: 'Content' },
    { icon: Search, label: 'Insights' },
  ];

  const bottomItems = [
    { icon: Settings, label: 'Settings' },
    { icon: User, label: 'Profile' }, 
  ];

  return (
    <TooltipProvider delayDuration={100}>
      {/* Revert to fixed positioning, standard background, original height/width */}
      {/* Update background to cobalt-blue */}
      <div className="fixed top-16 left-0 z-30 flex flex-col items-center w-16 h-[calc(100vh-4rem)] bg-cobalt-blue pt-4 pb-4">
        
        {/* Main Navigation Icons - Restore flex-grow */}
        <nav className="flex flex-col items-center space-y-4 flex-grow">
          {navItems.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                 {/* Update icon color to white */}
                <Button variant="ghost" size="icon" className="w-10 h-10 text-white hover:bg-blue-700/50">
                  <item.icon size={iconSize} />
                  <span className="sr-only">{item.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        {/* Bottom Icons - Remove mt-auto, adjust spacing if needed */}
        <div className="flex flex-col items-center space-y-2">
          {bottomItems.map((item, index) => (
             <Tooltip key={index}>
              <TooltipTrigger asChild>
                {/* Standard button styling for bottom icons including Profile */}
                 {/* Update icon color to white */}
                <Button variant="ghost" size="icon" className="w-10 h-10 text-white hover:bg-blue-700/50">
                  <item.icon size={iconSize} />
                  <span className="sr-only">{item.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default L1Panel;