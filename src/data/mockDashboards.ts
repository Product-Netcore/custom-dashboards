import { Dashboard, Chart, DashboardType } from '../types/dashboard';
// Import required icons from lucide-react
import { PieChart, Users, RefreshCw, ShoppingBag, Glasses, Home } from 'lucide-react'; 

// Helper to create dates
const now = new Date();
const yesterday = new Date();
yesterday.setDate(now.getDate() - 1);

// Sample Charts for "All Charts" Dashboard
const sampleCharts: Chart[] = [
  {
    id: 'chart-funnel-sample',
    title: 'Signup Conversion Funnel',
    description: 'Tracks user progress from visit to signup.',
    type: 'funnel',
    displayMode: 'chart',
    isFullWidth: false,
    isBodyHidden: false,
    data: { labels: ['Website Visit', 'View Signup Page', 'Signup Complete'], values: [1000, 300, 150] },
    createdAt: yesterday,
    updatedAt: now
  },
  {
    id: 'chart-rfm-sample',
    title: 'Customer RFM Segmentation',
    description: 'Segments users based on Recency, Frequency, and Monetary value.',
    type: 'rfm',
    displayMode: 'chart', 
    isFullWidth: false,
    isBodyHidden: false,
    data: { type: 'heatmap', /* Add simple mock heatmap data */ xLabels: ['1', '2', '3'], yLabels: ['A', 'B', 'C'], values: [[10, 50, 30], [20, 60, 40], [30, 70, 50]] },
    createdAt: yesterday,
    updatedAt: now
  },
  {
    id: 'chart-cohort-sample',
    title: 'Weekly Retention Cohort',
    description: 'Analyzes user retention over several weeks.',
    type: 'cohort',
    displayMode: 'chart',
    isFullWidth: false,
    isBodyHidden: false,
    data: { type: 'grid', /* Add simple mock cohort grid data */ cohorts: ['Week 1', 'Week 2'], values: [[100, 50], [100, 45]] },
    createdAt: yesterday,
    updatedAt: now
  },
  {
    id: 'chart-userpath-sample',
    title: 'Common User Navigation Paths',
    description: 'Visualizes the typical journeys users take.',
    type: 'userPath',
    displayMode: 'chart',
    isFullWidth: false,
    isBodyHidden: false,
    data: { type: 'flow', /* Add simple mock flow data */ nodes: [{id: 'A'}, {id: 'B'}, {id: 'C'}], links: [{source: 'A', target: 'B'}, {source: 'B', target: 'C'}] },
    createdAt: yesterday,
    updatedAt: now
  },
  {
    id: 'chart-behavior-sample',
    title: 'Daily Active Users (DAU)',
    description: 'Tracks daily active users over the past week.',
    type: 'behavior',
    displayMode: 'chart',
    isFullWidth: false,
    isBodyHidden: false,
    data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], values: [120, 150, 130, 160, 155] },
    createdAt: yesterday,
    updatedAt: now
  }
];

// New "All Charts" System Dashboard
const allChartsDashboard: Dashboard = {
  id: 'all-charts-dashboard',
  name: 'All Charts',
  type: 'custom' as DashboardType,
  charts: sampleCharts,
  isPinned: false,
  createdAt: now,
  updatedAt: now
};

// System dashboards
export const systemDashboards: Dashboard[] = [
  {
    id: 'system-home',
    name: 'Home',
    type: 'system' as DashboardType,
    charts: [
      { ...sampleCharts[0], id: 'home-chart-1', isBodyHidden: false }, 
      { ...sampleCharts[4], id: 'home-chart-2', isBodyHidden: false }, 
    ],
    isPinned: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'system-engagement',
    name: 'Engagement',
    type: 'system' as DashboardType,
    charts: [ { ...sampleCharts[1], id: 'eng-chart-1', isBodyHidden: false } ],
    isPinned: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'system-behaviour',
    name: 'Behaviour',
    type: 'system' as DashboardType,
    charts: [ { ...sampleCharts[4], id: 'beh-chart-1', isBodyHidden: false } ],
    isPinned: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'system-revenue',
    name: 'Revenue',
    type: 'system' as DashboardType,
    charts: [ { ...sampleCharts[0], id: 'rev-chart-1', isBodyHidden: false } ],
    isPinned: false,
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'system-comarketer',
    name: 'Co-marketer',
    type: 'system' as DashboardType,
    charts: [ { ...sampleCharts[3], id: 'com-chart-1', isBodyHidden: false } ],
    isPinned: false,
    createdAt: now,
    updatedAt: now
  },
];

// Custom dashboards
export const customDashboards: Dashboard[] = [
  allChartsDashboard,
  {
    id: 'dashboard-1',
    name: 'Conversion Metrics',
    type: 'custom' as DashboardType,
    charts: [
      { id: 'chart-1', title: 'Sample Funnel Analysis 1', description: 'An example funnel chart.', type: 'funnel', displayMode: 'chart', isFullWidth: false, isBodyHidden: false, data: { labels: ['A', 'B', 'C'], values: [100, 50, 20] }, createdAt: yesterday, updatedAt: now },
      { id: 'chart-2', title: 'Sample Behavior Analysis 2', description: 'An example behavior chart.', type: 'behavior', displayMode: 'chart', isFullWidth: false, isBodyHidden: false, data: { labels: ['X', 'Y', 'Z'], values: [10, 30, 15] }, createdAt: yesterday, updatedAt: now },
      { id: 'chart-3', title: 'Sample Rfm Analysis 3', description: 'An example RFM chart.', type: 'rfm', displayMode: 'chart', isFullWidth: false, isBodyHidden: false, data: { type: 'heatmap', xLabels: ['1', '2'], yLabels: ['A', 'B'], values: [[5, 15], [25, 10]] }, createdAt: yesterday, updatedAt: now },
    ],
    isPinned: true,
    createdAt: yesterday,
    updatedAt: now
  },
  {
    id: 'dashboard-2',
    name: 'Revenue Analysis',
    type: 'custom' as DashboardType,
    charts: [
        // Add specific sample charts if needed, ensuring they have isBodyHidden
        { ...sampleCharts[1], id: 'rev-analysis-chart-1', title: "Revenue RFM Example", isBodyHidden: false },
        { ...sampleCharts[2], id: 'rev-analysis-chart-2', title: "Revenue Cohort Example", isBodyHidden: false },
    ],
    isPinned: true,
    createdAt: yesterday,
    updatedAt: now
  },
  {
    id: 'dashboard-3',
    name: 'User Engagement',
    type: 'custom' as DashboardType,
    charts: [
        // Add specific sample charts if needed, ensuring they have isBodyHidden
        { ...sampleCharts[3], id: 'user-eng-chart-1', title: "User Path Example", isBodyHidden: false },
    ],
    isPinned: false,
    createdAt: yesterday,
    updatedAt: now
  }
].map(d => ({ // Ensure all charts in initial custom dashboards have isBodyHidden default
  ...d,
  charts: d.charts.map(c => ({ ...c, isBodyHidden: c.isBodyHidden ?? false }))
}));

// Combine all dashboards
export const mockDashboards = [...systemDashboards, ...customDashboards];

// Helper function to get a dashboard by ID
export const getDashboardById = (id: string): Dashboard | undefined => {
  return mockDashboards.find(dashboard => dashboard.id === id);
};
