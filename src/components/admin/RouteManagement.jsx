import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, MapPin, Clock, DollarSign, Bus } from 'lucide-react'
import { routeAPI } from '../../services/api'

const RouteManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingRoute, setEditingRoute] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [routes, setRoutes] = useState([])
  
  // Load routes on component mount
  useEffect(() => {
    loadRoutes()
  }, [])
  
  const loadRoutes = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await routeAPI.getAllRoutes()
      if (response.success) {
        setRoutes(response.data.routes || [])
          } else {
            setError('Failed to load routes')
            setRoutes([])
          }
    } catch (error) {
      console.error('Error loading routes:', error)
      setError('Failed to load routes')
      setRoutes([])
    } finally {
      setLoading(false)
    }
  }
  
  // Route CRUD operations
  const handleAddRoute = async (routeData) => {
    try {
      const response = await routeAPI.createRoute(routeData)
      if (response.success) {
        await loadRoutes() // Reload routes
        setShowAddModal(false)
        return { success: true }
      } else {
        return { success: false, error: response.message || 'Failed to add route' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to add route' }
    }
  }
  
  const handleUpdateRoute = async (routeId, routeData) => {
    try {
      const response = await routeAPI.updateRoute(routeId, routeData)
      if (response.success) {
        await loadRoutes() // Reload routes
        setEditingRoute(null)
        return { success: true }
      } else {
        return { success: false, error: response.message || 'Failed to update route' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to update route' }
    }
  }
  
  const handleDeleteRoute = async (routeId) => {
    try {
      const response = await routeAPI.deleteRoute(routeId)
      if (response.success) {
        await loadRoutes() // Reload routes
        return { success: true }
      } else {
        return { success: false, error: response.message || 'Failed to delete route' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to delete route' }
    }
  }
  
  const handleUpdateRouteStatus = async (routeId, status) => {
    try {
      const response = await routeAPI.updateRouteStatus(routeId, status)
      if (response.success) {
        await loadRoutes() // Reload routes
        return { success: true }
      } else {
        return { success: false, error: response.message || 'Failed to update route status' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to update route status' }
    }
  }

  const [formData, setFormData] = useState({
    from: '',
    to: '',
    distance: '',
    duration: '',
    price: '',
    busType: 'Standard',
    frequency: '',
    status: 'active'
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingRoute) {
      setRoutes(prev => prev.map(route => 
        route.id === editingRoute.id ? { ...formData, id: editingRoute.id } : route
      ))
    } else {
      const newRoute = {
        ...formData,
        id: routes.length + 1
      }
      setRoutes(prev => [...prev, newRoute])
    }
    setShowAddModal(false)
    setEditingRoute(null)
    setFormData({
      from: '',
      to: '',
      distance: '',
      duration: '',
      price: '',
      busType: 'Standard',
      frequency: '',
      status: 'active'
    })
  }

  const handleEdit = (route) => {
    setEditingRoute(route)
    setFormData(route)
    setShowAddModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      setRoutes(prev => prev.filter(route => route.id !== id))
    }
  }

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold" style={{color: "#B99750"}}>Route Management</h1>
              <p className="text-gray-600 mt-1">Manage bus routes, schedules, and pricing</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Route
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Routes Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bus Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {routes.map((route) => (
                  <tr key={route.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {route.from} → {route.to}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {route.distance}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{route.duration}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">${route.price}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Bus className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{route.busType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {route.frequency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(route.status)}`}>
                        {route.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(route)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(route.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingRoute ? 'Edit Route' : 'Add New Route'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From
                      </label>
                      <input
                        type="text"
                        name="from"
                        value={formData.from}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To
                      </label>
                      <input
                        type="text"
                        name="to"
                        value={formData.to}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Distance
                      </label>
                      <input
                        type="text"
                        name="distance"
                        value={formData.distance}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="e.g., 215 miles"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration
                      </label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="e.g., 4h 30m"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bus Type
                      </label>
                      <select
                        name="busType"
                        value={formData.busType}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="Economy">Economy</option>
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                        <option value="Luxury">Luxury</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency
                    </label>
                    <input
                      type="text"
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="e.g., Every 2 hours"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false)
                        setEditingRoute(null)
                        setFormData({
                          from: '',
                          to: '',
                          distance: '',
                          duration: '',
                          price: '',
                          busType: 'Standard',
                          frequency: '',
                          status: 'active'
                        })
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      {editingRoute ? 'Update' : 'Add'} Route
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RouteManagement

