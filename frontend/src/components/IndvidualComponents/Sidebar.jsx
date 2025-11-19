import React from "react";
import { Home, FileText, Search, Settings, LogOut } from "lucide-react";

// Assuming this component receives selectedTab, setSelectedTab, and handleLogout as props
const Sidebar = ({ selectedTab, setSelectedTab, handleLogout }) => {
  const navItems = [
    { name: "Home", icon: Home, tab: "home" },
    { name: "My Documents", icon: FileText, tab: "documents" },
    { name: "Search", icon: Search, tab: "search" },
    { name: "Settings", icon: Settings, tab: "settings" },
  ];

  return (
    <nav className="flex flex-col w-64 bg-indigo-700 text-white p-6 shadow-2xl">
      {/* Logo/Title */}
      <div className="text-3xl font-extrabold mb-10 text-indigo-200">
        SmartDoc
      </div>

      {/* Navigation Links */}
      <div className="flex-1 space-y-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = selectedTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setSelectedTab(item.tab)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
                                ${
                                  isActive
                                    ? "bg-indigo-600 text-white shadow-lg"
                                    : "text-indigo-200 hover:bg-indigo-600/50 hover:text-white"
                                }
                            `}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Logout Button (FIXED) */}
      <div className="mt-8 pt-4 border-t border-indigo-600">
        <button
          onClick={handleLogout} // <-- The FIX: Adding the onClick handler
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-indigo-100 bg-indigo-600/30 hover:bg-red-500 hover:text-white font-medium"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
