'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import { dataAPI } from '@/lib/api';
import { 
  Stethoscope, 
  FileText, 
  Users, 
  Pill, 
  MessageCircle,
  Activity,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState({
    totalDiagnoses: 0,
    totalReports: 0,
    totalStudents: 0,
    totalMedicines: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // You can implement actual stats fetching from your backend
        // const response = await dataAPI.getStats();
        // setStats(response.data);
        
        // For now, using mock data
        setStats({
          totalDiagnoses: 150,
          totalReports: 89,
          totalStudents: 45,
          totalMedicines: 1200,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Diagnoses',
      value: stats.totalDiagnoses,
      icon: Stethoscope,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Reports Generated',
      value: stats.totalReports,
      icon: FileText,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Active Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-purple-500',
      change: '+3%',
    },
    {
      title: 'Medicine Database',
      value: stats.totalMedicines,
      icon: Pill,
      color: 'bg-orange-500',
      change: '+15%',
    },
  ];

  const recentActivities = [
    { id: 1, type: 'diagnosis', message: 'New diagnosis completed for patient symptoms', time: '2 minutes ago' },
    { id: 2, type: 'report', message: 'Medical report generated successfully', time: '5 minutes ago' },
    { id: 3, type: 'chat', message: 'AI assistant helped with medication query', time: '10 minutes ago' },
    { id: 4, type: 'student', message: 'New student registered in the system', time: '15 minutes ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome to Karuna Healthcare Assistant</p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 text-blue-500 mr-2" />
              <p className="text-sm text-blue-800">
                <strong>New!</strong> AI Chat Assistant is now available on every page. 
                Look for the chat bubble in the bottom-right corner to get instant medical assistance.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {loading ? '...' : card.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`${card.color} p-3 rounded-full`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">{card.change}</span>
                  <span className="text-gray-500 ml-2">from last month</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <MessageCircle className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm font-medium">Start Chat</span>
              </button>
              <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Stethoscope className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">New Diagnosis</span>
              </button>
              <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-sm font-medium">Generate Report</span>
              </button>
              <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Pill className="h-5 w-5 text-orange-500 mr-2" />
                <span className="text-sm font-medium">Search Medicine</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Activity className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">API Status</span>
              <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Database</span>
              <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">AI Assistant</span>
              <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                Active
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
