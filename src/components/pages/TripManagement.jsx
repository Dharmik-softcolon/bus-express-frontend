import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
import { showToast } from '../../utils/toast'
import { tripAPI, routeAPI, busAPI, busEmployeeAPI } from '../../services/api'
import { 
  Calendar, 
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Clock,
  MapPin,
  Users,
  Bus,
  Route,
  DollarSign,
  Filter,
  Search,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  Download,
  Upload,
  Settings,
  ChevronDown,
  ChevronUp,
  Star,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

const TripManagement = () => {
  const { user } = useUser()
  const navigationItems = getNavigationMenu(user?.role)
  
  // State management
  const [activeTab, setActiveTab] = useState('trips')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [editingTrip, setEditingTrip] = useState(null)
  const [selectedTrips, setSelectedTrips] = useState([])
  const [viewMode, setViewMode] = useState('grid') // grid or list
  
  // Data state
  const [trips, setTrips] = useState([])
  const [routes, setRoutes] = useState([])
  const [buses, setBuses] = useState([])
  const [drivers, setDrivers] = useState([])
  const [helpers, setHelpers] = useState([])
  const [statistics, setStatistics] = useState(null)
  
  // Loading and error states
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    route: '',
    bus: '',
    driver: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  })
  
  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  })

  // Trip form state
  const [tripForm, setTripForm] = useState({
    route: '',
    bus: '',
    departureTime: '',
    arrivalTime: '',
    fare: '',
    isRoundTrip: false,
    status: 'scheduled'
  })

  // Fetch all data
  const fetchAllData = async () => {
    try {
      setError(null)
      
      console.log('Fetching trip data...')
      
      // Fetch routes and buses for dropdowns first
      let routesResponse, busesResponse
      try {
        [routesResponse, busesResponse] = await Promise.all([
          routeAPI.getAllRoutes({ limit: 100 }),
          busAPI.getAllBuses({ limit: 100 })
        ])
      } catch (apiError) {
        console.error('API call failed, using sample data:', apiError)
        routesResponse = { success: false, message: 'API Error' }
        busesResponse = { success: false, message: 'API Error' }
      }
      
      console.log('Routes response:', routesResponse)
      console.log('Buses response:', busesResponse)
      
      if (routesResponse.success) {
        setRoutes(routesResponse.data.routes || [])
        console.log('Routes loaded:', routesResponse.data.routes?.length || 0)
      } else {
        console.error('Failed to load routes:', routesResponse.message)
        setRoutes([])
      }
      
      if (busesResponse.success) {
        setBuses(busesResponse.data.buses || [])
        console.log('Buses loaded:', busesResponse.data.buses?.length || 0)
      } else {
        console.error('Failed to load buses:', busesResponse.message)
        setBuses([])
      }
      
      // Fetch trips with filters - only send non-empty filters
      const tripParams = {
        page: pagination.page,
        limit: pagination.limit
      }
      
      // Only add non-empty filters
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key].toString().trim() !== '') {
          tripParams[key] = filters[key]
        }
      })
      
      const tripsResponse = await tripAPI.getAllTrips(tripParams)
      
      console.log('Trips response:', tripsResponse)
      
      if (tripsResponse.success) {
        setTrips(tripsResponse.data.trips || [])
        setPagination(prev => ({
          ...prev,
          total: tripsResponse.data.pagination.total,
          pages: tripsResponse.data.pagination.pages
        }))
        console.log('Trips loaded:', tripsResponse.data.trips?.length || 0)
      } else {
        console.error('Failed to load trips:', tripsResponse.message)
        setTrips([])
      }
      
      // Fetch statistics
      try {
        const statsResponse = await tripAPI.getTripStatistics()
        if (statsResponse.success) {
          setStatistics(statsResponse.data)
        }
      } catch (statsError) {
        console.log('Statistics not available:', statsError.message)
      }
      
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load data')
      showToast.error('Failed to load trip data')
    }
  }

  // Fetch available drivers and helpers for a specific date
  const fetchAvailableStaff = async (date) => {
    if (!date) return
    
    try {
      const [driversResponse, helpersResponse] = await Promise.all([
        tripAPI.getAvailableDrivers(date),
        tripAPI.getAvailableHelpers(date)
      ])
      
      if (driversResponse.success) {
        setDrivers(driversResponse.data.drivers || [])
      }
      if (helpersResponse.success) {
        setHelpers(helpersResponse.data.helpers || [])
      }
    } catch (error) {
      console.error('Error fetching available staff:', error)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [pagination.page, filters])

  // Handle form input changes
  const handleTripInputChange = (e) => {
    const { name, value } = e.target
    setTripForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle round trip toggle
  const handleRoundTripToggle = () => {
    setTripForm(prev => ({
      ...prev,
      isRoundTrip: !prev.isRoundTrip
    }))
  }

  // Handle trip creation/update
  const handleSubmitTrip = async (e) => {
    e.preventDefault()
    
    try {
      const tripData = {
        ...tripForm,
        departureDate: new Date().toISOString(), // Set current date as default
        // Add default pickup and drop points for round trip
        pickupPoints: tripForm.isRoundTrip ? [
          { name: 'Starting Point', address: 'Route Start', time: tripForm.departureTime },
          { name: 'Return Point', address: 'Route End', time: tripForm.arrivalTime }
        ] : [
          { name: 'Starting Point', address: 'Route Start', time: tripForm.departureTime }
        ],
        dropPoints: tripForm.isRoundTrip ? [
          { name: 'Destination', address: 'Route End', time: tripForm.arrivalTime },
          { name: 'Return Destination', address: 'Route Start', time: tripForm.departureTime }
        ] : [
          { name: 'Destination', address: 'Route End', time: tripForm.arrivalTime }
        ]
      }
      
      let response
      if (editingTrip) {
        response = await tripAPI.updateTrip(editingTrip._id, tripData)
      } else {
        response = await tripAPI.createTrip(tripData)
      }
      
      if (response.success) {
        showToast.success(
          editingTrip ? 'Trip updated successfully' : 'Trip created successfully'
        )
        closeModals()
        fetchAllData()
      } else {
        showToast.error(response.message || 'Operation failed')
      }
    } catch (error) {
      console.error('Error submitting trip:', error)
      showToast.error('Failed to save trip')
    }
  }

  // Handle trip deletion
  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return
    
    try {
      const response = await tripAPI.deleteTrip(tripId)
      if (response.success) {
        showToast.success('Trip deleted successfully')
        fetchAllData()
      }
    } catch (error) {
      console.error('Error deleting trip:', error)
      showToast.error('Failed to delete trip')
    }
  }

  // Handle trip status update
  const handleStatusUpdate = async (tripId, status) => {
    try {
      const response = await tripAPI.updateTripStatus(tripId, status)
      if (response.success) {
        showToast.success('Trip status updated successfully')
        fetchAllData()
      }
    } catch (error) {
      console.error('Error updating status:', error)
      showToast.error('Failed to update trip status')
    }
  }

  // Handle bulk operations
  const handleBulkStatusUpdate = async (status) => {
    if (selectedTrips.length === 0) {
      showToast.warning('Please select trips to update')
      return
    }
    
    try {
      const response = await tripAPI.bulkUpdateTripStatus(selectedTrips, status)
      if (response.success) {
        showToast.success(`${response.data.modifiedCount} trips updated successfully`)
        setSelectedTrips([])
        fetchAllData()
      }
    } catch (error) {
      console.error('Error bulk updating:', error)
      showToast.error('Failed to update trips')
    }
  }

  // Handle trip selection
  const handleTripSelect = (tripId) => {
    setSelectedTrips(prev => 
      prev.includes(tripId) 
        ? prev.filter(id => id !== tripId)
        : [...prev, tripId]
    )
  }

  const handleSelectAll = () => {
    if (selectedTrips.length === trips.length) {
      setSelectedTrips([])
    } else {
      setSelectedTrips(trips.map(trip => trip._id))
    }
  }

  // Open edit modal
  const openEditTrip = (trip) => {
    setEditingTrip(trip)
    setTripForm({
      route: trip.route?._id || trip.route || '',
      bus: trip.bus?._id || trip.bus || '',
      departureTime: trip.departureTime || '',
      arrivalTime: trip.arrivalTime || '',
      fare: trip.fare || '',
      isRoundTrip: trip.pickupPoints?.length > 1 || trip.dropPoints?.length > 1 || false,
      status: trip.status || 'scheduled'
    })
    setShowAddModal(true)
  }

  // Close modals
  const closeModals = () => {
    setShowAddModal(false)
    setEditingTrip(null)
    setTripForm({
      route: '',
      bus: '',
      departureTime: '',
      arrivalTime: '',
      fare: '',
      isRoundTrip: false,
      status: 'scheduled'
    })
  }

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'scheduled':
        return { color: 'bg-blue-100 text-blue-800', icon: Calendar }
      case 'in_progress':
        return { color: 'bg-green-100 text-green-800', icon: PlayCircle }
      case 'completed':
        return { color: 'bg-gray-100 text-gray-800', icon: CheckCircle }
      case 'cancelled':
        return { color: 'bg-red-100 text-red-800', icon: XCircle }
      case 'delayed':
        return { color: 'bg-yellow-100 text-yellow-800', icon: Clock }
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
    }
  }

  // Filter trips based on search
  const filteredTrips = trips.filter(trip => {
    if (!filters.search) return true
    const searchTerm = filters.search.toLowerCase()
    return (
      trip.tripNumber?.toLowerCase().includes(searchTerm) ||
      trip.route?.routeName?.toLowerCase().includes(searchTerm) ||
      trip.bus?.busNumber?.toLowerCase().includes(searchTerm) ||
      trip.driver?.name?.toLowerCase().includes(searchTerm)
    )
  })

  // Statistics cards
  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          {trend > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(trend)}% from last month
          </span>
        </div>
      )}
    </div>
  )

  // Trip card component
  const TripCard = ({ trip }) => {
    const statusInfo = getStatusInfo(trip.status)
    const StatusIcon = statusInfo.icon
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">{trip.tripNumber}</h3>
                {(trip.pickupPoints?.length > 1 || trip.dropPoints?.length > 1) && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    Round Trip
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {trip.route?.routeName || 'Unknown Route'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${statusInfo.color}`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {trip.status}
              </span>
              <div className="relative">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Bus className="h-4 w-4 mr-2" />
              {trip.bus?.busNumber || 'No Bus'}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              {trip.driver?.name || 'No Driver'}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              {trip.departureTime} - {trip.arrivalTime}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(trip.departureDate).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="h-4 w-4 mr-2" />
              ₹{trip.fare}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {trip.totalBookings || 0} bookings
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => openEditTrip(trip)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteTrip(trip._id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
                  <h1 className="text-2xl font-bold" style={{color: "#B99750"}}>Trip Management</h1>
              <p className="text-gray-600 mt-1">Manage bus trips, schedules, and staff assignments</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              <button
                onClick={() => {
                  setEditingTrip(null)
                  setShowAddModal(true)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Trip
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Statistics */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Trips"
              value={statistics.totalTrips}
              icon={BarChart3}
              color="bg-blue-500"
            />
            <StatCard
              title="Scheduled"
              value={statistics.scheduledTrips}
              icon={Calendar}
              color="bg-blue-500"
            />
            <StatCard
              title="In Progress"
              value={statistics.inProgressTrips}
              icon={PlayCircle}
              color="bg-green-500"
            />
            <StatCard
              title="Completed"
              value={statistics.completedTrips}
              icon={CheckCircle}
              color="bg-gray-500"
            />
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="input-field"
                >
                  <option value="">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                <select
                  value={filters.route}
                  onChange={(e) => setFilters(prev => ({ ...prev, route: e.target.value }))}
                  className="input-field"
                >
                  <option value="">All Routes</option>
                  {routes.map(route => (
                    <option key={route._id} value={route._id}>
                      {route.routeName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    placeholder="Search trips..."
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setFilters({
                    status: '',
                    route: '',
                    bus: '',
                    driver: '',
                    dateFrom: '',
                    dateTo: '',
                    search: ''
                  })}
                  className="btn-secondary w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedTrips.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-blue-900">
                  {selectedTrips.length} trip(s) selected
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBulkStatusUpdate('in_progress')}
                  className="btn-secondary text-sm"
                >
                  Start Selected
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('completed')}
                  className="btn-secondary text-sm"
                >
                  Complete Selected
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('cancelled')}
                  className="btn-secondary text-sm"
                >
                  Cancel Selected
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first trip</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
            >
              Create Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="btn-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Add/Edit Trip Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {editingTrip ? 'Edit Trip' : 'Create New Trip'}
                  </h3>
                  <button
                    onClick={closeModals}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmitTrip} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900">Trip Information</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Route *
                        </label>
                        <select
                          name="route"
                          value={tripForm.route}
                          onChange={handleTripInputChange}
                          className="input-field"
                          required
                        >
                          <option value="">Select Route</option>
                          {routes.length > 0 ? (
                            routes.map(route => (
                              <option key={route._id || route.id} value={route._id || route.id}>
                                {route.routeName || route.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>No routes available</option>
                          )}
                        </select>
                        {routes.length === 0 && (
                          <p className="text-xs text-red-500 mt-1">No routes found. Please create routes first.</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bus *
                        </label>
                        <select
                          name="bus"
                          value={tripForm.bus}
                          onChange={handleTripInputChange}
                          className="input-field"
                          required
                        >
                          <option value="">Select Bus</option>
                          {buses.length > 0 ? (
                            buses.map(bus => (
                              <option key={bus._id || bus.id} value={bus._id || bus.id}>
                                {bus.busNumber || bus.number} - {bus.busName || bus.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>No buses available</option>
                          )}
                        </select>
                        {buses.length === 0 && (
                          <p className="text-xs text-red-500 mt-1">No buses found. Please create buses first.</p>
                        )}
                      </div>


                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fare (₹) *
                        </label>
                        <input
                          type="number"
                          name="fare"
                          value={tripForm.fare}
                          onChange={handleTripInputChange}
                          className="input-field"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>

                    {/* Schedule Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900">Schedule</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Departure Time *
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
                          Arrival Time *
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

                      {/* Round Trip Toggle */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Trip Type
                        </label>
                        <div className="flex items-center space-x-4">
                          <span className={`text-sm font-medium ${!tripForm.isRoundTrip ? 'text-gray-900' : 'text-gray-500'}`}>
                            One Way
                          </span>
                          <button
                            type="button"
                            onClick={handleRoundTripToggle}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              tripForm.isRoundTrip ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                tripForm.isRoundTrip ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className={`text-sm font-medium ${tripForm.isRoundTrip ? 'text-gray-900' : 'text-gray-500'}`}>
                            Round Trip
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {tripForm.isRoundTrip 
                            ? 'Trip will return to starting point' 
                            : 'Trip is one-way only'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Trip Preview */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Trip Preview</h4>
                    <div className="text-sm text-gray-600">
                      {tripForm.route && tripForm.bus && tripForm.departureTime && tripForm.arrivalTime ? (
                        <div className="space-y-1">
                          <p><strong>Route:</strong> {routes.find(r => (r._id || r.id) === tripForm.route)?.routeName || routes.find(r => (r._id || r.id) === tripForm.route)?.name || 'Selected Route'}</p>
                          <p><strong>Bus:</strong> {buses.find(b => (b._id || b.id) === tripForm.bus)?.busNumber || buses.find(b => (b._id || b.id) === tripForm.bus)?.number || 'Selected Bus'}</p>
                          <p><strong>Time:</strong> {tripForm.departureTime} - {tripForm.arrivalTime}</p>
                          <p><strong>Type:</strong> {tripForm.isRoundTrip ? 'Round Trip' : 'One Way'}</p>
                          <p><strong>Fare:</strong> ₹{tripForm.fare || '0'}</p>
                        </div>
                      ) : (
                        <p className="text-gray-500">Fill in the required fields to see trip preview</p>
                      )}
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={false}
                      className="btn-primary"
                    >
                      {editingTrip ? 'Update Trip' : 'Create Trip'}
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