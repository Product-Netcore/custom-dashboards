import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X, ChevronDown, Search, Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

type Option = {
  value: string;
  label: string;
};

interface MultiSelectComboBoxProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyPlaceholder?: string;
  createLabel?: (value: string) => string;
  invalidEmailMsg?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  allowCreate?: boolean;
}

const MultiSelectComboBox: React.FC<MultiSelectComboBoxProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Select",
  searchPlaceholder = "Search...",
  emptyPlaceholder = "No results found.",
  createLabel = (value) => `Add '${value}'`,
  invalidEmailMsg = "Please enter a valid email ID",
  className,
  triggerClassName,
  contentClassName,
  allowCreate = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dynamicOptions, setDynamicOptions] = useState<Option[]>([]); 

  const allOptions = [...options, ...dynamicOptions];

  const handleSelect = useCallback((value: string) => {
    onChange(selected.includes(value) ? selected.filter(s => s !== value) : [...selected, value]);
  }, [onChange, selected]);

  const handleCreate = (value: string) => {
    const newOption = { value, label: value };
    setDynamicOptions(prev => [...prev, newOption]); 
    handleSelect(value); 
    setSearchTerm('');
  };

  const handleRemove = (value: string) => {
    onChange(selected.filter(s => s !== value));
  };

  const filteredOptions = allOptions.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isSearchTermValidEmail = emailRegex.test(searchTerm);
  
  const canCreate = allowCreate && 
                    searchTerm.trim().length > 0 && 
                    isSearchTermValidEmail && 
                    !allOptions.some(opt => opt.value.toLowerCase() === searchTerm.toLowerCase());

  const handleSelectAll = () => {
    const allFilteredValues = filteredOptions.map(opt => opt.value);
    if (isAllSelected) {
      onChange(selected.filter(sel => !allFilteredValues.includes(sel)));
    } else {
      onChange([...new Set([...selected, ...allFilteredValues])]);
    }
  };

  const isAllSelected = filteredOptions.length > 0 && filteredOptions.every(opt => selected.includes(opt.value));

  let commandEmptyContent = <CommandEmpty>{emptyPlaceholder}</CommandEmpty>;
  if (searchTerm.trim().length > 0 && filteredOptions.length === 0 && !canCreate) {
    if (!isSearchTermValidEmail) {
      commandEmptyContent = <CommandEmpty>{invalidEmailMsg}</CommandEmpty>;
    } else {
      commandEmptyContent = <CommandEmpty>{emptyPlaceholder}</CommandEmpty>; 
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild className={className}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={cn(
            "w-full justify-between h-auto min-h-[42px] px-3 py-2 text-sm font-normal",
            triggerClassName
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-1 flex-grow overflow-hidden mr-2">
            {selected.length === 0 && (
              <span className="truncate">{placeholder}</span>
            )}
            
            {selected.length > 0 && (
              <>
                {(() => {
                  const firstValue = selected[0];
                  const option = allOptions.find(opt => opt.value === firstValue);
                  return (
                    <Badge
                      key={firstValue}
                      variant="secondary"
                      className="rounded-md px-2 py-0.5 bg-gray-200 text-gray-700 whitespace-nowrap text-xs"
                    >
                      {option?.label || firstValue}
                      <button
                        className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); handleRemove(firstValue); } }}
                        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemove(firstValue); }}
                        aria-label={`Remove ${option?.label || firstValue}`}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  );
                })()}

                {selected.length > 1 && (
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-xs font-medium text-gray-600 cursor-default whitespace-nowrap ml-1">
                          +{selected.length - 1}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-800 text-white p-2 rounded-md shadow-lg">
                        <p className="font-semibold text-sm mb-1">Additional recipients:</p>
                        <ul className="list-none pl-0 m-0 space-y-1">
                          {selected.slice(1).map(value => {
                            const option = allOptions.find(opt => opt.value === value);
                            return <li key={value} className="text-xs">{option?.label || value}</li>;
                          })}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </>
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[--radix-popover-trigger-width] p-0", contentClassName)}>
        <Command>
          <div className='flex items-center border-b px-3 w-full'> 
            <CommandInput 
                ref={inputRef}
                placeholder={searchPlaceholder} 
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="h-11 flex-grow bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-none focus:ring-0 ring-0 focus:border-none"
            />
            <Search className="h-4 w-4 shrink-0 opacity-50 ml-2" /> 
          </div>
          <CommandList>
            {commandEmptyContent} 
            <CommandGroup>
              {filteredOptions.length > 1 && (
                <CommandItem 
                  onSelect={handleSelectAll}
                  className="text-sm flex items-center cursor-pointer"
                >
                  <Checkbox className="mr-2 h-4 w-4" checked={isAllSelected} />
                  Select All
                </CommandItem>
              )}
              
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="text-sm flex items-center cursor-pointer"
                >
                  <Checkbox className="mr-2 h-4 w-4" checked={selected.includes(option.value)} />
                  {option.label}
                </CommandItem>
              ))}

              {canCreate && (
                <CommandItem 
                  key={searchTerm} 
                  value={searchTerm} 
                  onSelect={() => handleCreate(searchTerm)}
                  className="text-sm flex items-center cursor-pointer text-blue-600 hover:text-blue-700"
                >
                    <Plus className="mr-2 h-4 w-4 text-blue-600" />
                    {createLabel(searchTerm)}
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiSelectComboBox; 