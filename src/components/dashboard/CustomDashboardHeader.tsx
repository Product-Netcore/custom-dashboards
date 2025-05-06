import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Bell, Save } from 'lucide-react';
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

  const handleSubscribeClick = () => {
    setIsSubscribeModalOpen(true);
  };

  const handleCloseSubscribeModal = () => {
    setIsSubscribeModalOpen(false);
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
        )}
        <p className="text-sm text-muted-foreground">
          {isSystemDashboard 
            ? "System dashboard with analysis examples" 
            : `Last updated: ${dashboard.updatedAt.toLocaleString()}`}
        </p>
      </div>
      
      {isSystemDashboard ? (
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
      ) : (
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex flex-row items-center justify-center h-8 px-[14px] py-[6px] gap-[6px] bg-cobalt-blue text-white rounded-[4px] text-sm font-semibold uppercase tracking-wider hover:bg-blue-800">
                      <Plus className="h-[14px] w-[14px]" />
                      <span>Add Analysis</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onAddAnalysis('funnel')}>
                      Funnel Analysis
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAddAnalysis('rfm')}>
                      RFM Analysis
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAddAnalysis('cohort')}>
                      Cohort Analysis
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAddAnalysis('userPath')}>
                      User Path Analysis
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAddAnalysis('behavior')}>
                      Behavior Analysis
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add charts from Funnel, RFM, Cohort, User Path, or Behavior dashboards.</p>
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
