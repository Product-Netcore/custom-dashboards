import React from 'react';
import { DashboardProvider } from '@/contexts/DashboardContext';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';

const DashboardLayout: React.FC = () => {
  return (
    <DashboardProvider>
      <div className="flex flex-1 h-[calc(100vh-4rem)]">
        <div className="sticky top-0 h-full overflow-y-auto">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto bg-netcore-dashboard-bg">
          <Dashboard />
        </main>
      </div>
    </DashboardProvider>
  );
};

export default DashboardLayout;
