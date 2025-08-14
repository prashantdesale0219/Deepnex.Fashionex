'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { User, Shirt, Zap, Plus, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import DashboardErrorBoundary from '@/components/dashboard/DashboardErrorBoundary';

// Dashboard component wrapped with error boundary
const DashboardContent = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    models: 0,
    clothes: 0,
    tryons: 0,
    recentTasks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication and get user data
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Set axios default header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Get user data from localStorage or make API call
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const [modelsRes, clothesRes, tryonsRes] = await Promise.all([
        axios.get(`${baseURL}/api/models`),
        axios.get(`${baseURL}/api/clothes`),
        axios.get(`${baseURL}/api/tryon/list?limit=5`).catch(() => ({ data: { data: { tasks: [], total: 0 } } }))
      ]);

      setStats({
        models: modelsRes.data.data?.assets?.length || 0,
        clothes: clothesRes.data.data?.assets?.length || 0,
        tryons: tryonsRes.data.data?.tasks?.length || tryonsRes.data.data?.total || 0,
        recentTasks: tryonsRes.data.data?.tasks || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const quickActions = [
    {
      title: 'Upload Model',
      description: 'Add a new model photo',
      icon: <User className="w-8 h-8" />,
      link: '/models',
      color: 'bg-[#26140c] hover:bg-[#aa7156]'
    },
    {
      title: 'Upload Clothes',
      description: 'Add clothing items',
      icon: <Shirt className="w-8 h-8" />,
      link: '/clothes',
      color: 'bg-[#aa7156] hover:bg-[#26140c]'
    },
    {
      title: 'Create Try-On',
      description: 'Start virtual try-on',
      icon: <Zap className="w-8 h-8" />,
      link: '/tryon',
      color: 'bg-[#26140c] hover:bg-[#aa7156]'
    }
  ];

  const statCards = [
    {
      title: 'Models',
      value: stats.models,
      icon: <User className="w-8 h-8 text-blue-600" />,
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Clothes',
      value: stats.clothes,
      icon: <Shirt className="w-8 h-8 text-green-600" />,
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Try-Ons',
      value: stats.tryons,
      icon: <Zap className="w-8 h-8 text-purple-600" />,
      change: '+23%',
      changeType: 'increase'
    },
    {
      title: 'Success Rate',
      value: '94%',
      icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
      change: '+2%',
      changeType: 'increase'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 w-full">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#26140c]">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-[#aa7156] mt-2">
          Here's what's happening with your virtual try-on projects today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#26140c] mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.link}
                  className={`${action.color} text-white p-6 rounded-lg transition-colors duration-200 block`}
                >
                  <div className="flex flex-col items-center text-center">
                    {action.icon}
                    <h3 className="text-lg font-semibold mt-3">{action.title}</h3>
                    <p className="text-sm opacity-90 mt-1">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#26140c]">
                Recent Try-On Tasks
              </h2>
              <Link
                href="/tryon"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View all
              </Link>
            </div>
            
            {stats.recentTasks.length > 0 ? (
              <div className="space-y-4">
                {stats.recentTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white rounded-lg">
                        <Zap className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Try-On Task #{task.taskId?.slice(-8) || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {task.mode} mode • {task.clothType}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)} capitalize`}>
                        {task.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No recent try-on tasks</p>
                <Link
                  href="/tryon"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Try-On
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Tips & Getting Started */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#26140c] mb-4">
              Getting Started
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Upload Models</p>
                  <p className="text-sm text-gray-600">Add clear, well-lit photos of models</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Add Clothing</p>
                  <p className="text-sm text-gray-600">Upload clothing items you want to try on</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full mt-0.5"></div>
                <div>
                  <p className="font-medium text-gray-900">Create Try-On</p>
                  <p className="text-sm text-gray-600">Combine models and clothes for virtual try-on</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#26140c] mb-4">
              Tips for Best Results
            </h2>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  📸 Use high-quality, well-lit photos for better AI results
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  👕 Ensure clothing items are clearly visible and unwrinkled
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">
                  🎯 Choose the right clothing type for accurate fitting
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap the dashboard content with error boundary
const Dashboard = () => {
  return (
    <DashboardErrorBoundary>
      <DashboardContent />
    </DashboardErrorBoundary>
  );
};

export default Dashboard;