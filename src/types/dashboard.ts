import React from 'react'; // Import React for ElementType

export type DashboardType = 'system' | 'custom';

export interface Dashboard {
  id: string;
  name: string;
  type: DashboardType;
  icon?: React.ElementType; // Add optional icon property
  isPinned?: boolean;
  charts: Chart[];
  createdAt: Date;
  updatedAt: Date;
}

export type ChartType = 'funnel' | 'rfm' | 'cohort' | 'userPath' | 'behavior' | 'bar' | 'segment' | 'retention';

export type DisplayMode = 'chart' | 'kpi' | 'chartAndKpi' | 'table' | 'transposedTable' | 'studio';

export interface Chart {
  id: string;
  title: string;
  description: string;
  type: ChartType;
  displayMode: 'chart' | 'kpi' | 'chart_kpi' | 'table' | 'transposed_table'; // Updated display modes
  isFullWidth: boolean;
  isBodyHidden?: boolean; // Renamed from isCollapsed
  tableDisplayMode?: '#' | '%'; // Added for the new toggle
  data: any; // Keep as any for flexibility with mock data
  createdAt: Date;
  updatedAt: Date;
}

export interface SaveChartOptions {
  saveType: 'analysisOnly' | 'saveAndPin' | 'saveAsNew';
  dashboardId?: string; // Optional if not pinning to dashboard
  newDashboardName?: string; // For creating a new dashboard
  chartName?: string; // Name for the chart
  description?: string; // Description for the chart
}
