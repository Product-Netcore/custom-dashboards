import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { systemDashboards, customDashboards as initialCustomDashboards } from '@/data/mockDashboards';
import { Dashboard, Chart, ChartType, SaveChartOptions } from '@/types/dashboard';
import { mockFunnelTemplates } from '@/data/mockFunnels';
import { useToast } from "@/hooks/use-toast";

export type ViewType = 'dashboard' | 'insightGenerator';

interface DashboardContextProps {
  dashboards: Dashboard[];
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
  addChartFromTemplate: (dashboardId: string, chartName: string, templateId: string, analysisType: ChartType) => void;
  reorderCharts: (dashboardId: string, startIndex: number, endIndex: number) => void;
  renameChart: (dashboardId: string, chartId: string, newTitle: string) => void;
  duplicateChart: (dashboardId: string, chartId: string) => void;
  addChartToExistingDashboard: (targetDashboardId: string, chartToCopy: Chart) => void;
  createDashboardWithChart: (newDashboardName: string | undefined, chartToCopy: Chart) => void;
  addNewChartToDashboard: (dashboardId: string, chartData: Omit<Chart, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

// Helper function to parse dates stored as strings in localStorage
const parseDashboardDates = (dashboard: Dashboard): Dashboard => {
  try {
    const charts = Array.isArray(dashboard.charts) ? dashboard.charts.map(chart => ({
      ...chart,
      createdAt: chart.createdAt ? new Date(chart.createdAt) : new Date(),
      updatedAt: chart.updatedAt ? new Date(chart.updatedAt) : new Date(),
      isBodyHidden: chart.isBodyHidden ?? false,
    })) : [];

    return {
      ...dashboard,
      createdAt: dashboard.createdAt ? new Date(dashboard.createdAt) : new Date(),
      updatedAt: dashboard.updatedAt ? new Date(dashboard.updatedAt) : new Date(),
      charts,
    };
  } catch (error) {
    console.error("ERROR in parseDashboardDates for dashboard:", dashboard?.id, error);
    // Return a minimally valid dashboard structure or throw to be caught by the caller
    // For now, let's try to return something that won't break the app further,
    // but this dashboard might be missing data or have incorrect dates.
    return {
      id: dashboard?.id || `error-id-${Date.now()}`,
      name: dashboard?.name || "Error: Unparseable Dashboard",
      type: dashboard?.type || 'custom',
      charts: [],
      isPinned: dashboard?.isPinned || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      // Potentially add an error flag
      _parseError: true 
    } as Dashboard;
  }
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [systemDashboardsState, setSystemDashboards] = useState<Dashboard[]>(systemDashboards);
  const [customDashboardsState, setCustomDashboards] = useState<Dashboard[]>(() => {
    const savedDashboardsString = localStorage.getItem('customDashboards');
    console.log('LOADING customDashboards from localStorage string:', savedDashboardsString);
    if (savedDashboardsString) {
      let parsedOverallArray: any[] = [];
      try {
        parsedOverallArray = JSON.parse(savedDashboardsString);
        if (!Array.isArray(parsedOverallArray)) {
          console.error("Parsed data from localStorage is not an array:", parsedOverallArray);
          parsedOverallArray = []; // Treat as empty if not an array
        }
      } catch (error) {
        console.error("Error parsing the entire customDashboards string from localStorage:", error);
        // Potentially fall back to initial if the whole string is corrupt
        console.log('Falling back to initialCustomDashboards due to major parsing error.');
        return initialCustomDashboards.map(parseDashboardDates);
      }

      const successfullyParsedDashboards: Dashboard[] = [];
      parsedOverallArray.forEach((dashboardData, index) => {
        try {
          // Try to parse and validate one dashboard at a time
          const dashboard = parseDashboardDates(dashboardData as Dashboard); // Assume structure for now
          // Add more validation if needed: e.g., check for dashboard.id
          if (dashboard && dashboard.id) {
            successfullyParsedDashboards.push(dashboard);
          } else {
            console.warn(`Skipping dashboard at index ${index} due to missing id after parsing:`, dashboardData);
          }
        } catch (individualError) {
          console.error(`Error parsing individual dashboard at index ${index} from localStorage:`, individualError, "Data:", dashboardData);
        }
      });
      
      console.log('SUCCESSFULLY PARSED dashboards from localStorage:', successfullyParsedDashboards.map(d => ({id: d.id, name: d.name, charts: d.charts.length })));
      
      if (successfullyParsedDashboards.length > 0) {
        return successfullyParsedDashboards;
      } else if (parsedOverallArray.length > 0 && successfullyParsedDashboards.length === 0) {
        // If we had an array but couldn't parse any item, it's problematic
        console.warn("Had data from localStorage, but could not successfully parse any dashboard items. Falling back to initial.");
        return initialCustomDashboards.map(parseDashboardDates);
      }
    }
    // Fallback for no savedDashboardsString or if everything went wrong and successfullyParsedDashboards is empty
    console.log('No valid saved dashboards in localStorage or empty after parsing, using initialCustomDashboards.');
    return initialCustomDashboards.map(parseDashboardDates);
  });
  const [currentDashboard, _setCurrentDashboard] = useState<Dashboard | null>(() => {
    const lastDashboardId = localStorage.getItem('lastDashboardId');
    const allDashboards = [...systemDashboards, ...customDashboardsState];
    const foundDashboard = allDashboards.find(d => d.id === lastDashboardId);
    return foundDashboard || systemDashboards[0]; // Default to first system dashboard
  });
  const [currentViewInternal, _setCurrentViewInternal] = useState<ViewType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const { toast } = useToast();

  // Custom setCurrentView with logging
  const setCurrentView = useCallback((view: ViewType) => {
    console.log(`[DashboardContext] setCurrentView called with: ${view}. Previous: ${currentViewInternal}`);
    _setCurrentViewInternal(view);
  }, [currentViewInternal]);

  // Wrapped setCurrentDashboard with logging (optional, but good for tracing)
  const setCurrentDashboard = useCallback((dashboard: Dashboard | null) => {
    console.log(`[DashboardContext] setCurrentDashboard called. New dashboard: ${dashboard?.name ?? 'null'}.`);
    _setCurrentDashboard(dashboard);
    // If setting a dashboard *always* implies view should be 'dashboard', it needs to be here:
    // However, be careful not to override intentional 'insightGenerator' views.
    // Example: if (dashboard) setCurrentView('dashboard'); // This could be a problem source
  }, []);

  // Save custom dashboards to localStorage whenever they change
  useEffect(() => {
    console.log('SAVING customDashboards to localStorage:', customDashboardsState.map(d => ({id: d.id, name: d.name, charts: d.charts.length }) ));
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
    let newlyPinnedDashboard: Dashboard | null = null;
    setCustomDashboards(prev => {
      const updatedDashboards = prev.map(dashboard => {
        if (dashboard.id === id) {
          const updatedDashboard = { 
            ...dashboard, 
            isPinned: !dashboard.isPinned, 
            updatedAt: new Date() 
          };
          if (updatedDashboard.isPinned) { // Check if the dashboard was pinned (not unpinned)
            newlyPinnedDashboard = updatedDashboard;
          }
          return updatedDashboard;
        }
        return dashboard;
      });
      // After updating the state, if a dashboard was newly pinned, set it as current.
      if (newlyPinnedDashboard) {
        setCurrentDashboard(newlyPinnedDashboard);
        // Optionally, also ensure the view is set to dashboard view
        // setCurrentView('dashboard'); // This line is correctly commented, but shows intent
      }
      return updatedDashboards;
    });
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

  // const toggleChartWidth = (dashboardId: string, chartId: string) => {
  //   updateChartsInDashboard(dashboardId, charts =>
  //     charts.map(chart =>
  //       chart.id === chartId ? { ...chart, isFullWidth: !chart.isFullWidth } : chart
  //     )
  //   );
  // };

  // Helper function to find a chart within a dashboard's charts array
  const findChart = (dashboardId: string, chartId: string): Chart | undefined => {
    const dashboard = [...systemDashboardsState, ...customDashboardsState].find(d => d.id === dashboardId);
    return dashboard?.charts.find(c => c.id === chartId);
  };

  const reorderCharts = (dashboardId: string, startIndex: number, endIndex: number) => {
    updateChartsInDashboard(dashboardId, currentCharts => {
      const result = Array.from(currentCharts);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const renameChart = (dashboardId: string, chartId: string, newTitle: string) => {
      updateChartsInDashboard(dashboardId, charts =>
        charts.map(chart =>
          chart.id === chartId ? { ...chart, title: newTitle, updatedAt: new Date() } : chart
        )
      );
  };

  const saveChart = (chart: Chart, options: SaveChartOptions) => {
    const { saveType, dashboardId, newDashboardName, chartName, description } = options;

    // Helper to create the chart object
    const createChartObject = (baseChart: Chart, title?: string, desc?: string): Chart => ({
      ...baseChart,
      id: `chart-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`,
      title: title || baseChart.title,
      description: desc || baseChart.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (saveType === 'analysisOnly') {
      // Logic for saving analysis only (e.g., to a global list, not covered here yet)
      console.log("Analysis saved (globally):", chart);
      toast({ title: "Success", description: `Analysis '${chart.title}' saved.` });
      return;
    }

    let targetDashboardId = dashboardId;

    if (saveType === 'saveAsNew' && newDashboardName) {
      const newDashboard = createDashboard(newDashboardName);
      targetDashboardId = newDashboard.id;
    }

    if (!targetDashboardId) {
      toast({ title: "Error", description: "No target dashboard specified for saving the chart.", variant: "destructive" });
      return;
    }
    
    const chartToSave = createChartObject(chart, chartName, description);

    updateChartsInDashboard(targetDashboardId, currentCharts => [...currentCharts, chartToSave]);
    toast({ title: "Success", description: `Chart '${chartToSave.title}' saved to dashboard.` });
    
    // Switch to the target dashboard if it's not the current one
    if (currentDashboard?.id !== targetDashboardId) {
        const target = customDashboardsState.find(d => d.id === targetDashboardId) || systemDashboardsState.find(d => d.id === targetDashboardId);
        if (target) {
            setCurrentDashboard(target);
        setCurrentView('dashboard');
      }
    }
  };

  // New function to add chart from a template (e.g., existing funnel)
  const addChartFromTemplate = (dashboardId: string, chartName: string, templateId: string, analysisType: ChartType) => {
    const template = mockFunnelTemplates.find(t => t.id === templateId);
    if (!template) {
      console.error(`Template with ID ${templateId} not found.`);
      throw new Error('Template not found');
    }
    const finalChartName = chartName || template.name;
    const newChart: Chart = {
      id: `chart-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`,
      title: finalChartName,
      description: template.description,
      type: analysisType,
      displayMode: 'chart',
      data: { ...template.data },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    updateChartsInDashboard(dashboardId, charts => [...charts, newChart]);
  };

  const duplicateChart = (dashboardId: string, chartId: string) => {
    const chartToDuplicate = findChart(dashboardId, chartId);
    if (!chartToDuplicate) return;

    // Destructure to omit isFullWidth explicitly if it somehow still exists on the old type in memory
    const { isFullWidth, ...restOfChartToDuplicate } = chartToDuplicate as any;

    const newChart: Chart = {
      ...restOfChartToDuplicate,
      id: `chart-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`,
      title: `Copy of ${chartToDuplicate.title}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    updateChartsInDashboard(dashboardId, charts => {
      const index = charts.findIndex(c => c.id === chartId);
      if (index === -1) return [...charts, newChart]; // Should not happen if findChart worked
      const newCharts = [...charts];
      newCharts.splice(index + 1, 0, newChart);
      return newCharts;
    });
  };

  const addChartToExistingDashboard = (targetDashboardId: string, chartToCopy: Chart) => {
    // Destructure to omit isFullWidth explicitly if it somehow still exists on the old type in memory
    const { id, createdAt, updatedAt, isFullWidth, ...restOfChartToCopy } = chartToCopy as any;

    const newChart: Chart = {
      ...restOfChartToCopy,
      id: `chart-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    updateChartsInDashboard(targetDashboardId, charts => [...charts, newChart]);
  };

  const createDashboardWithChart = (newDashboardName: string | undefined, chartToCopy: Chart) => {
    const dashboardName = newDashboardName?.trim() || "Untitled Dashboard";
    const newDashboard = createDashboard(dashboardName); // createDashboard already sets dates

    // Destructure to omit isFullWidth explicitly if it somehow still exists on the old type in memory
    const { id, createdAt, updatedAt, isFullWidth, ...restOfChartToCopy } = chartToCopy as any;
    
    const newChartForDashboard: Chart = {
      ...restOfChartToCopy,
      id: `chart-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    updateChartsInDashboard(newDashboard.id, () => [newChartForDashboard]);
    setCurrentDashboard(newDashboard);
    setCurrentView('dashboard');
    toast({ title: "Success", description: `Dashboard '${dashboardName}' created with chart '${newChartForDashboard.title}'.`});
  };

  // Function to add a brand new chart (created by user) to a dashboard
  const addNewChartToDashboard = (dashboardId: string, chartData: Omit<Chart, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Destructure to omit isFullWidth explicitly if it somehow still exists on the old type in memory
    const { isFullWidth, ...restOfChartData } = chartData as any;

    const newChart: Chart = {
      id: `chart-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`,
      ...restOfChartData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    updateChartsInDashboard(dashboardId, charts => [...charts, newChart]);

    toast({
      title: "Analysis Saved",
      description: `'${newChart.title}' added to the dashboard.`,
    });
  };

  // Combine system and custom dashboards for consumers that need the full list
  const allDashboards = [...systemDashboardsState, ...customDashboardsState];

  return (
    <DashboardContext.Provider
      value={{
        dashboards: allDashboards, // Export combined list
        systemDashboards: systemDashboardsState,
        customDashboards: customDashboardsState,
        filteredDashboards,
        currentDashboard,
        currentView: currentViewInternal, // Use the internal state variable for the value
        searchQuery,
        setCurrentDashboard, // Use wrapped setter
        setCurrentView,    // Use wrapped setter
        setSearchQuery,
        createDashboard,
        renameDashboard,
        deleteDashboard,
        togglePinDashboard,
        saveChart,
        removeChart,
        addChartFromTemplate,
        reorderCharts,
        renameChart,
        duplicateChart,
        addChartToExistingDashboard,
        createDashboardWithChart,
        addNewChartToDashboard
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
