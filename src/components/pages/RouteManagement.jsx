import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
import { showToast } from '../../utils/toast'
import { routeAPI } from '../../services/api'
import { 
  MapPin, 
  Plus,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react'

const RouteManagement = () => {
  const { user } = useUser()
  const navigationItems = getNavigationMenu(user?.role)
  const [activeTab, setActiveTab] = useState('routes')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingRoute, setEditingRoute] = useState(null)
  
  const [routes, setRoutes] = useState([])
  const [routesLoading, setRoutesLoading] = useState(true)
  const [ongoingRequests, setOngoingRequests] = useState(new Set())

  const [routeForm, setRouteForm] = useState({
    name: '',
    from: '',
    to: '',
    distance: '',
    duration: '',
    totalTrips: '',
    status: 'active'
  })

  // Helper function to prevent duplicate requests
  const preventDuplicateRequest = async (requestKey, apiCall, maxRetries = 3, baseDelay = 1000) => {
    if (ongoingRequests.has(requestKey)) {
      console.log(`Request ${requestKey} already in progress, skipping...`)
      return null
    }

    setOngoingRequests(prev => new Set([...prev, requestKey]))

    try {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const result = await apiCall()
          return result
        } catch (error) {
          if (error.message.includes('429') && attempt < maxRetries - 1) {
            const delayTime = baseDelay * Math.pow(2, attempt)
            console.log(`Rate limited. Retrying in ${delayTime}ms... (attempt ${attempt + 1}/${maxRetries})`)
            await new Promise(resolve => setTimeout(resolve, delayTime))
            continue
          }
          throw error
        }
      }
    } finally {
      setOngoingRequests(prev => {
        const newSet = new Set(prev)
        newSet.delete(requestKey)
        return newSet
      })
    }
  }

  // Fetch routes data
  const fetchRoutesData = async () => {
    try {
      setRoutesLoading(true)
      const response = await preventDuplicateRequest('routes', () => routeAPI.getAllRoutes({ limit: 50 }))
      if (response && response.success) {
        setRoutes(response.data.routes || [])
      }
    } catch (error) {
      console.error('Error fetching routes data:', error)
      showToast('Failed to load routes data', 'error')
    } finally {
      setRoutesLoading(false)
    }
  }

  useEffect(() => {
    fetchRoutesData()
  }, [])

  const handleRouteInputChange = (e) => {
    const { name, value } = e.target
    setRouteForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCreateRoute = async (e) => {
    e.preventDefault()
    try {
      const response = await preventDuplicateRequest('create-route', () => routeAPI.createRoute(routeForm))
      if (response.success) {
        showToast('Route created successfully', 'success')
        setShowAddModal(false)
        setRouteForm({
          name: '',
          from: '',
          to: '',
          distance: '',
          duration: '',
          totalTrips: '',
          status: 'active'
        })
        fetchRoutesData()
      }
    } catch (error) {
      console.error('Error creating route:', error)
      showToast('Failed to create route', 'error')
    }
  }

  const handleUpdateRoute = async (e) => {
    e.preventDefault()
    try {
      const response = await preventDuplicateRequest('update-route', () => routeAPI.updateRoute(editingRoute.id, routeForm))
      if (response.success) {
        showToast('Route updated successfully', 'success')
        setEditingRoute(null)
        setRouteForm({
          name: '',
          from: '',
          to: '',
          distance: '',
          duration: '',
          totalTrips: '',
          status: 'active'
        })
        fetchRoutesData()
      }
    } catch (error) {
      console.error('Error updating route:', error)
      showToast('Failed to update route', 'error')
    }
  }

  const handleDeleteRoute = async (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        const response = await routeAPI.deleteRoute(routeId)
        if (response.success) {
          showToast('Route deleted successfully', 'success')
          fetchRoutesData()
        }
      } catch (error) {
        console.error('Error deleting route:', error)
        showToast('Failed to delete route', 'error')
      }
    }
  }

  const openEditRoute = (route) => {
    setEditingRoute(route)
    setRouteForm({
      name: route.name || route.routeName || '',
      from: route.from || '',
      to: route.to || '',
      distance: route.distance || '',
      duration: route.duration || '',
      totalTrips: route.totalTrips || '',
      status: route.status || 'active'
    })
    setModalType('route')
    setShowAddModal(true)
  }

  const closeModals = () => {
    setShowAddModal(false)
    setEditingRoute(null)
    setRouteForm({
      name: '',
      from: '',
      to: '',
      distance: '',
      duration: '',
      totalTrips: '',
      status: 'active'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Route Management</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage bus routes and schedules
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Route Management</h3>
            <button
              onClick={() => {
                setEditingRoute(null)
                setShowAddModal(true)
              }}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Route
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routesLoading ? (
              <div className="col-span-2 text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading routes...</p>
              </div>
            ) : routes.length === 0 ? (
              <div className="col-span-2 text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No routes found</p>
              </div>
            ) : (
              routes.map((route) => (
                <div key={route._id || route.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{route.name || route.routeName}</h4>
                      <p className="text-sm text-gray-600">
                        {route.distance ? `${route.distance} km` : 'Distance not specified'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {route.duration ? `Duration: ${route.duration}` : 'Duration not specified'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {route.totalTrips || 0} trips/day
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditRoute(route)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRoute(route._id || route.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(route.status || 'active')}`}>
                      {route.status || 'Active'}
                    </span>
                  </div>
                </div>
              ))
            )}
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
                
                <form onSubmit={editingRoute ? handleUpdateRoute : handleCreateRoute} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Route Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={routeForm.name}
                      onChange={handleRouteInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From
                    </label>
                    <input
                      type="text"
                      name="from"
                      value={routeForm.from}
                      onChange={handleRouteInputChange}
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
                      value={routeForm.to}
                      onChange={handleRouteInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Distance (km)
                    </label>
                    <input
                      type="number"
                      name="distance"
                      value={routeForm.distance}
                      onChange={handleRouteInputChange}
                      className="input-field"
                      min="0"
                      step="0.1"
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
                      value={routeForm.duration}
                      onChange={handleRouteInputChange}
                      className="input-field"
                      placeholder="e.g., 2 hours 30 minutes"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Trips per Day
                    </label>
                    <input
                      type="number"
                      name="totalTrips"
                      value={routeForm.totalTrips}
                      onChange={handleRouteInputChange}
                      className="input-field"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={routeForm.status}
                      onChange={handleRouteInputChange}
                      className="input-field"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModals}
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
