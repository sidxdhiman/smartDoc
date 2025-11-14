import React from "react";
import { Bell } from "lucide-react";

const Header = () => (
  <header className="flex justify-between items-center mb-8">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Welcome, User</h1>
      <p className="text-gray-600 mt-1">Manage your digital documents securely</p>
    </div>
    <div className="flex items-center space-x-4">
      <button className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow">
        <Bell className="h-5 w-5 text-indigo-600" />
      </button>
      <img
        src="/api/placeholder/100/100"
        alt="Profile"
        className="h-10 w-10 rounded-full border-2 border-indigo-500"
      />
    </div>
  </header>
);

export default Header;
