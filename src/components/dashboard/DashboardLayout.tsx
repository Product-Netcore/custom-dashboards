import React from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex flex-1 h-full">
      <div className="sticky top-0 h-full overflow-y-auto overscroll-contain-y">
      <Sidebar />
      </div>
      <main className="flex-1 h-full overflow-hidden">
      <Dashboard />
      </main>
    </div>
  );
};

export default DashboardLayout;
