import React, { useState, useEffect } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { Chart, Dashboard } from '@/types/dashboard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from "@/hooks/use-toast";
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddToAnotherDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  chartToAdd: Chart | null;
  currentDashboardId: string | null;
}

const AddToAnotherDashboardModal: React.FC<AddToAnotherDashboardModalProps> = ({
  isOpen,
  onClose,
  chartToAdd,
  currentDashboardId
}) => {
  const { dashboards, addChartToExistingDashboard, createDashboardWithChart } = useDashboard();
  const [selectedOption, setSelectedOption] = useState<"existing" | "createNew">("existing");
  const [selectedDashboardId, setSelectedDashboardId] = useState<string | null>(null);
  const [newDashboardName, setNewDashboardName] = useState("");
  const { toast } = useToast();

  const otherDashboards = dashboards.filter(d => d.id !== currentDashboardId && d.type === 'custom');

  useEffect(() => {
    if (otherDashboards.length === 0) {
      setSelectedOption("createNew");
      setSelectedDashboardId(null);
    } else {
      setSelectedOption("existing");
      if (!selectedDashboardId && otherDashboards.length > 0) {
        setSelectedDashboardId(otherDashboards[0].id);
      }
    }
  }, [isOpen, otherDashboards.length]);

  useEffect(() => {
    if (otherDashboards.length > 0 && selectedOption === "createNew") {
      if (!selectedDashboardId) {
          setSelectedDashboardId(otherDashboards[0].id);
      }
    } else if (otherDashboards.length === 0) {
        setSelectedOption("createNew");
        setSelectedDashboardId(null);
    }
  }, [dashboards, currentDashboardId]);
  
  const handleAdd = () => {
    if (!chartToAdd) return;

    if (selectedOption === "existing") {
      if (!selectedDashboardId) {
        toast({ title: "Error", description: "Please select an existing dashboard.", variant: "destructive" });
        return;
      }
      addChartToExistingDashboard(selectedDashboardId, chartToAdd);
      toast({ title: "Success", description: `Chart "${chartToAdd.title}" added to dashboard.` });
    } else { 
      createDashboardWithChart(newDashboardName || undefined, chartToAdd);
      toast({ title: "Success", description: `Chart "${chartToAdd.title}" added to new dashboard ${newDashboardName || ''}.` });
    }
    onClose();
  };

  if (!chartToAdd) return null;

  const inputSelectClasses = "bg-[#F8F8F8] border-none h-[42px] mt-2 focus-visible:ring-cobalt-blue";
  const labelClasses = "font-semibold text-sm text-charcoal tracking-[0.42px] mb-2 block";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[422px] bg-white p-6 rounded-lg shadow-lg flex flex-col gap-6">
        <div className="flex flex-row justify-between items-center">
          <DialogTitle className="font-bold text-base leading-[22px] text-charcoal tracking-[0.42px]">
            Add to another dashboard
          </DialogTitle>
        </div>

        <RadioGroup 
          value={selectedOption} 
          onValueChange={(value) => setSelectedOption(value as "existing" | "createNew")} 
          className="flex flex-row items-center gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="existing" id="r-existing" disabled={otherDashboards.length === 0} />
            {otherDashboards.length === 0 ? (
                <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Label htmlFor="r-existing" className={cn("font-normal text-sm text-gray-400 cursor-not-allowed")}>
                                Existing dashboard
                            </Label>
                        </TooltipTrigger>
                        <TooltipContent><p>No other existing dashboards available.</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ) : (
                 <Label htmlFor="r-existing" className={cn("font-normal text-sm")}>
                    Existing dashboard
                 </Label>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="createNew" id="r-createNew" />
            <Label htmlFor="r-createNew" className="font-normal text-sm">Create new</Label>
          </div>
        </RadioGroup>

        <div className="min-h-[70px]">
          {selectedOption === "existing" ? (
            <div>
              <Label htmlFor="select-dashboard" className={labelClasses}>
                Select existing dashboard <span className="text-red-500">*</span>
              </Label>
              <Select 
                onValueChange={setSelectedDashboardId} 
                value={selectedDashboardId || undefined} 
                disabled={otherDashboards.length === 0}
              >
                <SelectTrigger id="select-dashboard" className={cn(inputSelectClasses, "justify-between")}>
                  <SelectValue placeholder="Enter" />
                </SelectTrigger>
                <SelectContent>
                  {otherDashboards.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <Label htmlFor="new-dashboard-name" className={labelClasses}>
                New dashboard name
              </Label>
              <Input 
                id="new-dashboard-name"
                placeholder="New dashboard name"
                value={newDashboardName}
                onChange={(e) => setNewDashboardName(e.target.value)}
                className={inputSelectClasses}
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-row justify-end gap-4">
          <Button 
            variant="outline"
            onClick={onClose}
            className="h-9 px-[18px] py-2 uppercase border-cobalt-blue border-[1.5px] text-cobalt-blue hover:bg-blue-50 hover:text-cobalt-blue"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAdd}
            className="h-9 px-[18px] py-2 uppercase bg-cobalt-blue text-white hover:bg-blue-800"
          >
            Proceed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToAnotherDashboardModal; 