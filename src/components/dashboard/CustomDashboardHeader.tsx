import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Bell, Save, Edit2 } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dashboard, ChartType } from '@/types/dashboard';
import SubscribeModal from './SubscribeModal';

interface CustomDashboardHeaderProps {
  dashboard: Dashboard;
  isEditingTitle: boolean;
  newTitle: string;
  onEditTitle: () => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleSave: () => void;
  onTitleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onAddAnalysis: (type?: ChartType) => void;
  onSubscribe: () => void;
  isSystemDashboard?: boolean;
  hasCharts: boolean;
}

const CustomDashboardHeader: React.FC<CustomDashboardHeaderProps> = ({
  dashboard,
  isEditingTitle,
  newTitle,
  onEditTitle,
  onTitleChange,
  onTitleSave,
  onTitleKeyDown,
  onAddAnalysis,
  onSubscribe,
  isSystemDashboard = false,
  hasCharts,
}) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [displayRelativeTime, setDisplayRelativeTime] = useState(true);

  const handleSubscribeClick = () => {
    setIsSubscribeModalOpen(true);
  };

  const handleCloseSubscribeModal = () => {
    setIsSubscribeModalOpen(false);
  };

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    return `${days} day${days === 1 ? '' : 's'} ago`;
  };

  const toggleTimeFormat = () => {
    setDisplayRelativeTime(!displayRelativeTime);
  };

  const absoluteDateTimeFormat: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  return (
    <>
    <div className="flex items-center justify-between mb-6">
      <div>
        {isEditingTitle ? (
          <div className="flex items-center">
            <Input
              ref={titleInputRef}
              type="text"
              value={newTitle}
              onChange={onTitleChange}
              onBlur={onTitleSave}
              onKeyDown={onTitleKeyDown}
              className="text-xl font-bold h-10"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h1 
                    className="text-2xl font-bold cursor-pointer hover:text-netcore-blue transition-colors mb-1"
                    onClick={isSystemDashboard ? undefined : onEditTitle}
                  >
                    {dashboard.name}
                  </h1>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isSystemDashboard ? "System dashboards cannot be renamed" : "Click to rename your dashboard."}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {!isSystemDashboard && (
              <Edit2 
                className="h-5 w-5 text-gray-500 hover:text-netcore-blue cursor-pointer mb-1" 
                onClick={onEditTitle} 
              />
            )}
          </div>
        )}
        {isSystemDashboard && (
          <p className="text-sm text-muted-foreground">
            System dashboard with analysis examples
          </p>
        )}
      </div>
      
      {isSystemDashboard ? (
        dashboard.id !== 'system-home' && (
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        className="flex items-center justify-center px-[14px] py-[6px] w-[66px] h-8 bg-cobalt-blue hover:bg-blue-800 rounded text-white text-sm font-semibold leading-5 uppercase tracking-wider"
                      >
                        Save
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="rounded-md border shadow-md">
                      <DropdownMenuItem onClick={() => onAddAnalysis('funnel')}>
                        Save chart to dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAddAnalysis('behavior')}>
                        Save table to dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAddAnalysis('rfm')}>
                        Save to My Studio
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save this chart or table to a custom dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      ) : (
        <div className="flex space-x-2">
          {hasCharts && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      className="flex flex-row items-center justify-center h-8 px-[14px] py-[6px] gap-[6px] bg-cobalt-blue text-white rounded-[4px] text-sm font-semibold uppercase tracking-wider hover:bg-blue-800"
                      onClick={() => onAddAnalysis()}
                    >
                      <span>Add Analysis</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add a new analysis to your dashboard.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleSubscribeClick} className="h-8 w-8">
                      <Bell className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Subscribe to this dashboard</p> 
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      )}
    </div>
    <SubscribeModal 
      isOpen={isSubscribeModalOpen} 
      onClose={handleCloseSubscribeModal} 
      dashboardName={dashboard.name}
    />
    </>
  );
};

export default CustomDashboardHeader;
