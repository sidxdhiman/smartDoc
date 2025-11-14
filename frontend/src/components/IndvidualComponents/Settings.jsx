import React from "react";
import { User, Shield, Bell, Clock } from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>

      {/* Profile Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <img
            src="/api/placeholder/100/100"
            alt="Profile"
            className="w-24 h-24 rounded-full mr-6 border-4 border-indigo-100"
          />
          <div>
            <h3 className="text-xl font-semibold">Raghav sharma</h3>
            <p className="text-gray-600">Raghav.sharma@example.com</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center bg-indigo-50 text-indigo-700 p-3 rounded-lg hover:bg-indigo-100">
            <User className="mr-2 h-5 w-5" /> Edit Profile
          </button>
          <button className="flex items-center justify-center bg-indigo-50 text-indigo-700 p-3 rounded-lg hover:bg-indigo-100">
            <Shield className="mr-2 h-5 w-5" /> Privacy Settings
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4">Security</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">
                Add an extra layer of security
              </p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="twoFactor"
                className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="twoFactor"
                className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              ></label>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Login Notifications</h4>
              <p className="text-sm text-gray-600">
                Get alerts for new device logins
              </p>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="loginNotify"
                className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label
                htmlFor="loginNotify"
                className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              ></label>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[{
            title: "Email Notifications",
            description: "Receive updates and alerts via email",
            icon: <Bell className="h-5 w-5 text-indigo-600 mr-3" />,
          },
          {
            title: "SMS Alerts",
            description: "Get important notifications as text messages",
            icon: <Clock className="h-5 w-5 text-green-600 mr-3" />,
          }].map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex items-center">
                {item.icon}
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id={`notify-${index}`}
                  className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor={`notify-${index}`}
                  className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border-2 border-red-100">
        <h3 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-red-700">Delete Account</h4>
              <p className="text-sm text-gray-600">
                Permanently remove your account and all data
              </p>
            </div>
            <button
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
