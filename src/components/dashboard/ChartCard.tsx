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
import { MoreVertical, GripVertical, Download as DownloadIcon, ArrowRight, RefreshCw, Expand, Minimize, ChevronDown, Trash2, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';

// --- Placeholder Chart Visualizations ---
const PlaceholderChart: React.FC<{ type: ChartType, data: any }> = ({ type, data }) => {
  // Basic styling for placeholder - we might adjust height based on new card structure
  const baseStyle = "min-h-[200px] bg-gray-50 rounded flex items-center justify-center text-gray-500 p-4 text-center"; // Reduced default height slightly
  
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
  const { removeChart, renameChart, toggleChartWidth } = useDashboard();
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(chart.title);
  const titleInputRef = useRef<HTMLInputElement>(null);

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
  const handleRefresh = () => console.log(`Refreshing chart: ${chart.title}`);
  const handleDownload = (format: 'png' | 'csv') => console.log(`Downloading chart ${chart.title} as ${format}`);
  const handleViewAnalysis = () => navigate(`/analysis/${chart.type}/${chart.id}`);

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col bg-white border border-[#DDE2EE] rounded-[5px] shadow-sm group",
        chart.isFullWidth && "md:col-span-2"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex flex-row justify-between items-center p-4 gap-2.5 bg-white w-full">
        <div className="flex flex-row items-center gap-2 flex-1 min-w-0">
          <button 
            {...attributes} 
            {...listeners} 
            className={cn(
              "cursor-grab text-[#6F6F8D] p-1 opacity-0 group-hover:opacity-100 focus:outline-none transition-opacity",
              isDragging && "cursor-grabbing",
              isEditingTitle && "invisible"
             )} 
             aria-label="Drag to reorder chart"
             style={{ width: '24px', height: '24px' }}
          >
            <GripVertical size={18} />
          </button>
          
          <div className="flex-1 min-w-0 relative group/title">
            {isEditingTitle ? (
              <Input
                ref={titleInputRef}
                value={newTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleSave}
                onKeyDown={handleTitleKeyDown}
                className="font-sans font-semibold text-lg leading-6 tracking-[0.42px] text-black h-8 px-1 border-blue-500 ring-1 ring-blue-500"
              />
            ) : (
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h3 
                      className="font-sans font-semibold text-lg leading-6 tracking-[0.42px] text-black truncate cursor-pointer hover:text-blue-600 transition-colors pr-4"
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
            )}
            {!isEditingTitle && (
              <button 
                onClick={handleEditTitle}
                className="absolute top-1/2 -translate-y-1/2 text-gray-400 opacity-0 group-hover/title:opacity-100 hover:text-blue-600 transition-opacity focus:outline-none"
                style={{ right: "8px" }}
                aria-label="Edit chart title"
               >
                 <Edit2 size={14} />
               </button>
             )}
          </div>
        </div>

        <div className="flex flex-row items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                 variant="outline" 
                 className="flex items-center justify-between gap-2.5 bg-[#F8F8F8] rounded-[4px] px-3 py-2 h-9 border-none hover:bg-gray-100 w-[174px]"
              >
                 <span className="flex-1 font-sans font-normal text-sm leading-5 tracking-[0.42px] text-[#6F6F8D] truncate text-left"> 
                   {chart.displayMode.replace('_', ' + ').replace(/\b\w/g, l => l.toUpperCase())} 
                 </span>
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
                <MoreVertical size={18} />
                <span className="sr-only">Chart options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-[180px] bg-white rounded-lg shadow-[0px_4px_16px_rgba(23,23,58,0.12)] py-2 px-0 z-50 font-sans"
            >
              <DropdownMenuItem 
                onClick={handleRefresh} 
                className="flex items-center gap-2 py-2.5 px-4 text-sm font-semibold text-[#17173A] focus:bg-[#F4F8FF] focus:text-[#17173A] cursor-pointer rounded-none tracking-[0.42px]"
              >
                <RefreshCw className="h-4 w-4 text-[#17173A]" />
                <span className="flex-1">Refresh</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleToggleWidth}
                className="flex items-center gap-2 py-2.5 px-4 text-sm font-semibold text-[#17173A] focus:bg-[#F4F8FF] focus:text-[#17173A] cursor-pointer rounded-none tracking-[0.42px]"
              >
                {chart.isFullWidth ? (
                  <Minimize className="h-4 w-4 text-[#17173A]" /> 
                ) : (
                  <Expand className="h-4 w-4 text-[#17173A]" /> 
                )}
                <span className="flex-1">{chart.isFullWidth ? 'Collapse Width' : 'Expand Width'}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#DDE2EE] my-1 h-[1px]"/>
              <DropdownMenuItem 
                className="flex items-center gap-2 py-2.5 px-4 text-sm font-semibold text-[#F05C5C] focus:bg-red-50 focus:text-[#F05C5C] cursor-pointer rounded-none tracking-[0.42px]" 
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 text-[#F05C5C]" />
                <span className="flex-1">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {!chart.isBodyHidden && <hr className="border-t border-[#DDE2EE] w-full" />}

      {!chart.isBodyHidden && (
        <div className="flex-1 w-full bg-white">
          <PlaceholderChart type={chart.type} data={chart.data} />
        </div>
      )}

      <hr className="border-t border-[#DDE2EE] w-full" />

      <div className="flex flex-row justify-between items-center p-4 gap-2.5 bg-white w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="link" className="flex items-center gap-2 p-0 h-auto font-sans font-normal text-sm leading-5 tracking-[0.42px] text-[#6F6F8D] hover:no-underline">
              <span>Download</span>
              <DownloadIcon size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="font-sans">
            <DropdownMenuItem onClick={() => handleDownload('png')}>Export as PNG</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload('csv')}>Export as CSV</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="link" className="flex items-center gap-2 p-0 h-auto font-sans font-normal text-sm leading-5 tracking-[0.42px] text-[#143F93] hover:no-underline hover:text-blue-700" onClick={handleViewAnalysis}>
          <span>See analysis</span>
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default ChartCard;
