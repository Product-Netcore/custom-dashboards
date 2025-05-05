import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Plus } from 'lucide-react';

// Placeholder component - needs actual implementation for steps, filters, etc.
const CreateFunnelPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialName = searchParams.get('name') || 'Untitled funnel';
  const [funnelName, setFunnelName] = React.useState(initialName);
  const [isEditingName, setIsEditingName] = React.useState(!searchParams.get('name'));

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFunnelName(e.target.value);
  };

  const handleNameBlur = () => {
    setIsEditingName(false);
    // Add logic to save/update funnel name if needed
  };

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
        <Button className="bg-netcore-save-blue hover:bg-blue-800">Save</Button>
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