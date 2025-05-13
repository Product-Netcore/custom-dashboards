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
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MoreVertical, GripVertical, Download as DownloadIcon, ArrowRight, RefreshCw, Expand, Minimize, ChevronDown, Trash2, Edit2, Copy, PlusSquare, FileImage, FileType } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import AddToAnotherDashboardModal from './AddToAnotherDashboardModal';
import { getChartViewOptions, getDefaultViewLabel, ViewOption } from '@/config/chartViewOptions';

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
  
  // State for the currently selected view label in the dropdown
  const [currentViewLabel, setCurrentViewLabel] = useState<string>(
    () => getDefaultViewLabel(chart.type, chart.displayMode)
  );
  // State for the table display toggle (% or #)
  const [activeTableToggle, setActiveTableToggle] = useState<'#' | '%'>(chart.tableDisplayMode || '#');

  // Cooldown state
  const [cooldownEndTime, setCooldownEndTime] = useState<number | null>(null);
  const [isCoolingDown, setIsCoolingDown] = useState<boolean>(false);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null); // Ref to store timeout ID

  // Update currentViewLabel if chart.type or chart.displayMode changes from props
  useEffect(() => {
    setCurrentViewLabel(getDefaultViewLabel(chart.type, chart.displayMode));
  }, [chart.type, chart.displayMode]);

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

  // Updated Refresh Handler
  const handleChartRefresh = () => {
    if (isCoolingDown) return; // Prevent action if cooling down

    console.log(`Refreshing chart: ${chart.title}`);
    // --- Trigger actual data refresh logic here ---

    const endTime = Date.now() + 15 * 60 * 1000; // 15 minutes
    setCooldownEndTime(endTime);
    setIsCoolingDown(true);

    // Clear existing timer if any (safety measure)
    if (cooldownTimerRef.current) {
      clearTimeout(cooldownTimerRef.current);
    }

    // Set timer to end cooldown
    cooldownTimerRef.current = setTimeout(() => {
      setIsCoolingDown(false);
      setCooldownEndTime(null);
      cooldownTimerRef.current = null;
    }, 15 * 60 * 1000);
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
    };
  }, []);

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
    const secondsAgo = Math.round((now.getTime() - date.getTime()) / 1000);

    if (secondsAgo < 60) {
      return "0 minutes ago";
    }

    let minutes = Math.ceil(secondsAgo / 60);
    minutes = Math.min(minutes, 60); // Cap at 60 minutes

    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
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
  const menuItemBaseClass = "flex items-center justify-between w-full h-[50px] px-4 py-3.5 text-sm font-semibold tracking-[0.42px] cursor-pointer focus:outline-none rounded-none relative text-[#6F6F8D]";
  // Hover state with left border: focus:bg-menu-item-hover-bg focus:border-l-4 focus:border-cobalt-blue focus:pl-3 (adjust pl-3 if needed, or use pseudo-element)
  // For simplicity, we will use focus:pl-3 for the border effect space.
  const menuItemHoverClass = "hover:text-[#17173A] focus:text-[#17173A] focus:bg-menu-item-hover-bg focus:border-l-[3px] focus:border-cobalt-blue focus:pl-[13px]"; // pl is 16px(px-4) - 3px border = 13px
  const iconClass = "h-[18px] w-[18px]";
  const subMenuItemClass = "flex items-center justify-between w-full h-auto px-3 py-2 text-sm font-semibold tracking-[0.42px] cursor-pointer focus:outline-none rounded-none relative text-[#6F6F8D]"; // Adjusted for sub-menu

  // Get dynamic view options
  const viewOptions = getChartViewOptions(chart.type);

  // Handler for selecting a new view option
  const handleViewOptionSelect = (option: ViewOption) => {
    setCurrentViewLabel(option.label);
    // If the new view is not a table view, we could reset the toggle, or hide it.
    // For now, visibility is handled by isCurrentViewTable.
    console.log(`View selected: ${option.label}`); 
  };

  // Determine if the currently selected view is a table view
  const currentSelectedViewOption = viewOptions.find(opt => opt.label === currentViewLabel);
  const isCurrentViewTable = currentSelectedViewOption?.isTableView === true;

  const handleTableToggle = (mode: '#' | '%') => {
    setActiveTableToggle(mode);
    // Later: call context to persist this change: updateChartTableDisplayMode(dashboardId, chart.id, mode);
    console.log(`Table view toggled to: ${mode}`);
  };

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
        <div className="flex flex-row justify-between items-start pt-4 pr-4 pb-4 pl-2 gap-2.5 bg-white w-full">
          <div className={cn("flex items-start gap-2 min-w-0", isEditingTitle ? "flex-1" : "flex-initial")}>
            {/* Always render button, use visibility classes */} 
            <button 
              {...attributes} 
              {...listeners} 
              className={cn(
                "cursor-grab text-[#6F6F8D] focus:outline-none mt-1", // Removed p-1
                "invisible group-hover:visible", // Add visibility classes
                isDragging && "cursor-grabbing",
                isEditingTitle && "invisible" // Keep invisible if editing title
               )} 
               aria-label="Drag to reorder chart"
               style={{ width: '16px', height: '24px' }} // Reduced width
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
                            className="font-sans font-semibold text-base leading-6 tracking-[0.42px] text-black truncate cursor-pointer hover:text-blue-600 transition-colors min-w-0"
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
                <div className="mt-1 text-sm text-gray-500 flex items-center">
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
                   <span className="flex-1 font-sans font-normal text-sm leading-5 tracking-[0.42px] text-[#6F6F8D] truncate text-left">
                     {currentViewLabel}
                   </span>
                   <ChevronDown size={16} className="text-[#6F6F8D] flex-shrink-0" />
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-auto min-w-[174px] bg-white border-menu-item-border shadow-lg rounded-md p-0">
                {viewOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.label}
                    className={cn(
                        menuItemBaseClass, 
                        menuItemHoverClass,
                        "h-auto py-2.5"
                    )}
                    onClick={() => handleViewOptionSelect(option)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                  className={cn(
                    "h-8 w-8 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                    "transition-opacity duration-150 ease-in-out"
                  )}
                  aria-label="Chart options"
                >
                  <MoreVertical size={18} />
                      </Button>
                    </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-[274px] bg-white border-menu-item-border shadow-lg rounded-md p-0"
              >
                <DropdownMenuItem 
                  className={cn(menuItemBaseClass, menuItemHoverClass)}
                  onClick={handleToggleWidth}
                >
                  <span>{chart.isFullWidth ? "Minimize" : "Expand"}</span> 
                  {chart.isFullWidth ? <Minimize className={iconClass} /> : <Expand className={iconClass} />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={cn(menuItemBaseClass, menuItemHoverClass)}
                  onClick={handleDuplicateChart}
                >
                  <span>Duplicate</span>
                  <Copy className={iconClass} />
                </DropdownMenuItem>
                
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className={cn(menuItemBaseClass, menuItemHoverClass)}>
                    <span>Download</span>
                    <DownloadIcon className={iconClass} />
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-[220px] bg-white border-menu-item-border shadow-lg rounded-md p-0">
                    <DropdownMenuItem 
                      className={cn(subMenuItemClass, menuItemHoverClass)}
                      onClick={() => handleDownload('png')}
                    >
                      <span>Download as PNG</span>
                      <FileImage className={iconClass} />
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className={cn(subMenuItemClass, menuItemHoverClass)}
                      onClick={() => handleDownload('csv')}
                    >
                      <span>Download as CSV</span>
                      <FileType className={iconClass} />
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuItem 
                  className={cn(menuItemBaseClass, menuItemHoverClass)}
                  onClick={handleAddToAnotherDashboard}
                >
                  <span>Add to dashboard</span>
                  <PlusSquare className={iconClass} />
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-menu-item-border my-0" />
                <DropdownMenuItem 
                  className={cn(menuItemBaseClass, menuItemHoverClass, "text-red-600 focus:text-red-700 focus:bg-red-50 focus:border-red-600")}
                  onClick={handleDelete}
                >
                  <span>Remove from dashboard</span>
                  <Trash2 className={iconClass} />
                </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
          </div>
        </div>

        <div 
          className={cn(
            "border-t border-gray-200 relative", // Removed p-4
            chart.displayMode === 'table' && "min-h-[300px]" 
          )}
        >
          {isCurrentViewTable && (
            <div className="absolute top-4 right-4 z-10 flex border border-gray-300 rounded">
              <button 
                onClick={() => handleTableToggle('%')}
                className={`px-6 py-2 text-sm ${activeTableToggle === '%' ? 'bg-netcore-blue text-white' : 'bg-white text-gray-700'} rounded-l`}
              >
                %
              </button>
              <button 
                onClick={() => handleTableToggle('#')}
                className={`px-6 py-2 text-sm ${activeTableToggle === '#' ? 'bg-netcore-blue text-white' : 'bg-white text-gray-700'} rounded-r`}
              >
                #
              </button>
            </div>
          )}
          <PlaceholderChart type={chart.type} data={chart.data} />
        </div>

        {/* Footer with more details */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                          <p 
                              className="text-sm text-gray-400 cursor-pointer hover:text-netcore-blue"
                              onClick={toggleChartTimeFormat}
                  >
                              Last refreshed: {
                                  displayChartRelativeTime 
                                  ? formatRelativeTime(chart.updatedAt) 
                                  : chart.updatedAt.toLocaleString([], absoluteDateTimeFormat).replace(',', ';')
                              }
                          </p>
                </TooltipTrigger>
                      <TooltipContent side="top">
                          <p>{chart.updatedAt.toLocaleString([], absoluteDateTimeFormat).replace(',', ';')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

              {/* Refresh Button with Cooldown Tooltip */}
              <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                    {/* Need to wrap disabled button in a span for tooltip to work reliably */}
                    <span tabIndex={isCoolingDown ? 0 : -1}> 
                  <Button 
                    variant="ghost" 
                    size="icon" 
                        className="h-7 w-7 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed" 
                        onClick={handleChartRefresh}
                        disabled={isCoolingDown}
                        aria-disabled={isCoolingDown} // For accessibility
                  >
                        <RefreshCw size={16} />
                        <span className="sr-only">Refresh chart</span>
                  </Button>
                    </span>
                </TooltipTrigger>
                  {isCoolingDown && cooldownEndTime && (
                    <TooltipContent side="top">
                      {
                        (() => {
                          const remainingMs = cooldownEndTime - Date.now();
                          const remainingMinutes = Math.max(0, Math.ceil(remainingMs / (1000 * 60)));
                          return (
                            <p>
                              Refresh available after {remainingMinutes} min{remainingMinutes === 1 ? '' : 's'}
                            </p>
                          );
                        })()
                      }
                </TooltipContent>
                  )}
              </Tooltip>
            </TooltipProvider>
          </div>
            <Button variant="link" size="sm" className="text-sm text-gray-500 hover:text-gray-700 p-0 h-auto" onClick={handleViewAnalysis}>
                View analysis <ArrowRight size={12} className="ml-1" />
            </Button>
        </div>
          </div>
      {isAddToAnotherOpen && (
          <AddToAnotherDashboardModal
            isOpen={isAddToAnotherOpen}
            onClose={() => setIsAddToAnotherOpen(false)}
            chartToAdd={chart}
            currentDashboardId={dashboardId}
          />
      )}
    </>
  );
};

export default ChartCard;
