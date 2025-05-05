import React, { createContext, useContext, useState, useEffect } from 'react';
import { systemDashboards, customDashboards as initialCustomDashboards } from '@/data/mockDashboards';
import { Dashboard, Chart, ChartType, SaveChartOptions } from '@/types/dashboard';
import { mockFunnelTemplates } from '@/data/mockFunnels';

export type ViewType = 'dashboard' | 'insightGenerator';

interface DashboardContextProps {
  systemDashboards: Dashboard[];
  customDashboards: Dashboard[];
  filteredDashboards: Dashboard[];
  currentDashboard: Dashboard | null;
  currentView: ViewType;
  searchQuery: string;
  setCurrentDashboard: (dashboard: Dashboard) => void;
  setCurrentView: (view: ViewType) => void;
  setSearchQuery: (query: string) => void;
  createDashboard: (name: string) => Dashboard;
  renameDashboard: (id: string, name: string) => void;
  deleteDashboard: (id: string) => void;
  togglePinDashboard: (id: string) => void;
  saveChart: (chart: Chart, options: SaveChartOptions) => void;
  removeChart: (dashboardId: string, chartId: string) => void;
  toggleChartWidth: (dashboardId: string, chartId: string) => void;
  addChartFromTemplate: (dashboardId: string, chartName: string, templateId: string, analysisType: ChartType) => void;
  reorderCharts: (dashboardId: string, startIndex: number, endIndex: number) => void;
  renameChart: (dashboardId: string, chartId: string, newTitle: string) => void;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

// Helper function to parse dates stored as strings in localStorage
const parseDashboardDates = (dashboard: Dashboard): Dashboard => ({
  ...dashboard,
  createdAt: new Date(dashboard.createdAt),
  updatedAt: new Date(dashboard.updatedAt),
  charts: dashboard.charts.map(chart => ({
    ...chart,
    createdAt: new Date(chart.createdAt),
    updatedAt: new Date(chart.updatedAt),
    isBodyHidden: chart.isBodyHidden ?? false, // Ensure default during parsing
  }))
});

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [systemDashboardsState, setSystemDashboards] = useState<Dashboard[]>(systemDashboards);
  // Load custom dashboards from localStorage or use initial mock data
  const [customDashboardsState, setCustomDashboards] = useState<Dashboard[]>(() => {
    const savedDashboards = localStorage.getItem('customDashboards');
    if (savedDashboards) {
      try {
        const parsedDashboards = JSON.parse(savedDashboards) as Dashboard[];
        // Ensure dates are converted back to Date objects
        return parsedDashboards.map(parseDashboardDates);
      } catch (error) {
        console.error("Error parsing custom dashboards from localStorage:", error);
        return initialCustomDashboards.map(parseDashboardDates); // Fallback to initial
      }
    } else {
      return initialCustomDashboards.map(parseDashboardDates); // Initial load
    }
  });
  // Load the last viewed dashboard ID from localStorage
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard | null>(() => {
    const lastDashboardId = localStorage.getItem('lastDashboardId');
    const allDashboards = [...systemDashboards, ...customDashboardsState];
    const foundDashboard = allDashboards.find(d => d.id === lastDashboardId);
    return foundDashboard || systemDashboards[0]; // Default to first system dashboard
  });
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Save custom dashboards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('customDashboards', JSON.stringify(customDashboardsState));
  }, [customDashboardsState]);

  // Save the current dashboard ID to localStorage whenever it changes
  useEffect(() => {
    if (currentDashboard) {
      localStorage.setItem('lastDashboardId', currentDashboard.id);
    } else {
      localStorage.removeItem('lastDashboardId'); // Clear if no dashboard is selected
    }
  }, [currentDashboard]);

  // Filter and sort dashboards: Pinned first, then alphabetically
  const filteredDashboards = React.useMemo(() => {
    const filtered = customDashboardsState.filter(dashboard => 
      dashboard.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Sort: Pinned first, then alphabetically
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [customDashboardsState, searchQuery]);

  const createDashboard = (name: string): Dashboard => {
    const newDashboard: Dashboard = {
      id: `dashboard-${Date.now()}`,
      name,
      type: 'custom',
      charts: [],
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCustomDashboards(prev => [...prev, newDashboard]);
    setCurrentDashboard(newDashboard);
    setCurrentView('dashboard');
    return newDashboard;
  };

  const renameDashboard = (id: string, name: string) => {
    setCustomDashboards(prev => 
      prev.map(dashboard => 
        dashboard.id === id ? { ...dashboard, name, updatedAt: new Date() } : dashboard
      )
    );
    
    // If the current dashboard is renamed, update its state too
    if (currentDashboard?.id === id) {
      setCustomDashboards(prev => {
        const updatedDashboards = prev.map(dashboard => 
          dashboard.id === id ? { ...dashboard, name, updatedAt: new Date() } : dashboard
        );
        // Find the updated dashboard and set it as current
        const updatedCurrent = updatedDashboards.find(d => d.id === id);
        if (updatedCurrent) {
          setCurrentDashboard(updatedCurrent);
        }
        return updatedDashboards;
      });
    } else {
      // Otherwise, just update the list
      setCustomDashboards(prev => 
        prev.map(dashboard => 
          dashboard.id === id ? { ...dashboard, name, updatedAt: new Date() } : dashboard
        )
      );
    }
  };

  const deleteDashboard = (id: string) => {
    setCustomDashboards(prev => prev.filter(dashboard => dashboard.id !== id));
    
    // If the current dashboard is deleted, set the first system dashboard as current
    if (currentDashboard?.id === id) {
      setCurrentDashboard(systemDashboardsState[0]);
    }
  };

  const togglePinDashboard = (id: string) => {
    setCustomDashboards(prev => 
      prev.map(dashboard => 
        dashboard.id === id 
          ? { ...dashboard, isPinned: !dashboard.isPinned, updatedAt: new Date() } 
          : dashboard
      )
    );
  };

  // --- Chart Manipulation Functions ---

  const updateChartsInDashboard = (
    dashboardId: string,
    updateFn: (charts: Chart[]) => Chart[]
  ) => {
    const updater = (dashboards: Dashboard[]) =>
      dashboards.map(dashboard =>
        dashboard.id === dashboardId
          ? { ...dashboard, charts: updateFn(dashboard.charts), updatedAt: new Date() }
          : dashboard
      );

    // Check if it's a system or custom dashboard based on prefix/existence
    // This logic might need refinement based on exact ID patterns
    if (systemDashboardsState.some(d => d.id === dashboardId)) {
       setSystemDashboards(updater);
    } else {
      setCustomDashboards(prev => {
        const updatedDashboards = updater(prev);
        // Update currentDashboard state if the modified dashboard is the current one
        if (currentDashboard?.id === dashboardId) {
          const updatedCurrent = updatedDashboards.find(d => d.id === dashboardId);
          if (updatedCurrent) setCurrentDashboard(updatedCurrent);
        }
        return updatedDashboards;
      });
    }
  };

  const removeChart = (dashboardId: string, chartId: string) => {
    updateChartsInDashboard(dashboardId, charts => charts.filter(chart => chart.id !== chartId));
  };

  const toggleChartWidth = (dashboardId: string, chartId: string) => {
    updateChartsInDashboard(dashboardId, charts =>
      charts.map(chart =>
        chart.id === chartId ? { ...chart, isFullWidth: !chart.isFullWidth } : chart
      )
    );
  };

  // Added: Reorder charts within a dashboard
  const reorderCharts = (dashboardId: string, startIndex: number, endIndex: number) => {
    updateChartsInDashboard(dashboardId, currentCharts => {
      const result = Array.from(currentCharts);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  // Added: Rename a specific chart
  const renameChart = (dashboardId: string, chartId: string, newTitle: string) => {
      updateChartsInDashboard(dashboardId, charts =>
        charts.map(chart =>
          chart.id === chartId ? { ...chart, title: newTitle, updatedAt: new Date() } : chart
        )
      );
  };

  const saveChart = (chart: Chart, options: SaveChartOptions) => {
    const { saveType, dashboardId, newDashboardName } = options;
    
    if (saveType === 'saveAndPin') {
      if (dashboardId) {
        // Add chart to existing dashboard
        setCustomDashboards(prev => 
          prev.map(dashboard => 
            dashboard.id === dashboardId 
              ? { 
                  ...dashboard, 
                  charts: [...dashboard.charts, { ...chart, id: `chart-${Date.now()}` }],
                  updatedAt: new Date()
                } 
              : dashboard
          )
        );
      } else if (newDashboardName) {
        // Create new dashboard and add chart
        const newDashboard: Dashboard = {
          id: `dashboard-${Date.now()}`,
          name: newDashboardName,
          type: 'custom',
          charts: [{ ...chart, id: `chart-${Date.now()}` }],
          isPinned: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setCustomDashboards(prev => [...prev, newDashboard]);
        setCurrentDashboard(newDashboard);
        setCurrentView('dashboard');
      }
    }
  };

  // New function to add chart from a template (e.g., existing funnel)
  const addChartFromTemplate = (dashboardId: string, chartName: string, templateId: string, analysisType: ChartType) => {
    // Find the template (assuming only funnels for now)
    const template = mockFunnelTemplates.find(t => t.id === templateId);
    if (!template) {
      console.error(`Template with ID ${templateId} not found.`);
      throw new Error('Template not found'); // Throw error to be caught in modal
    }

    // Use provided chart name, or fall back to template name if empty
    const finalChartName = chartName || template.name;

    // Create a new chart based on the template
    const newChart: Chart = {
      id: `chart-${Date.now()}`,
      title: finalChartName, // Use the final name
      description: template.description, // Use description from template
      type: analysisType, // Set the correct analysis type
      displayMode: 'chart', // Default display mode
      isFullWidth: false,
      data: { /* Mock or template-specific data structure */
        templateOrigin: templateId, // Store reference to template
        labels: ['Step 1', 'Step 2', 'Step 3'], // Example data
        values: [100, 75, 50] // Example data
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add the new chart to the correct custom dashboard
    setCustomDashboards(prev => {
      const updatedDashboards = prev.map(dashboard =>
        dashboard.id === dashboardId
          ? { ...dashboard, charts: [...dashboard.charts, newChart], updatedAt: new Date() }
          : dashboard
      );

      // Find the updated dashboard
      const targetDashboard = updatedDashboards.find(d => d.id === dashboardId);

      if (targetDashboard) {
         // If the target dashboard is the current one, update the currentDashboard state
        if (currentDashboard?.id === dashboardId) {
          setCurrentDashboard(targetDashboard);
        }
        // If it wasn't the current one, switch to it (optional behavior, keeping it for now)
        else if (currentDashboard?.id !== dashboardId) {
          setCurrentDashboard(targetDashboard);
          setCurrentView('dashboard'); 
        }
      }
      return updatedDashboards; // Return the updated list
    });
  };

  return (
    <DashboardContext.Provider
      value={{
        systemDashboards: systemDashboardsState,
        customDashboards: customDashboardsState,
        filteredDashboards,
        currentDashboard,
        currentView,
        searchQuery,
        setCurrentDashboard,
        setCurrentView,
        setSearchQuery,
        createDashboard,
        renameDashboard,
        deleteDashboard,
        togglePinDashboard,
        saveChart,
        removeChart,
        toggleChartWidth,
        addChartFromTemplate,
        reorderCharts,
        renameChart
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
