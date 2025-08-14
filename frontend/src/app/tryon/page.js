'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Play, Download, Eye, Clock, CheckCircle, XCircle, User, Shirt, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const TryOn = () => {
  const router = useRouter();
  const [models, setModels] = useState([]);
  const [clothes, setClothes] = useState([]);
  const [tryOnTasks, setTryOnTasks] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedCloth, setSelectedCloth] = useState('');
  const [selectedMode, setSelectedMode] = useState('cloth');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [previewTask, setPreviewTask] = useState(null);

  const tryOnModes = [
    { value: 'cloth', label: 'Cloth Try-On', description: 'Try on clothing items' },
    { value: 'pose', label: 'Pose Transfer', description: 'Transfer pose from reference' }
  ];

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Set axios default header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    fetchData();
    
    // Set up polling for pending tasks
    const pollInterval = setInterval(() => {
      checkPendingTasks();
    }, 3000); // Poll every 3 seconds
    
    return () => clearInterval(pollInterval);
  }, [router]);

  // Function to check pending tasks
  const checkPendingTasks = async () => {
    try {
      const pendingTasks = tryOnTasks.filter(task => 
        task.status === 'CREATED' || task.status === 'PROCESSING'
      );
      
      if (pendingTasks.length === 0) return;
      
      console.log(`🔄 Checking ${pendingTasks.length} pending tasks...`);
      
      // Check each pending task
      for (const task of pendingTasks) {
        try {
          const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const response = await axios.get(`${baseURL}/api/tryon/${task.id}`);
          const updatedTask = response.data.data.task;
          
          // Update the task in state if status changed
          setTryOnTasks(prevTasks => 
            prevTasks.map(t => 
              t.id === task.id ? {
                ...t,
                status: updatedTask.status,
                progress: updatedTask.progress,
                result: updatedTask.result
              } : t
            )
          );
          
          // Show notification for completed tasks
          if (updatedTask.status === 'COMPLETED' && task.status !== 'COMPLETED') {
            toast.success(`Try-on task completed! 🎉`);
          } else if (updatedTask.status === 'FAILED' && task.status !== 'FAILED') {
            toast.error(`Try-on task failed. Please try again.`);
          }
        } catch (error) {
          console.error(`Error checking task ${task.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error checking pending tasks:', error);
    }
  };

  const fetchData = async () => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const [modelsRes, clothesRes, tasksRes] = await Promise.all([
        axios.get(`${baseURL}/api/models`),
        axios.get(`${baseURL}/api/clothes`),
        axios.get(`${baseURL}/api/tryon/list`)
      ]);
      
      // Map validation status for models
      const modelsData = modelsRes.data.data?.assets || [];
      const mappedModels = modelsData.map(model => ({
        ...model,
        validationStatus: model.validation?.isValid === true ? 'valid' : 
                         model.validation?.isValid === false ? 'invalid' : 'pending'
      }));
      
      // Map validation status for clothes
      const clothesData = clothesRes.data.data?.assets || [];
      const mappedClothes = clothesData.map(cloth => ({
        ...cloth,
        validationStatus: cloth.validation?.isValid === true ? 'valid' : 
                         cloth.validation?.isValid === false ? 'invalid' : 'pending'
      }));
      
      // Map try-on tasks with proper result handling
      const tasksData = tasksRes.data.data?.tasks || [];
      const mappedTasks = tasksData.map(task => {
        // Handle different possible result structures
        let resultImageUrl = null;
        if (task.result) {
          resultImageUrl = task.result.resultImageUrl || 
                          task.result.fileUrl || 
                          task.result.asset?.fileUrl ||
                          task.result.resultAssetId?.fileUrl ||
                          null;
        }
        
        return {
          ...task,
          // Ensure result field is properly mapped
          result: task.result ? {
            ...task.result,
            resultImageUrl: resultImageUrl
          } : null,
          // Add resultUrl for preview if result exists
          resultUrl: resultImageUrl
        };
      });
      
      setModels(mappedModels);
      setClothes(mappedClothes);
      setTryOnTasks(mappedTasks);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(`Failed to fetch data: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTryOn = async () => {
    if (!selectedModel || !selectedCloth) {
      toast.error('Please select both a model and clothing item');
      return;
    }

    setCreating(true);
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${baseURL}/api/tryon`, {
        modelAssetId: selectedModel,
        clothAssetIds: [selectedCloth],
        clothType: 'upper',
        mode: 'single'
      });
      
      toast.success('Try-on task created successfully! Processing will start shortly...');
      setSelectedModel('');
      setSelectedCloth('');
      
      // Refresh data to show the new task
      await fetchData();
      
      // Start checking the new task immediately
      setTimeout(() => {
        checkPendingTasks();
      }, 1000);
      
    } catch (error) {
      console.error('Error creating try-on:', error);
      const message = error.response?.data?.error || 'Failed to create try-on task';
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  const handleDownloadResult = async (taskId) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${baseURL}/api/tryon/${taskId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `try-on-result-${taskId}.jpg`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Result downloaded successfully!');
    } catch (error) {
      console.error('Error downloading result:', error);
      const message = error.response?.data?.error || 'Failed to download result';
      toast.error(message);
    }
  };

  const getStatusIcon = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'cloth':
        return <Shirt className="w-4 h-4" />;
      case 'pose':
        return <User className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getValidModels = () => {
    return models.filter(model => model.validationStatus === 'valid');
  };

  const getValidClothes = () => {
    return clothes.filter(cloth => cloth.validationStatus === 'valid');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const validModels = getValidModels();
  const validClothes = getValidClothes();

  return (
    <div className="max-w-7xl mx-auto p-6 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#26140c] mb-2">Virtual Try-On</h1>
        <p className="text-[#aa7156]">
          Create virtual try-on experiences by combining your models and clothing items.
        </p>
      </div>

      {/* Create Try-On Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-[#26140c] mb-6">
          Create New Try-On
        </h2>
        
        {validModels.length === 0 || validClothes.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Missing Requirements
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    You need at least one validated model and one validated clothing item to create a try-on.
                  </p>
                  <ul className="list-disc list-inside mt-1">
                    <li>Valid models: {validModels.length}</li>
                    <li>Valid clothes: {validClothes.length}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Try-On Mode
              </label>
              <div className="space-y-2">
                {tryOnModes.map((mode) => (
                  <label key={mode.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="mode"
                      value={mode.value}
                      checked={selectedMode === mode.value}
                      onChange={(e) => setSelectedMode(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex items-center">
                      {getModeIcon(mode.value)}
                      <div className="ml-2">
                        <div className="font-medium text-gray-900">{mode.label}</div>
                        <div className="text-sm text-gray-500">{mode.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Model
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {validModels.map((model) => (
                  <label key={model.id || model._id} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="model"
                    value={model.id || model._id}
                    checked={selectedModel === (model.id || model._id)}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="mr-3"
                    />
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${model.fileUrl}`}
                      alt={model.originalName}
                      className="w-12 h-12 object-cover rounded-lg mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {model.metadata?.name || model.originalName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {model.metadata?.gender || 'Unknown'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Cloth Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Clothing
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {validClothes.map((cloth) => (
                  <label key={cloth.id || cloth._id} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="cloth"
                    value={cloth.id || cloth._id}
                    checked={selectedCloth === (cloth.id || cloth._id)}
                      onChange={(e) => setSelectedCloth(e.target.value)}
                      className="mr-3"
                    />
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${cloth.fileUrl}`}
                      alt={cloth.originalName}
                      className="w-12 h-12 object-cover rounded-lg mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {cloth.metadata?.name || cloth.originalName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {cloth.metadata?.category?.replace('_', ' ') || 'Unknown'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {validModels.length > 0 && validClothes.length > 0 && (
          <div className="mt-6">
            <button
              onClick={handleCreateTryOn}
              disabled={!selectedModel || !selectedCloth || creating}
              className="bg-[#26140c] text-white px-6 py-3 rounded-lg hover:bg-[#aa7156] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Try-On...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Create Try-On
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Try-On Tasks */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#26140c]">
            Try-On History ({tryOnTasks.length})
          </h2>
        </div>

        {tryOnTasks.length > 0 ? (
          <div className="space-y-4">
            {tryOnTasks.map((task) => (
              <div key={task.id || task._id || task.taskId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Status Icon and Progress */}
                    <div className="flex-shrink-0">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(task.status)}
                        {(task.status?.toLowerCase() === 'processing' || task.status?.toLowerCase() === 'created') && (
                          <div className="w-24">
                            <div className="bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${task.progress || 0}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {task.progress || 0}%
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Result Image Thumbnail */}
                    {task.status?.toLowerCase() === 'completed' && task.result?.resultImageUrl && (
                      <div className="flex-shrink-0">
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${task.result.resultImageUrl}`}
                          alt="Virtual Try-On Result"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                          onError={(e) => {
                            console.error('Failed to load thumbnail:', e.target.src);
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Task Info */}
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Try-On Task #{task.taskId?.slice(-8) || 'Unknown'}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)} capitalize`}>
                          {task.status?.toLowerCase() || 'pending'}
                        </span>
                        <span>•</span>
                        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {task.status?.toLowerCase() === 'completed' && (
                      <>
                        <button
                          onClick={() => setPreviewTask(task)}
                          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadResult(task.id)}
                          className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No try-on tasks yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first virtual try-on to see results here.
            </p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Try-On Result #{previewTask.taskId?.slice(-8)}
                </h3>
                <button
                  onClick={() => setPreviewTask(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              {previewTask.result?.resultImageUrl && (
                <div className="mb-4">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${previewTask.result.resultImageUrl}`}
                    alt="Virtual Try-On Result"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              )}
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => handleDownloadResult(previewTask.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Result
                </button>
                <button
                  onClick={() => setPreviewTask(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TryOn;