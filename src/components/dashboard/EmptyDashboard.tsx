import React from 'react';
import { 
  Target,       // For Funnel analysis
  Users,        // For Cohort analysis
  Activity,     // For Behavior analysis
  LineChart,    // For RFM analysis
  GitBranch     // For User Path analysis
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { ChartType } from '@/types/dashboard';

interface EmptyDashboardProps {
  onAddAnalysis: (type?: ChartType) => void;
}

const EmptyDashboard: React.FC<EmptyDashboardProps> = ({ onAddAnalysis }) => {
  const analysisTiles = [
    {
      title: 'Funnel analysis',
      icon: Target,
      type: 'funnel' as ChartType,
      tooltip: 'Track conversion steps and drop-offs across journeys'
    },
    {
      title: 'RFM analysis',
      icon: LineChart,
      type: 'rfm' as ChartType,
      tooltip: 'Segment customers by recency, frequency, and monetary value'
    },
    {
      title: 'Cohort analysis',
      icon: Users,
      type: 'cohort' as ChartType,
      tooltip: 'Measure retention across cohorts and time intervals'
    },
    {
      title: 'User Path analysis',
      icon: GitBranch,
      type: 'userPath' as ChartType,
      tooltip: 'Visualize user journeys through your product'
    },
    {
      title: 'Behavior analysis',
      icon: Activity,
      type: 'behavior' as ChartType,
      tooltip: 'View user interactions like sessions, clicks, and events'
    }
  ];

  return (
    <div className="flex-1">
      <h1 className="text-2xl font-semibold text-foreground mb-8">Add your first analysis</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {analysisTiles.map((tile, index) => {
          const Icon = tile.icon;
          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card 
                    className="cursor-pointer transition-all hover:shadow-lg hover:border-netcore-blue"
                    onClick={() => onAddAnalysis(tile.type)}
                  >
                    <CardContent className="p-6 flex flex-col items-center space-y-4">
                      <Icon className="w-12 h-12 text-netcore-blue" />
                      <h3 className="text-lg font-medium">+ {tile.title}</h3>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tile.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
};

export default EmptyDashboard;
