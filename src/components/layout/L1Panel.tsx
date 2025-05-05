import React from 'react';
import { LayoutGrid, Volume2, Users, FileText, Search, Settings, User } from 'lucide-react'; // Updated icons

const L1Panel: React.FC = () => {

  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard' },
    { icon: Volume2, label: 'Announce' },
    { icon: Users, label: 'Audience' },
    { icon: FileText, label: 'Content' },
    { icon: Search, label: 'Analyze' },
  ];

  const bottomItems = [
    { icon: Settings, label: 'Settings' },
    // Profile is handled separately due to unique styling
  ];

  // Consistent styling for icon buttons
  const iconButtonClasses = "p-3 rounded text-netcore-pink hover:bg-netcore-blue hover:text-white focus:outline-none focus:ring-2 focus:ring-netcore-blue focus:ring-opacity-50 transition-colors duration-150";

  return (
    <nav className="fixed top-16 left-0 z-40 flex flex-col items-center w-16 h-[calc(100vh-4rem)] bg-netcore-dark-blue pb-4">
      {/* Main Navigation Icons - Takes up available space */}
      <div className="flex flex-col items-center space-y-4 flex-grow pt-4">
        {navItems.map((item, index) => (
          <button key={index} className={iconButtonClasses} aria-label={item.label}>
            <item.icon className="w-6 h-6" />
          </button>
        ))}
      </div>

      {/* Bottom Icons (Settings, Profile) */}
      <div className="flex flex-col items-center space-y-4">
        {bottomItems.map((item, index) => (
          <button key={index} className={iconButtonClasses} aria-label={item.label}>
            <item.icon className="w-6 h-6" />
          </button>
        ))}
        {/* Profile Icon with Yellow Background */}
        <button className="p-3 rounded bg-netcore-yellow text-black hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-netcore-yellow focus:ring-opacity-50 transition-opacity duration-150" aria-label="Profile">
          <User className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

export default L1Panel;