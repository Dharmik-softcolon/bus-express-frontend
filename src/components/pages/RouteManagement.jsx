import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { routeAPI } from '../../services/api'
import { showToast } from '../../utils/toast'
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Search,
  Map,
  Clock,
  Navigation,
  AlertCircle,
  Users,
  TrendingUp,
  MoreVertical,
  Loader
} from 'lucide-react'

const RouteManagement = () => {
  const { user } = useUser()

  // State Management
  const [routes, setRoutes] = useState([])
  const [routesLoading, setRoutesLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingRoute, setEditingRoute] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  // Form state
  const [routeForm, setRouteForm] = useState({
    routeName: '',
    from: {
      city: '',
      state: ''
    },
    to: {
      city: '',
      state: ''
    },
    distance: '',
    time: '',
    pickupPoints: [],
    dropPoints: [],
    fare: ''
  })

  const [formErrors, setFormErrors] = useState({})
  const [currentPickupPoint, setCurrentPickupPoint] = useState({
    name: ''
  })
  const [currentDropPoint, setCurrentDropPoint] = useState({
    name: ''
  })

  // Prevent duplicate requests
  const preventDuplicateRequest = async (requestKey, apiCall, maxRetries = 3, baseDelay = 1000) => {
    try {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const result = await apiCall()
          return result
        } catch (error) {
          if (attempt === maxRetries - 1) throw error
          await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt)))
        }
      }
    } catch (error) {
      throw error
    }
  }

  // Fetch routes data
  const fetchRoutesData = async () => {
    try {
      setRoutesLoading(true)
      const response = await preventDuplicateRequest('fetch-routes', () => routeAPI.getAllRoutes())
      
      if (response.success && response.data?.routes) {
        setRoutes(response.data.routes)
      } else {
        showToast.error(response.message || 'Failed to fetch routes')
      }
    } catch (error) {
      console.error('Error fetching routes:', error)
      showToast.error('Failed to fetch routes')
    } finally {
      setRoutesLoading(false)
    }
  }

  // Load routes on component mount
  useEffect(() => {
    fetchRoutesData()
  }, [])

  // Form handlers
  const handleRouteInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setRouteForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setRouteForm(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const addPickupPoint = () => {
    if (currentPickupPoint.name.trim()) {
      setRouteForm(prev => ({
        ...prev,
        pickupPoints: [...prev.pickupPoints, { ...currentPickupPoint }]
      }))
      setCurrentPickupPoint({
        name: ''
      })
    } else {
      showToast.error('Please enter pickup point name')
    }
  }

  const removePickupPoint = (index) => {
    setRouteForm(prev => ({
      ...prev,
      pickupPoints: [...prev.pickupPoints.slice(0, index), ...prev.pickupPoints.slice(index + 1)]
    }))
  }

  const addDropPoint = () => {
    if (currentDropPoint.name.trim()) {
      setRouteForm(prev => ({
        ...prev,
        dropPoints: [...prev.dropPoints, { ...currentDropPoint }]
      }))
      setCurrentDropPoint({
        name: ''
      })
    } else {
      showToast.error('Please enter drop point name')
    }
  }

  const removeDropPoint = (index) => {
    setRouteForm(prev => ({
      ...prev,
      dropPoints: [...prev.dropPoints.slice(0, index), ...prev.dropPoints.slice(index + 1)]
    }))
  }

  // Validation
  const validateForm = () => {
    const errors = {}

    if (!routeForm.routeName.trim()) {
      errors.routeName = 'Route name is required'
    } else if (routeForm.routeName.trim().length < 2) {
      errors.routeName = 'Route name must be at least 2 characters'
    }

    // From validation
    if (!routeForm.from.city.trim()) {
      errors['from.city'] = 'From city is required'
    }
    if (!routeForm.from.state.trim()) {
      errors['from.state'] = 'From state is required'
    }

    // To validation
    if (!routeForm.to.city.trim()) {
      errors['to.city'] = 'To city is required'
    }
    if (!routeForm.to.state.trim()) {
      errors['to.state'] = 'To state is required'
    }

    // Distance validation
    if (!routeForm.distance || isNaN(routeForm.distance) || parseFloat(routeForm.distance) < 0) {
      errors.distance = 'Distance must be a positive number'
    }

    // Time validation
    if (!routeForm.time || isNaN(routeForm.time) || parseInt(routeForm.time) < 0) {
      errors.time = 'Time must be a non-negative integer'
    }

    // Fare validation
    if (!routeForm.fare || isNaN(routeForm.fare) || parseFloat(routeForm.fare) < 0) {
      errors.fare = 'Fare must be a positive number'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // API calls
  const handleCreateRoute = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setFormLoading(true)

      // Prepare route data
      const routeData = {
        ...routeForm,
        distance: parseFloat(routeForm.distance),
        time: parseInt(routeForm.time),
        fare: parseFloat(routeForm.fare),
      }

      console.log('Creating route with data:', routeData)

      const response = await preventDuplicateRequest('create-route', () => routeAPI.createRoute(routeData))

      console.log('Create route response:', response)

      if (response.success && response.message) {
        showToast.success(response.message)
        closeModals()
        fetchRoutesData()
      } else {
        showToast.error(response.message || 'Failed to create route')
      }
    } catch (error) {
      console.error('Error creating route:', error)

      let errorMessage = 'Failed to create route'

      if (error.response?.status === 401) {
        errorMessage = 'You are not authorized. Please log in again.'
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to create routes.'
      } else if (error.response?.status === 422) {
        errorMessage = 'Please check your route data and try again.'
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid route data.'
      } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.'
      }

      showToast.error(errorMessage)
    } finally {
      setFormLoading(false)
    }
  }

  const handleUpdateRoute = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setFormLoading(true)

      // Prepare route data
      const routeData = {
        ...routeForm,
        distance: parseFloat(routeForm.distance),
        time: parseInt(routeForm.time),
        fare: parseFloat(routeForm.fare),
      }

      console.log('Updating route with data:', routeData)

      const response = await preventDuplicateRequest('update-route', () => routeAPI.updateRoute(editingRoute._id, routeData))

      console.log('Update route response:', response)

      if (response.success && response.message) {
        showToast.success(response.message)
        closeModals()
        fetchRoutesData()
      } else {
        showToast.error(response.message || 'Failed to update route')
      }
    } catch (error) {
      console.error('Error updating route:', error)

      let errorMessage = 'Failed to update route'

      if (error.response?.status === 401) {
        errorMessage = 'You are not authorized. Please log in again.'
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to update routes.'
      } else if (error.response?.status === 422) {
        errorMessage = 'Please check your route data and try again.'
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid route data.'
      } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.'
      }

      showToast.error(errorMessage)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteRoute = async (route) => {
    if (window.confirm(`Are you sure you want to delete route "${
        route.routeName || route.name}"?`)) {
      try {
        const response = await preventDuplicateRequest('delete-route', () => routeAPI.deleteRoute(route._id))

        if (response.success && response.message) {
          showToast.success(response.message)
          fetchRoutesData()
        } else {
          showToast.error(response.message || 'Failed to delete route')
        }
      } catch (error) {
        console.error('Error deleting route:', error)

        let errorMessage = 'Failed to delete route'

        if (error.response?.status === 401) {
          errorMessage = 'You are not authorized. Please log in again.'
        } else if (error.response?.status === 403) {
          errorMessage = 'You do not have permission to delete routes.'
        } else if (error.response?.status === 404) {
          errorMessage = 'Route not found.'
        } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        }

        showToast.error(errorMessage)
      }
    }
  }

  const openEditRoute = (route) => {
    setEditingRoute(route)
    setRouteForm({
      routeName: route.routeName || '',
      from: route.from || {
        city: '',
        state: ''
      },
      to: route.to || {
        city: '',
        state: ''
      },
      distance: route.distance || '',
      time: route.time || '',
      pickupPoints: route.pickupPoints || [],
      dropPoints: route.dropPoints || [],
      fare: route.fare || ''
    })
    setShowModal(true)
  }

  const closeModals = () => {
    setShowModal(false)
    setEditingRoute(null)
    setRouteForm({
      routeName: '',
      from: {
        city: '',
        state: ''
      },
      to: {
        city: '',
        state: ''
      },
      distance: '',
      time: '',
      pickupPoints: [],
      dropPoints: [],
      fare: ''
    })
    setFormErrors({})
    setCurrentPickupPoint({
      name: ''
    })
    setCurrentDropPoint({
      name: ''
    })
  }

  // Filter and search functions
  const filteredAndSortedRoutes = () => {
    let filtered = routes

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(route =>
          route.routeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          route.from?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          route.to?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          route.from?.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          route.to?.state?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at))
        break
      case 'name':
        filtered.sort((a, b) => (a.routeName || a.name || '').localeCompare(b.routeName || b.name || ''))
        break
      case 'distance':
        filtered.sort((a, b) => (b.distance || 0) - (a.distance || 0))
        break
      case 'fare':
        filtered.sort((a, b) => (b.fare || 0) - (a.fare || 0))
        break
      default:
        break
    }

    return filtered
  }

  const stats = {
    total: routes.length,
    totalPickupPoints: routes.reduce((sum, route) => sum + (route.pickupPoints?.length || 0), 0),
    totalDropPoints: routes.reduce((sum, route) => sum + (route.dropPoints?.length || 0), 0),
    averageFare: routes.length > 0 ? routes.reduce((sum, route) => sum + (route.fare || 0), 0) / routes.length : 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-[#B99750]">Route Management</h1>
                <p className="mt-2 text-gray-600">Manage bus routes, stops, and schedules</p>
              </div>
              <button
                  onClick={() => setShowModal(true)}
                  className="btn-primary px-6 py-3 rounded-lg flex items-center transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Route
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Routes</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pickup Points</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.totalPickupPoints}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Drop Points</p>
                  <p className="text-2xl font-bold text-gray-600">{stats.totalDropPoints}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Fare</p>
                  <p className="text-2xl font-bold text-gray-600">₹{stats.averageFare.toFixed(0)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600" />
                <input
                    type="text"
                    placeholder="Search routes by name, start city, end city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#B99750] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-[#B99750] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="newest">Newest First</option>
                <option value="name">Name A-Z</option>
                <option value="distance">Distance</option>
                <option value="fare">Fare</option>
              </select>
            </div>
          </div>

          {/* Routes List */}
          {routesLoading ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <Loader className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading routes...</p>
              </div>
          ) : filteredAndSortedRoutes().length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <MapPin className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No routes found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? 'No routes match your search criteria.' : 'Get started by creating your first route.'}
                </p>
                {!searchTerm && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary px-6 py-3 rounded-lg flex items-center mx-auto transition-colors"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Add New Route
                    </button>
                )}
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedRoutes().map((route) => (
                    <div key={route._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-600 mb-1">
                              {route.routeName || 'Unnamed Route'}
                            </h3>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              {route.from?.city && route.to?.city ?
                                  `${route.from.city} → ${route.to.city}` :
                                  'Route locations not specified'
                              }
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="relative">
                              <button className="p-1 text-gray-600 hover:text-gray-600">
                                <MoreVertical className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Navigation className="h-4 w-4 mr-2" />
                            <span>{route.distance ? `${route.distance} km` : 'Distance N/A'}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{route.time ? `${route.time} min` : 'Time N/A'}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            <span>{route.pickupPoints?.length || 0} pickup points</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{route.dropPoints?.length || 0} drop points</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="font-semibold text-green-600">₹{route.fare || 'N/A'}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                              onClick={() => openEditRoute(route)}
                              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </button>
                          <button
                              onClick={() => handleDeleteRoute(route)}
                              className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>

        {/* Add/Edit Route Modal */}
        {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-600">
                      {editingRoute ? 'Edit Route' : 'Add New Route'}
                    </h2>
                    <button
                        onClick={closeModals}
                        className="text-gray-600 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={editingRoute ? handleUpdateRoute : handleCreateRoute}>
                    <div className="space-y-6">
                      {/* Route Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          Route Name *
                        </label>
                        <input
                            type="text"
                            value={routeForm.routeName}
                            onChange={(e) => handleRouteInputChange('routeName', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                                formErrors.routeName ? 'border-red-500' : 'border-[#B99750]'
                            }`}
                            placeholder="Enter route name"
                        />
                        {formErrors.routeName && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.routeName}</p>
                        )}
                      </div>

                      {/* From Location */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-600 mb-4">From</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              City *
                            </label>
                            <input
                                type="text"
                                value={routeForm.from.city}
                                onChange={(e) => handleRouteInputChange('from.city', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                                    formErrors['from.city'] ? 'border-red-500' : 'border-[#B99750]'
                                }`}
                                placeholder="Enter from city"
                            />
                            {formErrors['from.city'] && (
                                <p className="mt-1 text-sm text-red-600">{formErrors['from.city']}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              State *
                            </label>
                            <input
                                type="text"
                                value={routeForm.from.state}
                                onChange={(e) => handleRouteInputChange('from.state', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                                    formErrors['from.state'] ? 'border-red-500' : 'border-[#B99750]'
                                }`}
                                placeholder="Enter from state"
                            />
                            {formErrors['from.state'] && (
                                <p className="mt-1 text-sm text-red-600">{formErrors['from.state']}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* To Location */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-600 mb-4">To</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              City *
                            </label>
                            <input
                                type="text"
                                value={routeForm.to.city}
                                onChange={(e) => handleRouteInputChange('to.city', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                                    formErrors['to.city'] ? 'border-red-500' : 'border-[#B99750]'
                                }`}
                                placeholder="Enter to city"
                            />
                            {formErrors['to.city'] && (
                                <p className="mt-1 text-sm text-red-600">{formErrors['to.city']}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                              State *
                            </label>
                            <input
                                type="text"
                                value={routeForm.to.state}
                                onChange={(e) => handleRouteInputChange('to.state', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                                    formErrors['to.state'] ? 'border-red-500' : 'border-[#B99750]'
                                }`}
                                placeholder="Enter to state"
                            />
                            {formErrors['to.state'] && (
                                <p className="mt-1 text-sm text-red-600">{formErrors['to.state']}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Distance, Time, and Fare */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Distance (km) *
                          </label>
                          <input
                              type="number"
                              value={routeForm.distance}
                              onChange={(e) => handleRouteInputChange('distance', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                                  formErrors.distance ? 'border-red-500' : 'border-[#B99750]'
                              }`}
                              placeholder="Enter distance in km"
                              min="0"
                              step="0.1"
                          />
                          {formErrors.distance && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.distance}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Time (minutes) *
                          </label>
                          <input
                              type="number"
                              value={routeForm.time}
                              onChange={(e) => handleRouteInputChange('time', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                                  formErrors.time ? 'border-red-500' : 'border-[#B99750]'
                              }`}
                              placeholder="Enter time in minutes"
                              min="0"
                          />
                          {formErrors.time && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.time}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            Fare (₹) *
                          </label>
                          <input
                              type="number"
                              value={routeForm.fare}
                              onChange={(e) => handleRouteInputChange('fare', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                                  formErrors.fare ? 'border-red-500' : 'border-[#B99750]'
                              }`}
                              placeholder="Enter fare amount"
                              min="0"
                              step="0.01"
                          />
                          {formErrors.fare && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.fare}</p>
                          )}
                        </div>
                      </div>

                      {/* Pickup Points */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-600 mb-4">Pickup Points</h3>
                        
                        {/* Add Pickup Point Form */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Pickup Point Name
                              </label>
                              <input
                                  type="text"
                                  value={currentPickupPoint.name}
                                  onChange={(e) => setCurrentPickupPoint({ name: e.target.value })}
                                  className="w-full px-3 py-2 border border-[#B99750] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                  placeholder="Enter pickup point name"
                              />
                            </div>
                            <div className="flex items-end">
                              <button
                                  type="button"
                                  onClick={addPickupPoint}
                                  className="btn-primary px-4 py-2 rounded-lg flex items-center transition-colors"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Pickup Points List */}
                        <div className="space-y-2">
                          {routeForm.pickupPoints.map((point, index) => (
                              <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                                <span className="text-sm font-medium text-gray-600">{point.name}</span>
                                <button
                                    type="button"
                                    onClick={() => removePickupPoint(index)}
                                    className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                          ))}
                        </div>
                      </div>

                      {/* Drop Points */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-600 mb-4">Drop Points</h3>
                        
                        {/* Add Drop Point Form */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <div className="flex gap-4">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Drop Point Name
                              </label>
                              <input
                                  type="text"
                                  value={currentDropPoint.name}
                                  onChange={(e) => setCurrentDropPoint({ name: e.target.value })}
                                  className="w-full px-3 py-2 border border-[#B99750] rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                  placeholder="Enter drop point name"
                              />
                            </div>
                            <div className="flex items-end">
                              <button
                                  type="button"
                                  onClick={addDropPoint}
                                  className="btn-primary px-4 py-2 rounded-lg flex items-center transition-colors"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Drop Points List */}
                        <div className="space-y-2">
                          {routeForm.dropPoints.map((point, index) => (
                              <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                                <span className="text-sm font-medium text-gray-600">{point.name}</span>
                                <button
                                    type="button"
                                    onClick={() => removeDropPoint(index)}
                                    className="text-red-600 hover:text-red-800 p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                      <button
                          type="button"
                          onClick={closeModals}
                          className="px-6 py-2 border-0 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                          type="submit"
                          disabled={formLoading}
                          className="px-6 py-2 btn-primary rounded-lg flex items-center transition-colors disabled:opacity-50"
                      >
                        {formLoading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
                        {editingRoute ? 'Update Route' : 'Create Route'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
      </div>
    )
}

export default RouteManagement