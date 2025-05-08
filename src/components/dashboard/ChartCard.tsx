import React, { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Chart, ChartType } from '@/types/dashboard';
import { useDashboard } from '@/contexts/DashboardContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MoreVertical, GripVertical, Download as DownloadIcon, ArrowRight, RefreshCw, Expand, Minimize, ChevronDown, Trash2, Edit2, Copy, PlusSquare, FileImage, FileType } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import AddToAnotherDashboardModal from './AddToAnotherDashboardModal';

// --- Placeholder Chart Visualizations ---
const PlaceholderChart: React.FC<{ type: ChartType, data: any }> = ({ type, data }) => {
  // Increase min-height for taller widget
  const baseStyle = "min-h-[300px] bg-gray-50 rounded flex items-center justify-center text-gray-500 p-4 text-center"; 
  
  switch (type) {
    case 'funnel':
      return <div className={baseStyle}>Mock Funnel Chart<br/>{data?.labels?.join(' -> ')}</div>;
    case 'rfm':
      return <div className={baseStyle}>Mock RFM Heatmap</div>;
    case 'cohort':
      return <div className={baseStyle}>Mock Cohort Grid</div>;
    case 'userPath':
      return <div className={baseStyle}>Mock User Path Flow</div>;
    case 'behavior':
      return <div className={baseStyle}>Mock Behavior Chart<br/>({data?.labels?.join(', ')})</div>;
    default:
      return <div className={baseStyle}>Chart Type: {type}</div>;
  }
};

// --- Chart Card Component ---
interface ChartCardProps {
  chart: Chart;
  dashboardId: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ chart, dashboardId }) => {
  const { removeChart, renameChart, toggleChartWidth, duplicateChart } = useDashboard();
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(chart.title);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [displayChartRelativeTime, setDisplayChartRelativeTime] = useState(true); // For chart card footer
  const [isAddToAnotherOpen, setIsAddToAnotherOpen] = useState(false);

  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging 
  } = useSortable({ id: chart.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1, // Higher z-index for dragging
    opacity: isDragging ? 0.8 : 1,
  };

  const handleDelete = () => removeChart(dashboardId, chart.id);
  const handleChartRefresh = () => console.log(`Refreshing chart: ${chart.title}`);
  const handleDownload = (format: 'png' | 'csv') => console.log(`Downloading chart ${chart.title} as ${format}`);
  const handleViewAnalysis = () => navigate(`/analysis/${chart.type}/${chart.id}`);
  const handleDuplicateChart = () => duplicateChart(dashboardId, chart.id);
  const handleAddToAnotherDashboard = () => setIsAddToAnotherOpen(true);

  // Title Editing Handlers
  const handleEditTitle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card drag/other actions
    setNewTitle(chart.title);
    setIsEditingTitle(true);
    // Focus and select text slightly after rendering
    setTimeout(() => titleInputRef.current?.select(), 10);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleTitleSave = () => {
    if (newTitle.trim() && newTitle.trim() !== chart.title) {
      renameChart(dashboardId, chart.id, newTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setNewTitle(chart.title); // Revert changes
      setIsEditingTitle(false);
    }
  };

  // Effect to update local title if chart prop changes (e.g., after renaming elsewhere)
  useEffect(() => {
    if (!isEditingTitle) {
        setNewTitle(chart.title);
    }
  }, [chart.title, isEditingTitle]);

  // Determine if title needs truncation (simple length check for example)
  const isTruncated = chart.title.length > 25; // Adjust based on visual needs

  // Handler to toggle chart width using context function
  const handleToggleWidth = () => {
    toggleChartWidth(dashboardId, chart.id);
  };

  // --- Time formatting for chart card footer ---
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

  const toggleChartTimeFormat = () => {
    setDisplayChartRelativeTime(!displayChartRelativeTime);
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
  // --- End time formatting ---

  // Base classes for menu items
  const menuItemBaseClass = "flex items-center justify-between w-full h-[50px] px-4 py-3.5 text-sm font-semibold tracking-[0.42px] cursor-pointer focus:outline-none rounded-none relative";
  // Hover state with left border: focus:bg-menu-item-hover-bg focus:border-l-4 focus:border-cobalt-blue focus:pl-3 (adjust pl-3 if needed, or use pseudo-element)
  // For simplicity, we will use focus:pl-3 for the border effect space.
  const menuItemHoverClass = "focus:bg-menu-item-hover-bg focus:text-netcore-chart-dropdown-text focus:border-l-[3px] focus:border-cobalt-blue focus:pl-[13px]"; // pl is 16px(px-4) - 3px border = 13px
  const iconClass = "h-[18px] w-[18px]";

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "flex flex-col bg-white border border-menu-item-border rounded-[5px] shadow-sm group",
          chart.isFullWidth && "md:col-span-2"
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex flex-row justify-between items-start p-4 gap-2.5 bg-white w-full">
          <div className={cn("flex items-start gap-2 min-w-0", isEditingTitle ? "flex-1" : "flex-initial")}>
            <button 
              {...attributes} 
              {...listeners} 
              className={cn(
                "cursor-grab text-[#6F6F8D] p-1 opacity-0 group-hover:opacity-100 focus:outline-none transition-opacity mt-1",
                isDragging && "cursor-grabbing",
                isEditingTitle && "invisible"
               )} 
               aria-label="Drag to reorder chart"
               style={{ width: '24px', height: '24px' }}
            >
              <GripVertical size={18} />
            </button>
            
            <div className="flex flex-col">
              <div className={cn(
                "flex items-center gap-1.5 min-w-0 group/title",
                isEditingTitle ? "flex-1" : "flex-initial"
              )}>
                {isEditingTitle ? (
                  <Input
                    ref={titleInputRef}
                    value={newTitle}
                    onChange={handleTitleChange}
                    onBlur={handleTitleSave}
                    onKeyDown={handleTitleKeyDown}
                    className="font-sans font-semibold text-lg leading-6 tracking-[0.42px] text-black h-8 px-1 border-blue-500 ring-1 ring-blue-500 flex-1"
                  />
                ) : (
                  <>
                    <TooltipProvider delayDuration={150}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <h3 
                            className="font-sans font-semibold text-lg leading-6 tracking-[0.42px] text-black truncate cursor-pointer hover:text-blue-600 transition-colors min-w-0"
                            onClick={handleEditTitle} 
                            title={isTruncated ? chart.title : undefined}
                          >
                            {chart.title}
                          </h3>
                        </TooltipTrigger>
                        {isTruncated && (
                          <TooltipContent>
                            <p>{chart.title}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                    <button 
                      onClick={handleEditTitle}
                      className="text-gray-400 opacity-0 group-hover/title:opacity-100 hover:text-blue-600 transition-opacity focus:outline-none p-1"
                      aria-label="Edit chart title"
                     >
                       <Edit2 size={14} />
                     </button>
                  </>
                )}
              </div>

              {!isEditingTitle && (
                <div className="mt-1 text-xs text-gray-500 flex items-center">
                  <span>Last 7 days</span>
                  <span className="mx-1.5 text-gray-400">•</span>
                  <span>All contacts</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center justify-between gap-2.5 bg-[#F8F8F8] rounded-[4px] px-3 py-2 h-9 border-none hover:bg-gray-100 w-[174px]">
                   <span className="flex-1 font-sans font-normal text-sm leading-5 tracking-[0.42px] text-[#6F6F8D] truncate text-left">{chart.displayMode.replace('_', ' + ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                   <ChevronDown size={16} className="text-[#6F6F8D] flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-auto min-w-[174px]">
                <DropdownMenuItem disabled className="truncate">Chart</DropdownMenuItem>
                <DropdownMenuItem disabled className="truncate">KPI</DropdownMenuItem>
                <DropdownMenuItem disabled className="truncate">Chart + KPI</DropdownMenuItem>
                <DropdownMenuItem disabled className="truncate">Table view</DropdownMenuItem>
                <DropdownMenuItem disabled className="truncate">Transposed table view</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-[#6F6F8D] hover:bg-gray-100 rounded">
                  <MoreVertical size={18} /><span className="sr-only">Chart options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-[280px] bg-white rounded-[4px] border border-menu-item-border shadow-[0px_5px_12px_rgba(23,23,58,0.07)] py-0 font-sans"
              >
                <DropdownMenuItem onClick={handleToggleWidth} className={cn(menuItemBaseClass, menuItemHoverClass, "text-netcore-chart-dropdown-text")}>
                  <span>{chart.isFullWidth ? 'Collapse' : 'Expand'}</span>{chart.isFullWidth ? <Minimize className={cn(iconClass, "text-netcore-chart-dropdown-text")} /> : <Expand className={cn(iconClass, "text-netcore-chart-dropdown-text")} />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicateChart} className={cn(menuItemBaseClass, menuItemHoverClass, "text-netcore-chart-dropdown-text")}>
                  <span>Duplicate</span><Copy className={cn(iconClass, "text-netcore-chart-dropdown-text")} />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('png')} className={cn(menuItemBaseClass, menuItemHoverClass, "text-netcore-chart-dropdown-text")}>
                  <span>Download as PNG</span><FileImage className={cn(iconClass, "text-netcore-chart-dropdown-text")} />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload('csv')} className={cn(menuItemBaseClass, menuItemHoverClass, "text-netcore-chart-dropdown-text")}>
                  <span>Download as CSV</span><FileType className={cn(iconClass, "text-netcore-chart-dropdown-text")} />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAddToAnotherDashboard} className={cn(menuItemBaseClass, menuItemHoverClass, "text-netcore-chart-dropdown-text")}>
                  <span>Add to another dashboard</span><PlusSquare className={cn(iconClass, "text-netcore-chart-dropdown-text")} />
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className={cn(menuItemBaseClass, menuItemHoverClass, "text-[#F05C5C] focus:text-[#F05C5C]")}>
                  <span>Remove from dashboard</span><Trash2 className={cn(iconClass, "text-[#F05C5C]")} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {!chart.isBodyHidden && <hr className="border-t border-menu-item-border w-full" />}

        {!chart.isBodyHidden && (
          <div className="flex-1 w-full bg-white">
            <PlaceholderChart type={chart.type} data={chart.data} />
          </div>
        )}

        <hr className="border-t border-menu-item-border w-full" />

        <div className="flex flex-row justify-between items-center p-4 gap-2.5 bg-white w-full h-[56px]"> {/* Ensure consistent footer height */}
          {/* Last Refreshed section - visible on hover */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p 
                    className="text-sm text-[#6F6F8D] cursor-pointer hover:text-netcore-blue transition-colors"
                    onClick={toggleChartTimeFormat}
                  >
                    Last refreshed: {
                      displayChartRelativeTime 
                        ? formatRelativeTime(chart.updatedAt) 
                        : chart.updatedAt.toLocaleString([], absoluteDateTimeFormat).replace(',', ';')
                    }
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{chart.updatedAt.toLocaleString([], absoluteDateTimeFormat).replace(',', ';')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-[#6F6F8D] hover:bg-gray-100" onClick={handleChartRefresh}>
              <RefreshCw size={16} />
              <span className="sr-only">Refresh chart</span>
            </Button>
          </div>

          <Button variant="link" className="flex items-center gap-2 p-0 h-auto font-sans font-normal text-sm leading-5 tracking-[0.42px] text-[#143F93] hover:no-underline hover:text-blue-700" onClick={handleViewAnalysis}>
            <span>View analysis</span>
            <ArrowRight size={18} />
          </Button>
        </div>
      </div>

      {/* Render the modal */}
      <AddToAnotherDashboardModal 
        isOpen={isAddToAnotherOpen} 
        onClose={() => setIsAddToAnotherOpen(false)} 
        chartToAdd={chart} 
        currentDashboardId={dashboardId} 
      />
    </>
  );
};

export default ChartCard;
