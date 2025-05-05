import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDashboard } from '@/contexts/DashboardContext';
import { mockFunnelTemplates } from '@/data/mockFunnels';
import { ChartType } from '@/types/dashboard';
import { useToast } from "@/hooks/use-toast";

interface AddAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysisType: ChartType | null; // Type of analysis being added (e.g., 'funnel')
  dashboardId: string | null;
}

const AddAnalysisModal: React.FC<AddAnalysisModalProps> = ({ open, onOpenChange, analysisType, dashboardId }) => {
  const [mode, setMode] = useState<'create' | 'existing'>('create');
  const [funnelName, setFunnelName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [chartName, setChartName] = useState('');
  const { addChartFromTemplate } = useDashboard(); // We will add this function later
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProceed = () => {
    if (!analysisType || !dashboardId) return;

    if (mode === 'create') {
      if (!funnelName.trim()) {
        toast({ title: "Error", description: "Please enter a funnel name.", variant: "destructive" });
        return;
      }
      // Redirect to creation page (passing name is optional)
      console.log(`Redirecting to create new ${analysisType} named: ${funnelName}`);
      navigate(`/create-${analysisType}?name=${encodeURIComponent(funnelName)}`); 
      onOpenChange(false);
    } else { // Add existing
      if (!selectedTemplateId) {
        toast({ title: "Error", description: "Please select an existing funnel.", variant: "destructive" });
        return;
      }
      console.log(`Adding existing funnel ${selectedTemplateId} as chart named ${chartName || '[Template Name]'} to dashboard ${dashboardId}`);
      try {
        // Call context function to add the chart (needs implementation)
        // Pass the potentially empty chartName
        addChartFromTemplate(dashboardId, chartName.trim(), selectedTemplateId, analysisType);
        // Update toast message based on whether a name was provided
        const finalChartName = chartName.trim() || mockFunnelTemplates.find(t => t.id === selectedTemplateId)?.name || 'Chart';
        toast({ title: "Success", description: `Chart '${finalChartName}' added to dashboard.` });
        onOpenChange(false);
      } catch (error) {
        console.error("Error adding chart from template:", error);
        toast({ title: "Error", description: "Failed to add chart.", variant: "destructive" });
      }
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state on close
      setMode('create');
      setFunnelName('');
      setSelectedTemplateId('');
      setChartName('');
    }
    onOpenChange(isOpen);
  }

  // Capitalize analysis type for title
  const titleType = analysisType ? analysisType.charAt(0).toUpperCase() + analysisType.slice(1) : 'Analysis';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add {titleType}</DialogTitle>
        </DialogHeader>
        
        <RadioGroup defaultValue="create" value={mode} onValueChange={(value) => setMode(value as 'create' | 'existing')} className="flex space-x-4 py-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="existing" id="r1" />
            <Label htmlFor="r1">Add existing</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="create" id="r2" />
            <Label htmlFor="r2">Create new</Label>
          </div>
        </RadioGroup>

        <div className="space-y-4 py-4">
          {mode === 'create' ? (
            <div className="space-y-2">
              <Label htmlFor="funnelName">Funnel name</Label>
              <Input 
                id="funnelName"
                placeholder="Enter" 
                value={funnelName} 
                onChange={(e) => setFunnelName(e.target.value)} 
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="existingFunnel">Select existing funnel <span className="text-red-500">*</span></Label>
                <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                  <SelectTrigger id="existingFunnel">
                    <SelectValue placeholder="Enter" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockFunnelTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="chartName">Add chart name</Label>
                <Input 
                  id="chartName"
                  placeholder="Enter" 
                  value={chartName} 
                  onChange={(e) => setChartName(e.target.value)} 
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
          <Button className="bg-netcore-save-blue hover:bg-blue-800" onClick={handleProceed}>Proceed</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddAnalysisModal; 