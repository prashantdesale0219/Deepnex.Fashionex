'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Upload, User, Trash2, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardErrorBoundary from '@/components/dashboard/DashboardErrorBoundary';
import { getAuthToken } from '../../lib/cookieUtils';
import Image from 'next/image';

// Models component content
const ModelsContent = () => {
  const router = useRouter();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  useEffect(() => {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Set axios default header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    fetchModels();
  }, [router]);

  const fetchModels = async () => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${baseURL}/api/models`);
      const modelsData = response.data.data?.assets || [];
      // Map validation status properly
      const mappedModels = modelsData.map(model => ({
        ...model,
        validationStatus: model.validation?.isValid === true ? 'valid' : 
                         model.validation?.isValid === false ? 'invalid' : 'pending'
      }));
      setModels(mappedModels);
    } catch (error) {
      console.error('Error fetching models:', error);
      toast.error('Failed to fetch models');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('model', file);

    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await axios.post(`${baseURL}/api/models/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Model uploaded successfully!');
      fetchModels(); // Refresh the list
    } catch (error) {
      console.error('Error uploading model:', error);
      const message = error.response?.data?.error || 'Failed to upload model';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  const handleDelete = async (modelId) => {
    if (!window.confirm('Are you sure you want to delete this model?')) {
      return;
    }

    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      await axios.delete(`${baseURL}/api/models/${modelId}`);
      toast.success('Model deleted successfully!');
      fetchModels();
    } catch (error) {
      console.error('Error deleting model:', error);
      const message = error.response?.data?.error || 'Failed to delete model';
      toast.error(message);
    }
  };

  const handleValidate = async (modelId) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${baseURL}/api/models/${modelId}/revalidate`);
      
      // Update the model status immediately based on response
      setModels(prevModels => 
        prevModels.map(model => {
          if ((model.id || model._id) === modelId) {
            return {
              ...model,
              validationStatus: response.data.validation?.isValid === true ? 'valid' : 
                              response.data.validation?.isValid === false ? 'invalid' : 'pending'
            };
          }
          return model;
        })
      );
      
      toast.success('Model validation completed!');
    } catch (error) {
      console.error('Error validating model:', error);
      const message = error.response?.data?.error || 'Failed to validate model';
      toast.error(message);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'invalid':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'valid':
        return 'text-green-600 bg-green-100';
      case 'invalid':
        return 'text-red-600 bg-red-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#26140c] mb-2">Model Management</h1>
        <p className="text-[#aa7156]">
          Upload and manage your model photos for virtual try-on experiences.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-[#26140c] mb-4">
          Upload New Model
        </h2>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} disabled={uploading} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-gray-600">Uploading model...</p>
            </div>
          ) : isDragActive ? (
            <p className="text-blue-600 font-medium">
              Drop the image here...
            </p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Drag & drop a model image here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports: JPG, PNG, WEBP (Max 50MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Models Grid */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#26140c]">
            Your Models ({models.length})
          </h2>
        </div>

        {models.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {models.map((model) => (
              <div key={model.id || model._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="relative aspect-square group">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${model.fileUrl}`}
                    alt={model.originalName}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-model.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setSelectedModel(model)}
                      className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(model.id || model._id)}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {model.originalName}
                    </h3>
                    {getStatusIcon(model.validationStatus)}
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(model.validationStatus)} capitalize`}>
                      {model.validationStatus || 'pending'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {(model.fileSize / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    {model.validationStatus !== 'valid' && model.validationStatus !== 'processing' && (
                      <button
                        onClick={() => handleValidate(model.id || model._id)}
                        className="flex-1 bg-[#26140c] text-white text-xs py-2 px-3 rounded-md hover:bg-[#aa7156] transition-colors"
                      >
                        Validate
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedModel(model)}
                      className="flex-1 bg-[#aa7156] text-white text-xs py-2 px-3 rounded-md hover:bg-[#26140c] transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No models uploaded yet
            </h3>
            <p className="text-gray-600 mb-6">
              Upload your first model to get started with virtual try-on.
            </p>
          </div>
        )}
      </div>

      {/* Model Preview Modal */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedModel.originalName}
                </h3>
                <button
                  onClick={() => setSelectedModel(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${selectedModel.fileUrl}`}
                  alt={selectedModel.originalName}
                  width={500}
                  height={300}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedModel.validationStatus)} capitalize`}>
                    {selectedModel.validationStatus || 'pending'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">File Size:</span>
                  <span className="ml-2 text-gray-600">
                    {(selectedModel.fileSize / (1024 * 1024)).toFixed(1)} MB
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Uploaded:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(selectedModel.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="ml-2 text-gray-600">
                    {selectedModel.type}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                {selectedModel.validationStatus !== 'valid' && selectedModel.validationStatus !== 'processing' && (
                  <button
                    onClick={() => {
                        handleValidate(selectedModel.id || selectedModel._id);
                        setSelectedModel(null);
                      }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Validate Model
                  </button>
                )}
                <button
                  onClick={() => {
                    handleDelete(selectedModel.id || selectedModel._id);
                    setSelectedModel(null);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete Model
                </button>
                <button
                  onClick={() => setSelectedModel(null)}
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

// Wrap the models content with error boundary
const Models = () => {
  return (
    <DashboardErrorBoundary>
      <ModelsContent />
    </DashboardErrorBoundary>
  );
};

export default Models;