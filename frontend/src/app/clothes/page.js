'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import apiClient from '../../lib/apiClient';
import { toast } from 'react-toastify';
import { Upload, Shirt, Trash2, Eye, CheckCircle, XCircle, Clock, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '../../lib/cookieUtils';
import Image from 'next/image';

const Clothes = () => {
  const router = useRouter();
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCloth, setSelectedCloth] = useState(null);
  const [editingCloth, setEditingCloth] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', category: '' });

  const clothingCategories = [
    'upper_body',
    'lower_body',
    'dresses',
    'outerwear',
    'accessories'
  ];

  useEffect(() => {
    // Check authentication
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Set axios default header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    fetchClothes();
  }, [router]);

  const fetchClothes = async () => {
    try {
      const response = await apiClient.get('/clothes');
      const clothesData = response.data.data?.assets || [];
      // Map validation status properly
      const mappedClothes = clothesData.map(cloth => ({
        ...cloth,
        validationStatus: cloth.validation?.isValid === true ? 'valid' : 
                         cloth.validation?.isValid === false ? 'invalid' : 'pending'
      }));
      setClothes(mappedClothes);
    } catch (error) {
      console.error('Error fetching clothes:', error);
      toast.error('Failed to fetch clothes');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    // Handle multiple files
    if (acceptedFiles.length === 1) {
      formData.append('cloth', acceptedFiles[0]);
      try {
        await apiClient.post('/clothes/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Cloth uploaded successfully!');
      } catch (error) {
        console.error('Error uploading cloth:', error);
        const message = error.response?.data?.error || 'Failed to upload cloth';
        toast.error(message);
      }
    } else {
      // Multiple files
      acceptedFiles.forEach(file => {
        formData.append('clothes', file);
      });
      try {
        await apiClient.post('/clothes/upload-multiple', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success(`${acceptedFiles.length} clothes uploaded successfully!`);
      } catch (error) {
        console.error('Error uploading clothes:', error);
        const message = error.response?.data?.error || 'Failed to upload clothes';
        toast.error(message);
      }
    }

    setUploading(false);
    fetchClothes();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  });

  const handleDelete = async (clothId) => {
    if (!window.confirm('Are you sure you want to delete this cloth?')) {
      return;
    }

    try {
      await apiClient.delete(`/clothes/${clothId}`);
      toast.success('Cloth deleted successfully!');
      fetchClothes();
    } catch (error) {
      console.error('Error deleting cloth:', error);
      const message = error.response?.data?.error || 'Failed to delete cloth';
      toast.error(message);
    }
  };

  const handleValidate = async (clothId) => {
    try {
      const response = await apiClient.post(`/clothes/${clothId}/revalidate`);
      
      // Update the cloth status immediately based on response
      setClothes(prevClothes => 
        prevClothes.map(cloth => {
          if ((cloth.id || cloth._id) === clothId) {
            return {
              ...cloth,
              validationStatus: response.data.validation?.isValid === true ? 'valid' : 
                              response.data.validation?.isValid === false ? 'invalid' : 'pending'
            };
          }
          return cloth;
        })
      );
      
      toast.success('Cloth validation completed!');
    } catch (error) {
      console.error('Error validating cloth:', error);
      const message = error.response?.data?.error || 'Failed to validate cloth';
      toast.error(message);
    }
  };

  const handleEdit = (cloth) => {
    setEditingCloth(cloth.id || cloth._id);
    setEditForm({
      name: cloth.metadata?.name || cloth.originalName,
      category: cloth.metadata?.category || ''
    });
  };

  const handleSaveEdit = async () => {
    try {
      await apiClient.put(`/clothes/${editingCloth}`, {
        metadata: editForm
      });
      toast.success('Cloth updated successfully!');
      setEditingCloth(null);
      fetchClothes();
    } catch (error) {
      console.error('Error updating cloth:', error);
      const message = error.response?.data?.error || 'Failed to update cloth';
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

  const getCategoryColor = (category) => {
    const colors = {
      upper_body: 'bg-blue-100 text-blue-800',
      lower_body: 'bg-green-100 text-green-800',
      dresses: 'bg-purple-100 text-purple-800',
      outerwear: 'bg-orange-100 text-orange-800',
      accessories: 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
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
        <h1 className="text-3xl font-bold text-[#26140c] mb-2">Clothing Management</h1>
        <p className="text-[#aa7156]">
          Upload and manage your clothing items for virtual try-on experiences.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-[#26140c] mb-4">
          Upload New Clothes
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
              <p className="text-gray-600">Uploading clothes...</p>
            </div>
          ) : isDragActive ? (
            <p className="text-blue-600 font-medium">
              Drop the images here...
            </p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Drag & drop clothing images here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports: JPG, PNG, WEBP (Max 50MB each) • Multiple files supported
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Clothes Grid */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#26140c]">
            Your Clothes ({clothes.length})
          </h2>
        </div>

        {clothes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {clothes.map((cloth) => (
              <div key={cloth.id || cloth._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="relative aspect-square group">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${cloth.fileUrl}`}
                    alt={cloth.originalName}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-cloth.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setSelectedCloth(cloth)}
                      className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(cloth)}
                      className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cloth.id || cloth._id)}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {cloth.metadata?.name || cloth.originalName}
                    </h3>
                    {getStatusIcon(cloth.validationStatus)}
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col space-y-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(cloth.validationStatus)} capitalize`}>
                        {cloth.validationStatus || 'pending'}
                      </span>
                      {cloth.metadata?.category && (
                        <span className={`${getCategoryColor(cloth.metadata.category)} px-2 py-1 rounded-full text-xs font-medium`}>
                          {cloth.metadata.category.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {(cloth.fileSize / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    {cloth.validationStatus !== 'valid' && cloth.validationStatus !== 'processing' && (
                      <button
                        onClick={() => handleValidate(cloth.id || cloth._id)}
                        className="flex-1 bg-blue-600 text-white text-xs py-2 px-3 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Validate
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedCloth(cloth)}
                      className="flex-1 bg-gray-600 text-white text-xs py-2 px-3 rounded-md hover:bg-gray-700 transition-colors"
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
            <Shirt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No clothes uploaded yet
            </h3>
            <p className="text-gray-600 mb-6">
              Upload your first clothing item to get started with virtual try-on.
            </p>
          </div>
        )}
      </div>

      {/* Cloth Preview Modal */}
      {selectedCloth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedCloth.metadata?.name || selectedCloth.originalName}
                </h3>
                <button
                  onClick={() => setSelectedCloth(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${selectedCloth.fileUrl}`}
                  alt={selectedCloth.originalName}
                  width={500}
                  height={300}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedCloth.validationStatus)} capitalize`}>
                    {selectedCloth.validationStatus || 'pending'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Category:</span>
                  <span className="ml-2 text-gray-600">
                    {selectedCloth.metadata?.category?.replace('_', ' ') || 'Not set'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">File Size:</span>
                  <span className="ml-2 text-gray-600">
                    {(selectedCloth.fileSize / (1024 * 1024)).toFixed(1)} MB
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Uploaded:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(selectedCloth.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    handleEdit(selectedCloth);
                    setSelectedCloth(null);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Edit Details
                </button>
                {selectedCloth.validationStatus !== 'valid' && selectedCloth.validationStatus !== 'processing' && (
                  <button
                    onClick={() => {
                        handleValidate(selectedCloth.id || selectedCloth._id);
                        setSelectedCloth(null);
                      }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Validate
                  </button>
                )}
                <button
                  onClick={() => {
                    handleDelete(selectedCloth.id || selectedCloth._id);
                    setSelectedCloth(null);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCloth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Edit Cloth Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter cloth name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    {clothingCategories.map(category => (
                      <option key={category} value={category}>
                        {category.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingCloth(null)}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clothes;