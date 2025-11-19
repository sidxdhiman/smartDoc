import React, { useState } from "react";
import { User, Shield, Bell, Clock, Trash2 } from "lucide-react";

// Assuming this component is located at: src/components/individualComponents/Settings.jsx
const Settings = ({ user }) => {
  // Use state to manage the functional toggles
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifyEnabled, setLoginNotifyEnabled] = useState(true);
  const [emailNotifyEnabled, setEmailNotifyEnabled] = useState(true);
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(false);

  // Fallback for user data in case it's loading or partially defined
  const userName =
    user?.name || user?.email?.split("@")[0] || "Authenticated User";
  const userEmail = user?.email || "No Email Provided";

  const handleToggle = (setter, currentValue) => {
    setter(!currentValue);
  };

  const handleAccountAction = (action) => {
    // Placeholder for actual navigation or modal open logic
    console.log(`Action requested: ${action}`);
    if (action === "delete") {
      alert("Account deletion is not yet implemented."); // Use an alert for demonstration
    } else {
      alert(`Navigating to ${action} management...`);
    }
  };

  // Helper component for the toggle switch styling
  const ToggleSwitch = ({ id, isChecked, onChange }) => (
    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
      <input
        type="checkbox"
        name={id}
        id={id}
        checked={isChecked}
        onChange={onChange}
        className={`toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer ${
          isChecked ? "right-0 border-indigo-500" : "border-gray-300"
        }`}
      />
      <label
        htmlFor={id}
        className={`block overflow-hidden h-6 rounded-full ${
          isChecked ? "bg-indigo-500" : "bg-gray-300"
        } cursor-pointer`}
      ></label>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
        <User className="inline-block w-7 h-7 mr-3 text-indigo-600" /> Account
        Settings
      </h2>

      {/* Profile Section - DYNAMIC */}
      <div className="bg-white rounded-xl shadow-lg p-8 transform hover:scale-[1.01] transition duration-300">
        <div className="flex items-center mb-6">
          <img
            src={`https://placehold.co/96x96/4f46e5/ffffff?text=${userName.charAt(0)}`}
            alt={`${userName} Profile`}
            className="w-24 h-24 rounded-full mr-6 border-4 border-indigo-200 object-cover"
          />
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{userName}</h3>
            <p className="text-indigo-600 font-medium">{userEmail}</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => handleAccountAction("profile")}
            className="flex items-center justify-center bg-indigo-50 text-indigo-700 p-3 rounded-xl font-medium hover:bg-indigo-100 transition duration-150 transform hover:shadow-md"
          >
            <User className="mr-2 h-5 w-5" /> Edit Profile
          </button>
          <button
            onClick={() => handleAccountAction("privacy")}
            className="flex items-center justify-center bg-indigo-50 text-indigo-700 p-3 rounded-xl font-medium hover:bg-indigo-100 transition duration-150 transform hover:shadow-md"
          >
            <Shield className="mr-2 h-5 w-5" /> Privacy Settings
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-semibold mb-6 border-b pb-3 flex items-center">
          <Shield className="h-6 w-6 mr-3 text-red-500" /> Security
        </h3>
        <div className="space-y-6">
          <div className="flex justify-between items-start md:items-center p-3 rounded-lg hover:bg-gray-50 transition">
            <div>
              <h4 className="font-medium text-lg">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">
                Add an extra layer of security when logging in.
              </p>
            </div>
            <ToggleSwitch
              id="twoFactor"
              isChecked={twoFactorEnabled}
              onChange={() =>
                handleToggle(setTwoFactorEnabled, twoFactorEnabled)
              }
            />
          </div>

          <div className="flex justify-between items-start md:items-center p-3 rounded-lg hover:bg-gray-50 transition">
            <div>
              <h4 className="font-medium text-lg">Login Notifications</h4>
              <p className="text-sm text-gray-600">
                Get email alerts for new device logins.
              </p>
            </div>
            <ToggleSwitch
              id="loginNotify"
              isChecked={loginNotifyEnabled}
              onChange={() =>
                handleToggle(setLoginNotifyEnabled, loginNotifyEnabled)
              }
            />
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-semibold mb-6 border-b pb-3 flex items-center">
          <Bell className="h-6 w-6 mr-3 text-yellow-500" /> Notification
          Preferences
        </h3>
        <div className="space-y-6">
          {[
            {
              title: "Email Notifications",
              description: "Receive updates and alerts via email",
              icon: <Bell className="h-5 w-5 text-indigo-600 mr-3" />,
              state: emailNotifyEnabled,
              setter: setEmailNotifyEnabled,
            },
            {
              title: "SMS Alerts",
              description: "Get important notifications as text messages",
              icon: <Clock className="h-5 w-5 text-green-600 mr-3" />,
              state: smsAlertsEnabled,
              setter: setSmsAlertsEnabled,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-start md:items-center p-3 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex items-center">
                {item.icon}
                <div>
                  <h4 className="font-medium text-lg">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
              <ToggleSwitch
                id={`notify-${index}`}
                isChecked={item.state}
                onChange={() => handleToggle(item.setter, item.state)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-red-200">
        <h3 className="text-2xl font-semibold text-red-600 mb-4 flex items-center">
          <Trash2 className="h-6 w-6 mr-3" /> Danger Zone
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
            <div>
              <h4 className="font-medium text-red-700 text-lg">
                Delete Account
              </h4>
              <p className="text-sm text-gray-600">
                Permanently remove your account and all associated data. This
                action cannot be undone.
              </p>
            </div>
            <button
              onClick={() => handleAccountAction("delete")}
              className="bg-red-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-red-700 transition duration-150 transform hover:scale-105 shadow-md"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
      {/* Tailwind CSS for Custom Toggle Styling */}
      <style jsx>{`
        .toggle-checkbox:checked {
          /* Add indigo background to the label when checked */
          right: 0;
          transition: right 0.2s ease-in;
        }
        .toggle-checkbox:checked + label {
          background-color: #4f46e5; /* indigo-600 */
        }
      `}</style>
    </div>
  );
};

export default Settings;
