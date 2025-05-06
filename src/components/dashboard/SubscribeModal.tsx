import React from 'react';
import {
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Added Select for frequency

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardName: string;
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose, dashboardName }) => {
  
  // Placeholder function for handling subscription save
  const handleSaveSubscription = () => {
    console.log("Subscription settings saved (placeholder)");
    onClose(); // Close modal after save
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] bg-white p-0 rounded-lg shadow-xl">
        <DialogHeader className="p-6 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-gray-900">Subscribe to Dashboard</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-1">
            Get snapshots of "{dashboardName}" delivered to your inbox.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* Placeholder Subscription Options */}
          <div className="space-y-2">
            <Label htmlFor="frequency" className="text-sm font-medium text-gray-700">Frequency</Label>
            <Select defaultValue="daily">
              <SelectTrigger id="frequency" className="w-full">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipients" className="text-sm font-medium text-gray-700">Recipients (comma-separated)</Label>
            <Input id="recipients" placeholder="e.g., team@example.com, manager@example.com" />
          </div>
        </div>

        <DialogFooter className="p-6 bg-gray-50 border-t border-gray-200 sm:justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSaveSubscription}>Subscribe</Button> 
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscribeModal; 