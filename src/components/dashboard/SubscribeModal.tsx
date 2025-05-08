import React, { useState } from 'react';
import {
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogFooter,
  DialogClose,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import MultiSelectComboBox from '@/components/ui/MultiSelectComboBox';
import { mockRecipients } from '@/data/mockRecipients';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardName: string;
}

// Define types for frequency, day of week, day of month
type Frequency = 'daily' | 'weekly' | 'monthly';
type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose, dashboardName }) => {
  
  // State for selections
  const [selectedFrequency, setSelectedFrequency] = useState<Frequency>('daily');
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState<DayOfWeek>('Monday');
  const [selectedDayOfMonth, setSelectedDayOfMonth] = useState<string>('01');
  const [selectedHour, setSelectedHour] = useState<string>('09');
  const [selectedMinute, setSelectedMinute] = useState<string>('00');
  // Keep recipients as text for now
  const [recipients, setRecipients] = useState<string[]>([]);

  const handleSaveSubscription = () => {
    console.log("Subscription Settings:", {
        recipients,
        frequency: selectedFrequency,
        dayOfWeek: selectedFrequency === 'weekly' ? selectedDayOfWeek : undefined,
        dayOfMonth: selectedFrequency === 'monthly' ? selectedDayOfMonth : undefined,
        hour: selectedHour,
        minute: selectedMinute
    });
    onClose();
  };

  // --- Options for Selects ---
  const daysOfWeek: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const daysOfMonth = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  // --- End Options ---

  const inputSelectClasses = "bg-[#F8F8F8] border-none h-[42px] mt-2 focus-visible:ring-cobalt-blue focus-visible:ring-1 focus-visible:ring-offset-1 rounded-md";
  const labelClasses = "font-semibold text-sm text-charcoal tracking-[0.42px] mb-2 block";
  const requiredAsterisk = <span className="text-red-500 ml-0.5">*</span>;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Removing DialogClose from header, relying on default DialogContent close button */}
      <DialogContent className="sm:max-w-[422px] bg-white p-6 rounded-lg shadow-lg flex flex-col gap-6">
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-col gap-1">
            <DialogTitle className="font-bold text-base leading-[22px] text-charcoal tracking-[0.42px]">
              Subscribe to dashboard
            </DialogTitle>
            <DialogDescription className="text-xs font-semibold text-[#6F6F8D] tracking-[0.42px]">
              Get dashboard insights via email
            </DialogDescription>
          </div>
          {/* Default close button from DialogContent should appear here */}
        </div>

        {/* Body Content */}
        <div className="space-y-4">
          {/* Recipients (Input field for now) */}
          <div>
            <Label htmlFor="recipients-combobox" className={labelClasses}>
              Add recipient email ID(s) {requiredAsterisk}
            </Label>
            <MultiSelectComboBox
              options={mockRecipients}
              selected={recipients}
              onChange={setRecipients}
              placeholder="Select"
              searchPlaceholder="Search or add email..."
              emptyPlaceholder="No emails found. Type to add."
              allowCreate={true}
              triggerClassName={cn(
                "bg-[#F8F8F8] border-none h-[42px] mt-2 focus-visible:ring-cobalt-blue focus-visible:ring-1 focus-visible:ring-offset-1 rounded-md text-sm font-normal",
                recipients.length === 0 ? "text-gray-500" : "text-black"
              )}
              className="w-full"
            />
          </div>

          {/* Frequency */}
          <div>
            <Label htmlFor="frequency" className={labelClasses}>
              Frequency {requiredAsterisk}
            </Label>
            <Select value={selectedFrequency} onValueChange={(value) => setSelectedFrequency(value as Frequency)}>
              <SelectTrigger id="frequency" className={cn(inputSelectClasses, "w-full justify-between text-sm font-normal text-black")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Conditional: Day of the week */} 
          {selectedFrequency === 'weekly' && (
              <div>
                 <Label htmlFor="day-of-week" className={labelClasses}>
                    Day of the week {requiredAsterisk}
                 </Label>
                 <Select value={selectedDayOfWeek} onValueChange={(value) => setSelectedDayOfWeek(value as DayOfWeek)}>
                     <SelectTrigger id="day-of-week" className={cn(inputSelectClasses, "w-full justify-between text-sm font-normal text-black")}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {daysOfWeek.map(day => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                    </SelectContent>
                 </Select>
              </div>
          )}

          {/* Conditional: Day of the month */} 
          {selectedFrequency === 'monthly' && (
              <div>
                 <Label htmlFor="day-of-month" className={labelClasses}>
                    Day of the month {requiredAsterisk}
                 </Label>
                 <Select value={selectedDayOfMonth} onValueChange={setSelectedDayOfMonth}>
                     <SelectTrigger id="day-of-month" className={cn(inputSelectClasses, "w-full justify-between text-sm font-normal text-black")}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {daysOfMonth.map(day => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                    </SelectContent>
                 </Select>
              </div>
          )}

          {/* Time (Always visible) */}
          <div>
             <Label htmlFor="time-hh" className={labelClasses}>
               Time {requiredAsterisk}
             </Label>
             <div className="flex gap-2">
               <Select value={selectedHour} onValueChange={setSelectedHour}>
                 <SelectTrigger id="time-hh" className={cn(inputSelectClasses, "flex-1 justify-between text-sm font-normal text-black")} aria-label="Hour">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   {hours.map(hour => (
                     <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
               <Select value={selectedMinute} onValueChange={setSelectedMinute}>
                 <SelectTrigger className={cn(inputSelectClasses, "flex-1 justify-between text-sm font-normal text-black")} aria-label="Minute">
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   {minutes.map(minute => (
                     <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="flex flex-row justify-end gap-4">
          <Button 
            variant="outline"
            onClick={onClose}
            className="h-9 px-[18px] py-2 uppercase border-cobalt-blue border-[1.5px] text-cobalt-blue hover:bg-blue-50 hover:text-cobalt-blue"
          >
            CANCEL
          </Button>
          <Button 
            onClick={handleSaveSubscription}
            className="h-9 px-[18px] py-2 uppercase bg-cobalt-blue text-white hover:bg-blue-800"
          >
            SUBSCRIBE
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubscribeModal; 