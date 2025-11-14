import React from "react";
import { Home, FileText, Search, HardDrive, Settings, User, LogOut } from "lucide-react";

const Sidebar = ({ selectedTab, setSelectedTab }) => {
  const navigation = [
    { name: "Home", icon: Home, tab: "home" },
    { name: "Documents", icon: FileText, tab: "documents" },
    { name: "Search", icon: Search, tab: "search" },
    { name: "Settings", icon: Settings, tab: "settings" },
  ];

  return (
    <aside className="w-64 bg-indigo-700 text-white shadow-xl">
      <div className="h-full flex flex-col py-8">
        {/* Logo Section */}
        <div className="px-6 mb-10">
          <div className="flex items-center justify-center space-x-3">
            <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <img src="/icon.png" className="w-10 h-10 rounded-md" alt="Logo" />
            </div>
            <span className="text-2xl font-bold tracking-tight">SmartDoc</span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4">
          <div className="space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => setSelectedTab(item.tab)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  selectedTab === item.tab
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-indigo-100 hover:bg-indigo-600/50 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="px-4 mt-6 space-y-1">
          <div className="h-px bg-indigo-600/50 my-4" />
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-indigo-100 hover:bg-indigo-600/50 hover:text-white">
            <User className="h-5 w-5" />
            <span className="font-medium">Profile</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-indigo-100 hover:bg-indigo-600/50 hover:text-white">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
