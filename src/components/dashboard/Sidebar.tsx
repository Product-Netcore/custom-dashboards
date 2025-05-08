import React, { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { Dashboard } from '@/types/dashboard';
import { Home, Users, Activity, CircleDollarSign, Briefcase, ChevronLeft, Pin, Search, Plus, MessageSquare, Trash2, LayoutGrid } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import DeleteDashboardModal from './DeleteDashboardModal';
import { useToast } from "@/hooks/use-toast";

interface NavItem {
  id: string;
  name: string;
  icon: React.ElementType;
}

const Sidebar: React.FC = () => {
  const { 
    systemDashboards, 
    filteredDashboards, 
    currentDashboard,
    currentView,
    setCurrentDashboard, 
    setCurrentView,
    searchQuery, 
    setSearchQuery,
    togglePinDashboard,
    deleteDashboard,
    createDashboard
  } = useDashboard();

  const [dashboardToDelete, setDashboardToDelete] = useState<Dashboard | null>(null);
  const { toast } = useToast();

  const navItems: NavItem[] = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'engagement', name: 'Engagement', icon: Users },
    { id: 'behaviour', name: 'Behaviour', icon: Activity },
    { id: 'revenue', name: 'Revenue', icon: CircleDollarSign },
    { id: 'co-marketer', name: 'Co-marketer', icon: Briefcase },
  ];

  const activeItemId = currentDashboard && currentDashboard.type === 'system' 
    ? systemDashboards.find(d => d.id === currentDashboard.id)?.id
    : null;

  const handleItemClick = (item: NavItem) => {
    const targetDashboard = systemDashboards.find(d => d.id.startsWith(`system-${item.id}`) || d.name.toLowerCase() === item.id); 
    if (targetDashboard) {
      setCurrentDashboard(targetDashboard);
      setCurrentView('dashboard');
    } else {
      console.warn(`System dashboard for ${item.name} (id: ${item.id}) not found`);
    }
  };

  const handleCustomDashboardClick = (dashboard: Dashboard) => {
    setCurrentDashboard(dashboard);
    setCurrentView('dashboard');
  };

  const handlePinClick = (e: React.MouseEvent, dashboardId: string) => {
    e.stopPropagation();
    togglePinDashboard(dashboardId);
  };

  const handleDeleteClick = (e: React.MouseEvent, dashboard: Dashboard) => {
    e.stopPropagation();
    setDashboardToDelete(dashboard);
  };

  const handleDeleteConfirm = () => {
    if (dashboardToDelete) {
      deleteDashboard(dashboardToDelete.id);
      toast({
        title: "Dashboard Deleted",
        description: `Dashboard '${dashboardToDelete.name}' deleted successfully`,
      });
      setDashboardToDelete(null);
    }
  };

  const handleCreateDashboard = () => {
    const MAX_DASHBOARDS = 300;
    if (filteredDashboards.length >= MAX_DASHBOARDS) {
      toast({
        title: "Dashboard Limit Reached",
        description: `You've reached the limit of ${MAX_DASHBOARDS} dashboards. Please delete an existing one to continue.`,
        variant: "destructive"
      });
      return;
    }
    const newDashboardName = `Custom dashboard ${filteredDashboards.length + 1}`;
    createDashboard(newDashboardName);
  };
  
  const handleInsightGeneratorClick = () => {
    setCurrentView('insightGenerator');
  };

  const handleMinimizeClick = () => {
    console.log("Minimize clicked");
  };

  return (
    <aside className="bg-white h-[calc(100vh-4rem)] w-64 border-r border-border flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboards</h1>
      </div>
      
      <div className="flex-1 flex flex-col min-h-0"> 
        <nav className="p-2 pt-4"> 
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 text-sm rounded-md mb-1 flex items-center gap-3",
                    activeItemId === item.id
                      ? "bg-blue-100 text-netcore-blue font-medium" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", activeItemId === item.id ? "text-netcore-blue" : "text-gray-500")} /> 
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <hr className="mx-4 my-3 border-gray-200" />

        <div className="px-4 pb-2 space-y-3 flex-1 min-h-0"> 
          <div className="flex items-center justify-between"> 
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Custom Dashboards
            </h2>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-netcore-blue hover:bg-blue-100"
                    onClick={handleCreateDashboard}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Create Dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

                  <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search dashboards..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-sm rounded-md border-gray-300 focus:border-netcore-blue focus:ring-netcore-blue"
            />
          </div>
          
          <ul className="space-y-1 pt-1">
            {filteredDashboards.length > 0 ? (
              filteredDashboards.map((dashboard) => (
                <li key={dashboard.id}>
                  <div className="relative group flex items-center justify-between hover:bg-gray-100 rounded-md pr-1"> 
                    <button
                      onClick={() => handleCustomDashboardClick(dashboard)}
                      className={cn(
                        "flex-1 text-left px-3 py-2 text-sm truncate", 
                        currentDashboard?.id === dashboard.id
                          ? "text-netcore-blue font-medium" 
                          : "text-gray-700"
                      )}
                      title={dashboard.name} 
                    >
                      {dashboard.name}
                              </button>
                        <TooltipProvider>
                      <Tooltip delayDuration={200}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={(e) => handlePinClick(e, dashboard.id)}
                                className={cn(
                                "p-1 ml-1 rounded hover:bg-gray-200", 
                                dashboard.isPinned 
                                  ? "text-netcore-blue opacity-100" 
                                  : "text-gray-400 opacity-0 group-hover:opacity-100"
                                )}
                              >
                                <Pin className={cn("h-4 w-4", dashboard.isPinned ? "fill-current" : "")} />
                              </button>
                            </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>{dashboard.isPinned ? 'Unpin' : 'Pin'} dashboard</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                    <TooltipProvider> 
                      <Tooltip delayDuration={200}>
                        <TooltipTrigger asChild>
                           <button
                              onClick={(e) => handleDeleteClick(e, dashboard)}
                              className={cn(
                                "p-1 ml-1 rounded hover:bg-gray-200", 
                                "text-gray-400 opacity-0 group-hover:opacity-100"
                              )}
                           >
                             <Trash2 className="h-4 w-4" />
                    </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Delete dashboard</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-muted-foreground">
                {searchQuery ? 'No matches found' : 'No custom dashboards'}
              </li>
            )}
          </ul>
        </div>
      </div> 

      <div className="px-2 py-2 border-t border-gray-200 mt-auto"> 
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sm text-netcore-sidebar-minimize hover:bg-gray-100 px-3 py-2.5"
          onClick={handleMinimizeClick}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Minimize this
        </Button>
      </div>

      {dashboardToDelete && (
        <DeleteDashboardModal
          dashboardName={dashboardToDelete.name}
          isOpen={true}
          onClose={() => setDashboardToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </aside>
  );
};

export default Sidebar;
