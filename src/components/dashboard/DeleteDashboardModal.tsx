import React from 'react';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DeleteDashboardModalProps {
  dashboardName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteDashboardModal: React.FC<DeleteDashboardModalProps> = ({
  dashboardName,
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[480px] p-8 flex flex-col items-center gap-6">
        <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-4">
          [Illustration Placeholder]
        </div>

        <p className="text-lg font-medium text-center text-foreground">
          Are you sure want to remove "{dashboardName}"?
        </p>

        <AlertDialogFooter className="flex flex-row justify-center gap-4 w-full sm:justify-center">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-cobalt-blue text-cobalt-blue hover:bg-cobalt-blue/5 hover:text-cobalt-blue px-6"
          >
            NO
          </Button>
          <Button 
            className="bg-red-500 hover:bg-red-600 text-white px-6"
            onClick={onConfirm}
          >
            YES, REMOVE
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDashboardModal;
