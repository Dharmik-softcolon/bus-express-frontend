import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
import { showToast } from '../../utils/toast'
import { tripAPI, routeAPI, busAPI } from '../../services/api'
import { 
  Calendar, 
  Plus,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react'

const TripManagement = () => {
  const { user } = useUser()
  const navigationItems = getNavigationMenu(user?.role)
  const [activeTab, setActiveTab] = useState('trips')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTrip, setEditingTrip] = useState(null)
  
  const [trips, setTrips] = useState([])
  const [routes, setRoutes] = useState([])
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [ongoingRequests, setOngoingRequests] = useState(new Set())

  const [tripForm, setTripForm] = useState({
    route: '',
    bus: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
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

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setLoading(true)
      
      // Fetch routes and buses for dropdowns
      const routesResponse = await preventDuplicateRequest('routes', () => routeAPI.getAllRoutes({ limit: 50 }))
      const busesResponse = await preventDuplicateRequest('buses', () => busAPI.getAllBuses({ limit: 50 }))
      
      if (routesResponse && routesResponse.success) {
        setRoutes(routesResponse.data.routes || [])
      }
      if (busesResponse && busesResponse.success) {
        setBuses(busesResponse.data.buses || [])
      }
      
      // TODO: Add fetchTripsData() when trips API is implemented
      setTrips([]) // Mock data for now
      
    } catch (error) {
      console.error('Error fetching data:', error)
      showToast('Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const handleTripInputChange = (e) => {
    const { name, value } = e.target
    setTripForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCreateTrip = async (e) => {
    e.preventDefault()
    try {
      const response = await preventDuplicateRequest('create-trip', () => tripAPI.createTrip(tripForm))
      if (response.success) {
        showToast('Trip created successfully', 'success')
        setShowAddModal(false)
        setTripForm({
          route: '',
          bus: '',
          departureTime: '',
          arrivalTime: '',
          price: '',
          status: 'active'
        })
        fetchAllData()
      }
    } catch (error) {
      console.error('Error creating trip:', error)
      showToast('Failed to create trip', 'error')
    }
  }

  const handleUpdateTrip = async (e) => {
    e.preventDefault()
    try {
      const response = await preventDuplicateRequest('update-trip', () => tripAPI.updateTrip(editingTrip.id, tripForm))
      if (response.success) {
        showToast('Trip updated successfully', 'success')
        setEditingTrip(null)
        setTripForm({
          route: '',
          bus: '',
          departureTime: '',
          arrivalTime: '',
          price: '',
          status: 'active'
        })
        fetchAllData()
      }
    } catch (error) {
      console.error('Error updating trip:', error)
      showToast('Failed to update trip', 'error')
    }
  }

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        const response = await tripAPI.deleteTrip(tripId)
        if (response.success) {
          showToast('Trip deleted successfully', 'success')
          fetchAllData()
        }
      } catch (error) {
        console.error('Error deleting trip:', error)
        showToast('Failed to delete trip', 'error')
      }
    }
  }

  const openEditTrip = (trip) => {
    setEditingTrip(trip)
    setTripForm({
      route: trip.route || '',
      bus: trip.bus || '',
      departureTime: trip.departureTime || '',
      arrivalTime: trip.arrivalTime || '',
      price: trip.price || '',
      status: trip.status || 'active'
    })
    setShowAddModal(true)
  }

  const closeModals = () => {
    setShowAddModal(false)
    setEditingTrip(null)
    setTripForm({
      route: '',
      bus: '',
      departureTime: '',
      arrivalTime: '',
      price: '',
      status: 'active'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Trip Management</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage bus trips and schedules
              </p>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2">
              {navigationItems.map((item) => {
                // Extract the tab ID from the path
                const tabId = item.path.split('/').pop() || 'dashboard'
                return (
                  <button
                    key={item.path}
                    onClick={() => setActiveTab(tabId)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      activeTab === tabId
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Trip Management</h3>
            <button
              onClick={() => {
                setEditingTrip(null)
                setShowAddModal(true)
              }}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Trip
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-3 text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading trips...</p>
              </div>
            ) : trips.length === 0 ? (
              <div className="col-span-3 text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No trips found</p>
                <p className="text-sm text-gray-500 mt-2">Create your first trip to get started</p>
              </div>
            ) : (
              trips.map((trip) => {
                const route = routes.find(r => r._id === trip.route || r.id === trip.route)
                const bus = buses.find(b => b._id === trip.bus || b.id === trip.bus)
                
                return (
                  <div key={trip._id || trip.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {route?.name || route?.routeName || 'Unknown Route'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {bus?.number || bus?.busNumber || 'Bus not assigned'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Departure: {trip.departureTime || 'Not set'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Arrival: {trip.arrivalTime || 'Not set'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Price: ₹{trip.price || '0'}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditTrip(trip)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTrip(trip._id || trip.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status || 'active')}`}>
                        {trip.status || 'Active'}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingTrip ? 'Edit Trip' : 'Add New Trip'}
                </h3>
                
                <form onSubmit={editingTrip ? handleUpdateTrip : handleCreateTrip} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Route
                    </label>
                    <select
                      name="route"
                      value={tripForm.route}
                      onChange={handleTripInputChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select Route</option>
                      {routes.map(route => (
                        <option key={route._id || route.id} value={route._id || route.id}>
                          {route.name || route.routeName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bus
                    </label>
                    <select
                      name="bus"
                      value={tripForm.bus}
                      onChange={handleTripInputChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select Bus</option>
                      {buses.map(bus => (
                        <option key={bus._id || bus.id} value={bus._id || bus.id}>
                          {bus.number || bus.busNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departure Time
                    </label>
                    <input
                      type="time"
                      name="departureTime"
                      value={tripForm.departureTime}
                      onChange={handleTripInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Arrival Time
                    </label>
                    <input
                      type="time"
                      name="arrivalTime"
                      value={tripForm.arrivalTime}
                      onChange={handleTripInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={tripForm.price}
                      onChange={handleTripInputChange}
                      className="input-field"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={tripForm.status}
                      onChange={handleTripInputChange}
                      className="input-field"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
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
                      {editingTrip ? 'Update' : 'Add'} Trip
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

export default TripManagement
