import { ChartType } from '@/types/dashboard';

// Interface for a single view option
export interface ViewOption {
  label: string; // The text displayed in the dropdown, e.g., "Steps Chart"
  // We can add more properties here later if needed, e.g., 
  // a value to map to a specific rendering function or a sub-type.
  // For now, the label itself can act as the unique identifier for selection.
}

// A map where keys are ChartType and values are arrays of ViewOption
const analysisSpecificViewOptions: Partial<Record<ChartType, ViewOption[]>> = {
  funnel: [
    { label: "Steps Chart" },
    { label: "Steps Table" },
    { label: "Conversion Chart" },
    { label: "Conversion Table" },
  ],
  rfm: [
    { label: "Table" },
    { label: "Transition Table" },
    { label: "Recency chart" },
    { label: "Frequency chart" },
    { label: "Monetary chart" },
    { label: "Recency table" },
    { label: "Frequency table" },
    { label: "Monetary table" },
  ],
  cohort: [
    { label: "Line Chart" },
    { label: "Tabular View" },
  ],
  userPath: [
    { label: "Chart" },
  ],
  // We will add other analysis types like 'cohort' here later
  // Example:
  // rfm: [
  //   { label: "RFM Grid" },
  //   { label: "RFM Table" },
  // ],
};

// Helper function to get the view options for a given chart type
export const getChartViewOptions = (type: ChartType): ViewOption[] => {
  const specificOptions = analysisSpecificViewOptions[type];
  if (specificOptions && specificOptions.length > 0) {
    return specificOptions;
  }
  // Fallback to generic options if no specific options are defined for the type
  // Or if the specific options array is empty
  return [
    { label: "Chart" },
    { label: "Table" },
    { label: "Chart + Table" }, // This corresponds to 'chart_kpi' in the old displayMode
  ];
};

// Helper to get the default/initial view label for a chart
export const getDefaultViewLabel = (chartType: ChartType, currentDisplayMode: string): string => {
  const options = getChartViewOptions(chartType);
  // If specific options exist for this chart type (meaning it's not using the fallback generic ones),
  // return the first specific option as the default label.
  if (analysisSpecificViewOptions[chartType] && analysisSpecificViewOptions[chartType]!.length > 0 && options.length > 0) {
    return options[0].label;
  }
  // Otherwise, map from the old generic displayMode for charts that don't have specific views defined yet
  switch (currentDisplayMode) {
    case 'chart':
      return "Chart";
    case 'table':
      return "Table";
    case 'chart_kpi': // Assuming 'chart_kpi' was the value for "Chart + Table"
      return "Chart + Table";
    default:
      // Fallback if currentDisplayMode is unexpected or options list is empty for some reason
      return options.length > 0 ? options[0].label : "View"; 
  }
}; 