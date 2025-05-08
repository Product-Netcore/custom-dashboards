import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Plus, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useDashboard } from '@/contexts/DashboardContext';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { Chart } from '@/types/dashboard';

// Placeholder component - needs actual implementation for steps, filters, etc.
const CreateFunnelPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addNewChartToDashboard } = useDashboard();
  const { toast } = useToast();

  // --- Mode Detection --- 
  const analysisId = useMemo(() => searchParams.get('analysisId'), [searchParams]);
  const originDashboardId = useMemo(() => searchParams.get('originDashboardId'), [searchParams]);
  const isEditing = !!analysisId;
  // ------------------

  const initialName = useMemo(() => searchParams.get('name') || (isEditing ? 'Loading...' : 'Untitled funnel'), [searchParams, isEditing]);
  const [funnelName, setFunnelName] = React.useState(initialName);
  const [isEditingName, setIsEditingName] = React.useState(!searchParams.get('name') && !isEditing);
  
  // TODO: If isEditing, fetch analysis data based on analysisId useEffect(() => { ... }, [analysisId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFunnelName(e.target.value);
  };

  const handleNameBlur = () => {
    setIsEditingName(false);
    // Add logic to save/update funnel name if needed
  };

  // --- Placeholder Handlers --- 
  const handleSaveToDashboardCreate = () => { 
    console.log("Action: Save to Dashboard (New)", { originDashboardId, funnelName });
    if (!originDashboardId) {
      toast({ title: "Error", description: "Originating dashboard ID missing.", variant: "destructive" });
      return;
    }
    const finalFunnelName = funnelName.trim() || "Untitled";

    // Construct chart data
    // Explicitly define the type for funnelChartData using the Chart interface
    // Omitting id, createdAt, updatedAt as these should be handled by the context/backend
    const funnelChartData: Omit<Chart, 'id' | 'createdAt' | 'updatedAt'> = {
      title: finalFunnelName,
      description: "User-created funnel analysis",
      type: 'funnel' as const,
      displayMode: 'chart' as const, 
      isFullWidth: false,
      tableDisplayMode: '#', // Default toggle state
      data: { 
        labels: ['Step A', 'Step B', 'Step C'], 
        values: [500, 350, 150] 
      },
    };

    // Call the actual context function
    addNewChartToDashboard(originDashboardId, funnelChartData);
    toast({ title: "Success", description: `Chart '${finalFunnelName}' added to dashboard.`});
    navigate('/');
  };
  const handleSaveAsNewCreate = () => { 
    console.log("Action: Save as New (New)", { funnelName });
    toast({ title: "Success (Placeholder)", description: `Chart '${funnelName}' saved globally.`});
    navigate('/');
  };
  const handleUpdateExisting = () => { 
    console.log("Action: Update Existing", { analysisId, funnelName }); 
    toast({ title: "Success (Placeholder)", description: `Chart '${funnelName}' updated.`});
    navigate('/');
  };
  const handleSaveAsNewEdit = () => { 
    console.log("Action: Save as New (Edit)", { funnelName }); 
    toast({ title: "Success (Placeholder)", description: `New chart '${funnelName}' saved globally from edit.`});
    navigate('/');
  };
  const handleTriggerSaveToDashboardModal = () => { 
    console.log("Action: Trigger Save to Dashboard Modal (Edit)", { funnelName }); 
    toast({ title: "Info", description: "'Save to dashboard' modal trigger not fully implemented.", variant: "default" });
  };
  // --------------------------

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <div className="flex items-center gap-2">
          {isEditingName ? (
            <Input 
              value={funnelName} 
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleNameBlur()}
              className="text-xl font-semibold h-9"
              autoFocus
            />
          ) : (
            <h1 className="text-xl font-semibold cursor-pointer" onClick={() => setIsEditingName(true)}>{funnelName}</h1>
          )}
          <span className="text-xs text-gray-500">Created on {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              className={cn(
                "flex flex-row justify-center items-center",
                "px-[18px] py-[8px] gap-[6px]",
                "bg-cobalt-blue hover:bg-cobalt-blue/90",
                "rounded-[4px]",
                "text-white font-semibold text-sm leading-5 uppercase tracking-[0.42px]"
              )}
            >
              <span>Save</span>
              <ChevronDown className="h-[14px] w-[14px]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isEditing ? (
              <>
                <DropdownMenuItem onClick={handleUpdateExisting}>
                  Update existing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSaveAsNewEdit}>
                  Save as new
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTriggerSaveToDashboardModal}>
                  Save to dashboard
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={handleSaveToDashboardCreate} disabled={!originDashboardId}>
                  Save to dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSaveAsNewCreate}>
                  Save as new
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filters Section - Placeholder */}
      <div className="bg-white p-4 rounded-md shadow-sm border mb-6 flex space-x-4">
        <Select defaultValue="7days">
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
         <Select defaultValue="all">
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All contacts" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All contacts</SelectItem>
          </SelectContent>
        </Select>
         <Select defaultValue="duration">
          <SelectTrigger className="w-[240px]"><SelectValue placeholder="Conversion window: Same as duration" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="duration">Conversion window: Same as duration</SelectItem>
          </SelectContent>
        </Select>
         <Select defaultValue="first">
          <SelectTrigger className="w-[240px]"><SelectValue placeholder="Conversion rate: Relative to first step" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="first">Conversion rate: Relative to first step</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Steps Section - Placeholder */}
      <div className="bg-white p-4 rounded-md shadow-sm border mb-6">
        <h2 className="text-sm font-medium mb-4">Steps <span className="text-xs text-gray-400 ml-1">0/20</span></h2>
        <div className="flex items-center space-x-2">
           <div className="border-2 border-blue-600 rounded p-3 flex items-center justify-center min-w-[80px]">
             <span className="text-sm font-medium text-blue-700">Step 1</span>
           </div>
           <Button variant="outline" size="icon" className="border-dashed text-gray-400">
             <Plus className="h-4 w-4" />
           </Button>
        </div>
      </div>

      {/* Empty State Section - Placeholder */}
      <div className="bg-white p-12 rounded-md shadow-sm border flex flex-col items-center text-center">
        {/* Placeholder for image */}
        <div className="w-40 h-32 bg-gray-200 mb-6 rounded flex items-center justify-center text-gray-400">
          Image Placeholder
        </div> 
        <h2 className="text-lg font-semibold mb-2">You have not added any steps till now</h2>
        <Button variant="link" className="text-netcore-blue">How to add funnel steps?</Button>
      </div>
      
      {/* Loading Indicator - Placeholder */}
      <div className="fixed bottom-6 right-6 bg-gray-700 text-white text-sm px-4 py-2 rounded-md shadow-lg flex items-center">
         <Info className="h-4 w-4 mr-2" />
         Contact loading in progress...
      </div>
    </div>
  );
};

export default CreateFunnelPage; 