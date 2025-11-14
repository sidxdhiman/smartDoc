import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { PieChart, BarChart, LineChart } from 'lucide-react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

const Analytics = () => {
  const documentDistributionData = {
    labels: ['Birth Certificates', 'Academic Records', 'Licenses', 'Other Documents'],
    datasets: [
      {
        label: 'Documents Issued',
        data: [345, 290, 135, 80],
        backgroundColor: ['#3b82f6', '#f97316', '#22c55e', '#eab308'],
      },
    ],
  };

  const verificationData = {
    labels: ['Verified', 'Pending', 'Rejected'],
    datasets: [
      {
        label: 'Verification Status',
        data: [1200, 300, 45],
        backgroundColor: ['#22c55e', '#f97316', '#ef4444'],
      },
    ],
  };

  const issuanceTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Documents Issued',
        data: [200, 250, 300, 350, 400, 420, 450, 470, 500, 520, 550, 600],
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Analytics & Insights</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 shadow-lg rounded-lg">
            <div className="flex items-center mb-2">
              <PieChart className="text-blue-900" size={20} />
              <h3 className="ml-2 text-lg font-bold text-blue-900">Document Distribution</h3>
            </div>
            <div className="h-64">
              <Pie data={documentDistributionData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white p-4 shadow-lg rounded-lg">
            <div className="flex items-center mb-2">
              <BarChart className="text-yellow-500" size={20} />
              <h3 className="ml-2 text-lg font-bold text-blue-900">Verification Status</h3>
            </div>
            <div className="h-64">
              <Bar data={verificationData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white p-4 shadow-lg rounded-lg md:col-span-2">
            <div className="flex items-center mb-2">
              <LineChart className="text-green-500" size={20} />
              <h3 className="ml-2 text-lg font-bold text-blue-900">Document Issuance Trend (2024)</h3>
            </div>
            <div className="h-80">
              <Line data={issuanceTrendData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;