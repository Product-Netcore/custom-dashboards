import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDashboard } from '@/contexts/DashboardContext';
import { Chart, ChartType } from '@/types/dashboard';
import { useToast } from "@/hooks/use-toast";
import { XIcon } from 'lucide-react'; // Changed from X to XIcon as X is not a direct export
import { cn } from '@/lib/utils';

// Mock data (will be replaced or refined later)
const analysisTypeOptions: { value: ChartType; label: string }[] = [
  { value: 'funnel', label: 'Funnels' },
  { value: 'rfm', label: 'RFM Analysis' },
  { value: 'cohort', label: 'Cohort Analysis' },
  { value: 'segment', label: 'Segment Analysis' },
  { value: 'retention', label: 'Retention Analysis' },
  { value: 'behavior', label: 'Behavior Analysis' },
  { value: 'userPath', label: 'User Path Analysis' },
];

// This interface might not be needed if we directly use Chart from context
// interface MockSavedAnalysis {
//   id: string;
//   name: string;
//   type: ChartType;
// }

// const mockSavedAnalyses: MockSavedAnalysis[] = [
//   { id: 'funnel-01', name: 'Funnel_test_01', type: 'funnel' },
//   { id: 'funnel-02', name: 'Sales Pipeline Q3', type: 'funnel' },
//   { id: 'rfm-01', name: 'High Value Customers', type: 'rfm' },
//   { id: 'segment-01', name: 'Active Users Last 30d', type: 'segment' },
// ];

interface AddAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialAnalysisType: ChartType | null; // The type passed from outside, e.g., when "ADD ANALYSIS" is clicked on empty dashboard
  dashboardId: string | null;
  currentDashboardHasCharts: boolean; // Added prop
}

const AddAnalysisModal: React.FC<AddAnalysisModalProps> = ({ 
  open, 
  onOpenChange, 
  initialAnalysisType, 
  dashboardId, 
  currentDashboardHasCharts // Destructure new prop
}) => {
  // Get necessary functions and data from context first to check hasSavedAnalyses
  const { addChartToExistingDashboard, dashboards } = useDashboard(); 
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get a flat list of all charts across all dashboards to represent "saved analyses"
  const allSavedCharts: Chart[] = useMemo(() => dashboards.flatMap(d => d.charts), [dashboards]);
  const hasSavedAnalyses = allSavedCharts.length > 0;

  // Determine the effective condition for enabling 'existing' mode
  const canAddExisting = hasSavedAnalyses && currentDashboardHasCharts;

  // Initialize mode based on the effective condition
  const [mode, setMode] = useState<'existing' | 'createNew'>(() => 
    canAddExisting ? 'existing' : 'createNew'
  );
  const [selectedInternalAnalysisType, setSelectedInternalAnalysisType] = useState<ChartType | null>(null);
  const [selectedExistingAnalysisId, setSelectedExistingAnalysisId] = useState<string>('');
  const [newAnalysisTitle, setNewAnalysisTitle] = useState('');
  
  useEffect(() => {
    if (open) {
      // Set the mode based on the effective condition when modal opens
      const currentInitialMode = canAddExisting ? 'existing' : 'createNew';
      setMode(currentInitialMode);
      console.log("Modal opened. Global charts exist:", hasSavedAnalyses, "Current dash has charts:", currentDashboardHasCharts, "Can Add Existing:", canAddExisting, "Mode set to:", currentInitialMode);
      
      setSelectedInternalAnalysisType(initialAnalysisType);
      setSelectedExistingAnalysisId('');
      setNewAnalysisTitle('');
    }
  }, [open, initialAnalysisType, hasSavedAnalyses, currentDashboardHasCharts, canAddExisting]);

  const handleProceed = () => {
    if (!selectedInternalAnalysisType && mode === 'existing') { // Type needed only if adding existing
        toast({ title: "Error", description: "Please select a type of analysis.", variant: "destructive" });
        return;
    }
    if (!dashboardId) {
       toast({ title: "Error", description: "Target dashboard ID not found.", variant: "destructive" });
      return;
    }

    if (mode === 'existing') {
      if (!selectedExistingAnalysisId) {
        toast({ title: "Error", description: "Please select an existing analysis.", variant: "destructive" });
        return;
      }
      
      const chartToAdd = allSavedCharts.find(chart => chart.id === selectedExistingAnalysisId);

      if (chartToAdd) {
        addChartToExistingDashboard(dashboardId, chartToAdd);
        toast({ title: "Success", description: `Analysis '${chartToAdd.title}' added to dashboard.` });
      } else {
         toast({ title: "Error", description: "Selected analysis not found.", variant: "destructive" });
      }
      
    } else { // createNew
       const analysisTypeForCreation = selectedInternalAnalysisType || 'funnel'; 
      if (!newAnalysisTitle.trim()) {
        toast({ title: "Error", description: "Please enter a title for the new analysis.", variant: "destructive" });
        return;
      }
      console.log(`Redirecting to create new ${analysisTypeForCreation} named: ${newAnalysisTitle}`);
      navigate(`/create-funnel?name=${encodeURIComponent(newAnalysisTitle)}&type=${analysisTypeForCreation}`);
    }
    onOpenChange(false); 
  };

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
  };
  
  const filteredSavedAnalyses = selectedInternalAnalysisType 
    ? allSavedCharts.filter(chart => chart.type === selectedInternalAnalysisType)
    : [];

  // Disable "Add existing" if the effective condition is false
  const isExistingDisabled = !canAddExisting; 
  const isSelectionDisabled = mode === 'existing' && (!selectedInternalAnalysisType || filteredSavedAnalyses.length === 0);

  console.log("Rendering AddAnalysisModal:", { mode, canAddExisting, isExistingDisabled });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-[422px] p-6 flex flex-col gap-6 bg-white shadow-[0px_5px_10px_rgba(23,23,58,0.05)] rounded-lg"
        onInteractOutside={(e) => e.preventDefault()} // Prevents closing on outside click
      >
        <DialogHeader className="flex flex-row justify-between items-center w-full p-0">
          <DialogTitle className="font-sans font-bold text-base leading-[22px] text-charcoal tracking-[0.42px] text-left">
            Add analysis
          </DialogTitle>
        </DialogHeader>
        
        <RadioGroup 
          value={mode}
          onValueChange={(value) => {
            if (value === 'existing' && isExistingDisabled) return;
            setMode(value as 'existing' | 'createNew');
            setSelectedExistingAnalysisId('');
            setNewAnalysisTitle('');
          }} 
          className="flex flex-row gap-6 w-full"
        >
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild tabIndex={isExistingDisabled ? -1 : undefined}> 
                <div 
                  className={cn(
                    "flex items-center space-x-2", 
                    isExistingDisabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <RadioGroupItem 
                    value="existing" 
                    id="r-existing" 
                    disabled={isExistingDisabled} 
                    aria-disabled={isExistingDisabled}
                  />
                  <Label 
                    htmlFor="r-existing" 
                    className={cn(
                      "font-normal text-sm text-black font-nunito tracking-[0.29px]", 
                      isExistingDisabled && "cursor-not-allowed text-muted-foreground"
                    )}
                  >
                    Add existing
                  </Label>
                </div>
              </TooltipTrigger>
              {/* Conditionally render TooltipContent only when disabled */}
              {isExistingDisabled && ( 
                <TooltipContent>
                   <p>No existing analysis found.</p> 
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="createNew" id="r-createNew" />
            <Label htmlFor="r-createNew" className="font-normal text-sm text-black font-nunito tracking-[0.29px]">Create new</Label>
          </div>
        </RadioGroup>

        {/* Type of analysis dropdown */}
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="typeOfAnalysis" className="font-sans font-semibold text-sm text-charcoal tracking-[0.42px]">
            Type of analysis <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={selectedInternalAnalysisType || undefined} 
            onValueChange={(value) => {
              setSelectedInternalAnalysisType(value as ChartType);
              setSelectedExistingAnalysisId(''); 
            }}
          >
            <SelectTrigger id="typeOfAnalysis" className="bg-[#F8F8F8] border-none h-[42px] px-[15px] py-[11px] rounded-[4px] w-full text-charcoal font-normal text-sm tracking-[0.42px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {analysisTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="font-normal text-sm">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Conditional: Select analysis dropdown OR Add title input */}
        {mode === 'existing' && (
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="selectAnalysis" className={cn("font-sans font-semibold text-sm text-charcoal tracking-[0.42px]", isSelectionDisabled && "text-muted-foreground")}>
              Select analysis <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={selectedExistingAnalysisId} 
              onValueChange={setSelectedExistingAnalysisId}
              disabled={isSelectionDisabled}
            >
              <SelectTrigger id="selectAnalysis" className={cn("bg-[#F8F8F8] border-none h-[42px] px-[15px] py-[11px] rounded-[4px] w-full text-charcoal font-normal text-sm tracking-[0.42px]", isSelectionDisabled && "text-muted-foreground bg-muted")}>
                <SelectValue placeholder={isSelectionDisabled ? "Select type first" : "Select analysis"} />
              </SelectTrigger>
              <SelectContent>
                {filteredSavedAnalyses.length > 0 ? (
                  filteredSavedAnalyses.map((sa) => (
                    <SelectItem key={sa.id} value={sa.id} className="font-normal text-sm">
                      {sa.title}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    {selectedInternalAnalysisType ? "No analyses of this type found." : "Select a type first."}
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {mode === 'createNew' && (
          <div className="flex flex-col gap-2 w-full">
            <Label htmlFor="addTitle" className="font-sans font-semibold text-sm text-charcoal tracking-[0.42px]">
              Add title
            </Label>
            <Input 
              id="addTitle"
              placeholder="Enter title" 
              value={newAnalysisTitle} 
              onChange={(e) => setNewAnalysisTitle(e.target.value)} 
              className="bg-[#F8F8F8] border-none h-[42px] px-[15px] py-[11px] rounded-[4px] w-full text-charcoal font-normal text-sm tracking-[0.42px] placeholder:text-muted-foreground"
            />
          </div>
        )}

        <DialogFooter className="flex flex-row justify-end items-center gap-4 w-full p-0 mt-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="h-9 px-[18px] py-2 border-cobalt-blue text-cobalt-blue hover:bg-cobalt-blue/5 hover:text-cobalt-blue font-semibold text-sm uppercase tracking-[0.42px] rounded-[4px]"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleProceed}
            className="h-9 px-[18px] py-2 bg-cobalt-blue hover:bg-cobalt-blue/90 text-white font-semibold text-sm uppercase tracking-[0.42px] rounded-[4px]"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAnalysisModal; 