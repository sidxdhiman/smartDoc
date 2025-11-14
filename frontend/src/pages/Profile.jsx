import React from 'react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">My Profile</h1>

        {/* Profile form */}
        <div className="bg-white shadow rounded-lg p-6">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input type="text" value="John Doe" className="w-full mt-2 p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input type="email" value="john.doe@example.com" className="w-full mt-2 p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-gray-700">Phone Number</label>
              <input type="tel" value="+91 9876543210" className="w-full mt-2 p-2 border border-gray-300 rounded" />
            </div>
            <div>
              <label className="block text-gray-700">Address</label>
              <input type="text" value="123 Street Name, City, State" className="w-full mt-2 p-2 border border-gray-300 rounded" />
            </div>
            <div className="col-span-2 text-right">
              <button type="submit" className="bg-blue-900 text-white px-6 py-3 rounded shadow hover:bg-blue-800">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
