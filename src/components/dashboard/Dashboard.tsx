import React, { useState, useRef, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { useDashboard } from '@/contexts/DashboardContext';
import ChartCard from './ChartCard';
import { Chart, ChartType } from '@/types/dashboard';
import EmptyDashboard from './EmptyDashboard';
import { useToast } from '@/hooks/use-toast';
import SubscriptionModal from './SubscriptionModal';
import CustomDashboardHeader from './CustomDashboardHeader';
import InsightGenerator from '@/components/insight/InsightGenerator';
import AddAnalysisModal from './AddAnalysisModal';

const Dashboard: React.FC = () => {
  const { 
    currentDashboard, 
    renameDashboard,
    reorderCharts,
    currentView 
  } = useDashboard();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [addAnalysisModalOpen, setAddAnalysisModalOpen] = useState(false);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<ChartType | null>(null);
  const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // DND Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (currentDashboard) {
      setNewTitle(currentDashboard.name);
    }
  }, [currentDashboard]);

  const handleEditTitle = () => {
    if (!currentDashboard) return;
    
    setNewTitle(currentDashboard.name);
    setIsEditingTitle(true);
    setTimeout(() => {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }, 10);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleTitleSave = () => {
    if (!currentDashboard) return;
    
    if (newTitle && newTitle !== currentDashboard.name) {
      renameDashboard(currentDashboard.id, newTitle);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
    }
  };

  const handleAddAnalysis = (type?: ChartType) => {
    if (!type) {
      setSelectedAnalysisType(null);
      setAddAnalysisModalOpen(true);
      return;
    }
    setSelectedAnalysisType(type);
    setAddAnalysisModalOpen(true);
  };

  // DND Handler
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id && currentDashboard) {
      const oldIndex = currentDashboard.charts.findIndex(chart => chart.id === active.id);
      const newIndex = currentDashboard.charts.findIndex(chart => chart.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderCharts(currentDashboard.id, oldIndex, newIndex);
      }
    }
  }

  // Show Insight Generator when selected
  if (currentView === 'insightGenerator') {
    return (
      <div className="flex-1 bg-netcore-dashboard-bg p-6">
        <InsightGenerator />
      </div>
    );
  }

  if (!currentDashboard) {
    return (
      <div className="flex-1 bg-netcore-dashboard-bg p-6 flex items-center justify-center">
        <p className="text-muted-foreground">Select a dashboard from the sidebar</p>
      </div>
    );
  }

  const isSystemDashboard = currentDashboard.type === 'system';
  const charts = currentDashboard.charts;
  const hasCharts = charts.length > 0;
  
  console.log('Current dashboard ID:', currentDashboard.id);
  console.log('Current dashboard type:', currentDashboard.type);
  console.log('Is system dashboard:', isSystemDashboard);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-netcore-bg p-6 overscroll-contain-y">
      <div className="flex flex-col min-h-full">
        <CustomDashboardHeader
          dashboard={currentDashboard}
          isEditingTitle={isEditingTitle}
          newTitle={newTitle}
          onEditTitle={handleEditTitle}
          onTitleChange={handleTitleChange}
          onTitleSave={handleTitleSave}
          onTitleKeyDown={handleTitleKeyDown}
          onAddAnalysis={handleAddAnalysis}
          onSubscribe={() => setSubscribeModalOpen(true)}
          isSystemDashboard={isSystemDashboard}
          hasCharts={hasCharts}
        />

        <SubscriptionModal
          open={subscribeModalOpen}
          onOpenChange={setSubscribeModalOpen}
          dashboardName={currentDashboard?.name || ''}
        />

        <div className="flex-1">
          {hasCharts ? (
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={charts.map(chart => chart.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {charts.map((chart) => (
                    <ChartCard 
                      key={chart.id} 
                      chart={chart} 
                      dashboardId={currentDashboard.id} 
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <EmptyDashboard onAddAnalysis={handleAddAnalysis} />
          )}
        </div>
      </div>
      <AddAnalysisModal 
        open={addAnalysisModalOpen}
        onOpenChange={setAddAnalysisModalOpen}
        initialAnalysisType={selectedAnalysisType}
        dashboardId={currentDashboard?.id ?? null}
        currentDashboardHasCharts={hasCharts}
      />
    </div>
  );
};

export default Dashboard;
