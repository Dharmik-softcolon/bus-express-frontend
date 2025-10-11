import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, MapPin, Users, Calendar, Clock, Bus, Route, DollarSign } from 'lucide-react'
import { tripAPI } from '../../services/api'

const TripManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTrip, setEditingTrip] = useState(null)
  const [activeTab, setActiveTab] = useState('trips')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [trips, setTrips] = useState([])
  
  // Load trips on component mount
  useEffect(() => {
    loadTrips()
  }, [])
  
  const loadTrips = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await tripAPI.getAllTrips()
      if (response.success) {
        setTrips(response.data.trips || [])
          } else {
            setError('Failed to load trips')
            setTrips([])
          }
    } catch (error) {
      console.error('Error loading trips:', error)
      setError('Failed to load trips')
      setTrips([])
    } finally {
      setLoading(false)
    }
  }
  
  // Trip CRUD operations
  const handleAddTrip = async (tripData) => {
    try {
      const response = await tripAPI.createTrip(tripData)
      if (response.success) {
        await loadTrips() // Reload trips
        setShowAddModal(false)
        return { success: true }
      } else {
        return { success: false, error: response.message || 'Failed to add trip' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to add trip' }
    }
  }
  
  const handleUpdateTrip = async (tripId, tripData) => {
    try {
      const response = await tripAPI.updateTrip(tripId, tripData)
      if (response.success) {
        await loadTrips() // Reload trips
        setEditingTrip(null)
        return { success: true }
      } else {
        return { success: false, error: response.message || 'Failed to update trip' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to update trip' }
    }
  }
  
  const handleDeleteTrip = async (tripId) => {
    try {
      const response = await tripAPI.deleteTrip(tripId)
      if (response.success) {
        await loadTrips() // Reload trips
        return { success: true }
      } else {
        return { success: false, error: response.message || 'Failed to delete trip' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to delete trip' }
    }
  }
  
  const handleUpdateTripStatus = async (tripId, status) => {
    try {
      const response = await tripAPI.updateTripStatus(tripId, status)
      if (response.success) {
        await loadTrips() // Reload trips
        return { success: true }
      } else {
        return { success: false, error: response.message || 'Failed to update trip status' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to update trip status' }
    }
  }

  const [buses, setBuses] = useState([
    { id: 1, busNumber: 'BE-001', busName: 'Express Deluxe', capacity: 45, status: 'available' },
    { id: 2, busNumber: 'BE-002', busName: 'City Connect', capacity: 50, status: 'available' },
    { id: 3, busNumber: 'BE-003', busName: 'Luxury Express', capacity: 35, status: 'maintenance' }
  ])

  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Smith', role: 'Driver', license: 'DL123456', phone: '+1-555-0101' },
    { id: 2, name: 'Mike Johnson', role: 'Helper', phone: '+1-555-0102' },
    { id: 3, name: 'Sarah Wilson', role: 'Driver', license: 'DL789012', phone: '+1-555-0103' },
    { id: 4, name: 'David Brown', role: 'Helper', phone: '+1-555-0104' }
  ])

  const [routes, setRoutes] = useState([
    { id: 1, name: 'New York → Boston', distance: 215, duration: '4h 30m' },
    { id: 2, name: 'Los Angeles → San Francisco', distance: 383, duration: '6h 15m' },
    { id: 3, name: 'Chicago → Detroit', distance: 282, duration: '4h 45m' }
  ])

  const [formData, setFormData] = useState({
    tripNumber: '',
    route: '',
    busNumber: '',
    driver: '',
    helper: '',
    departureTime: '',
    arrivalTime: '',
    departureDate: '',
    fare: '',
    status: 'scheduled'
  })

  const [pickupPoints, setPickupPoints] = useState([])
  const [dropPoints, setDropPoints] = useState([])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const addPickupPoint = () => {
    const newPoint = {
      id: Date.now(),
      name: '',
      time: '',
      address: ''
    }
    setPickupPoints(prev => [...prev, newPoint])
  }

  const addDropPoint = () => {
    const newPoint = {
      id: Date.now(),
      name: '',
      time: '',
      address: ''
    }
    setDropPoints(prev => [...prev, newPoint])
  }

  const updatePickupPoint = (id, field, value) => {
    setPickupPoints(prev => prev.map(point => 
      point.id === id ? { ...point, [field]: value } : point
    ))
  }

  const updateDropPoint = (id, field, value) => {
    setDropPoints(prev => prev.map(point => 
      point.id === id ? { ...point, [field]: value } : point
    ))
  }

  const removePickupPoint = (id) => {
    setPickupPoints(prev => prev.filter(point => point.id !== id))
  }

  const removeDropPoint = (id) => {
    setDropPoints(prev => prev.filter(point => point.id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingTrip) {
      setTrips(prev => prev.map(trip => 
        trip.id === editingTrip.id 
          ? { 
              ...trip, 
              ...formData, 
              pickupPoints, 
              dropPoints,
              totalBookings: 0,
              availableSeats: buses.find(b => b.busNumber === formData.busNumber)?.capacity || 0
            } 
          : trip
      ))
    } else {
      const newTrip = {
        ...formData,
        id: trips.length + 1,
        pickupPoints,
        dropPoints,
        totalBookings: 0,
        availableSeats: buses.find(b => b.busNumber === formData.busNumber)?.capacity || 0
      }
      setTrips(prev => [...prev, newTrip])
    }
    setShowAddModal(false)
    setEditingTrip(null)
    setFormData({
      tripNumber: '',
      route: '',
      busNumber: '',
      driver: '',
      helper: '',
      departureTime: '',
      arrivalTime: '',
      departureDate: '',
      fare: '',
      status: 'scheduled'
    })
    setPickupPoints([])
    setDropPoints([])
  }

  const handleEdit = (trip) => {
    setEditingTrip(trip)
    setFormData(trip)
    setPickupPoints(trip.pickupPoints || [])
    setDropPoints(trip.dropPoints || [])
    setShowAddModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      setTrips(prev => prev.filter(trip => trip.id !== id))
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderTripList = () => (
    <div className="space-y-4">
      {trips.map((trip) => (
        <div key={trip.id} className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{trip.tripNumber}</h3>
              <p className="text-gray-600">{trip.route}</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                {trip.status}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(trip)}
                className="text-primary hover:text-blue-900"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(trip.id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Trip Details */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Trip Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Bus className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{trip.busNumber}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{trip.departureDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{trip.departureTime} - {trip.arrivalTime}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                  <span>${trip.fare}</span>
                </div>
              </div>
            </div>

            {/* Staff */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Staff</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <span>Driver: {trip.driver}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <span>Helper: {trip.helper}</span>
                </div>
              </div>
            </div>

            {/* Bookings */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Bookings</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <span>Total: {trip.totalBookings}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <span>Available: {trip.availableSeats}</span>
                </div>
              </div>
            </div>

            {/* Pickup/Drop Points */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Stops</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span>Pickup: {trip.pickupPoints?.length || 0}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span>Drop: {trip.dropPoints?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderTripDetails = () => (
    <div className="space-y-6">
      {trips.map((trip) => (
        <div key={trip.id} className="card">
          <h3 className="text-lg font-semibold mb-4">{trip.tripNumber} - {trip.route}</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pickup Points */}
            <div>
              <h4 className="font-medium mb-3">Pickup Points</h4>
              <div className="space-y-2">
                {trip.pickupPoints?.map((point, index) => (
                  <div key={point.id} className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">{point.name}</span>
                        <p className="text-sm text-gray-600">{point.address}</p>
                      </div>
                      <span className="text-sm font-medium text-primary">{point.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Drop Points */}
            <div>
              <h4 className="font-medium mb-3">Drop Points</h4>
              <div className="space-y-2">
                {trip.dropPoints?.map((point, index) => (
                  <div key={point.id} className="p-3 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">{point.name}</span>
                        <p className="text-sm text-gray-600">{point.address}</p>
                      </div>
                      <span className="text-sm font-medium text-green-600">{point.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Trip Management
              </h1>
              <p className="text-gray-600">
                Create and manage bus trips with pickup/drop points and staff assignment
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Trip
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {[
              { id: 'trips', name: 'Trip List' },
              { id: 'details', name: 'Trip Details' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'trips' && renderTripList()}
        {activeTab === 'details' && renderTripDetails()}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingTrip ? 'Edit Trip' : 'Create New Trip'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Trip Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trip Number
                      </label>
                      <input
                        type="text"
                        name="tripNumber"
                        value={formData.tripNumber}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Route
                      </label>
                      <select
                        name="route"
                        value={formData.route}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      >
                        <option value="">Select Route</option>
                        {routes.map(route => (
                          <option key={route.id} value={route.name}>{route.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bus Number
                      </label>
                      <select
                        name="busNumber"
                        value={formData.busNumber}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      >
                        <option value="">Select Bus</option>
                        {buses.filter(bus => bus.status === 'available').map(bus => (
                          <option key={bus.id} value={bus.busNumber}>{bus.busNumber} - {bus.busName}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Driver
                      </label>
                      <select
                        name="driver"
                        value={formData.driver}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      >
                        <option value="">Select Driver</option>
                        {employees.filter(emp => emp.role === 'Driver').map(emp => (
                          <option key={emp.id} value={emp.name}>{emp.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Helper
                      </label>
                      <select
                        name="helper"
                        value={formData.helper}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      >
                        <option value="">Select Helper</option>
                        {employees.filter(emp => emp.role === 'Helper').map(emp => (
                          <option key={emp.id} value={emp.name}>{emp.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departure Date
                      </label>
                      <input
                        type="date"
                        name="departureDate"
                        value={formData.departureDate}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departure Time
                      </label>
                      <input
                        type="time"
                        name="departureTime"
                        value={formData.departureTime}
                        onChange={handleInputChange}
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
                        value={formData.arrivalTime}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fare ($)
                      </label>
                      <input
                        type="number"
                        name="fare"
                        value={formData.fare}
                        onChange={handleInputChange}
                        className="input-field"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  {/* Pickup Points */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">Pickup Points</h4>
                      <button
                        type="button"
                        onClick={addPickupPoint}
                        className="btn-outline text-sm"
                      >
                        Add Pickup Point
                      </button>
                    </div>
                    <div className="space-y-3">
                      {pickupPoints.map((point) => (
                        <div key={point.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-blue-50 rounded-lg">
                          <input
                            type="text"
                            placeholder="Point Name"
                            value={point.name}
                            onChange={(e) => updatePickupPoint(point.id, 'name', e.target.value)}
                            className="input-field"
                            required
                          />
                          <input
                            type="time"
                            value={point.time}
                            onChange={(e) => updatePickupPoint(point.id, 'time', e.target.value)}
                            className="input-field"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Address"
                            value={point.address}
                            onChange={(e) => updatePickupPoint(point.id, 'address', e.target.value)}
                            className="input-field"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removePickupPoint(point.id)}
                            className="btn-secondary text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Drop Points */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">Drop Points</h4>
                      <button
                        type="button"
                        onClick={addDropPoint}
                        className="btn-outline text-sm"
                      >
                        Add Drop Point
                      </button>
                    </div>
                    <div className="space-y-3">
                      {dropPoints.map((point) => (
                        <div key={point.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-green-50 rounded-lg">
                          <input
                            type="text"
                            placeholder="Point Name"
                            value={point.name}
                            onChange={(e) => updateDropPoint(point.id, 'name', e.target.value)}
                            className="input-field"
                            required
                          />
                          <input
                            type="time"
                            value={point.time}
                            onChange={(e) => updateDropPoint(point.id, 'time', e.target.value)}
                            className="input-field"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Address"
                            value={point.address}
                            onChange={(e) => updateDropPoint(point.id, 'address', e.target.value)}
                            className="input-field"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removeDropPoint(point.id)}
                            className="btn-secondary text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
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
                      <option value="scheduled">Scheduled</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false)
                        setEditingTrip(null)
                        setPickupPoints([])
                        setDropPoints([])
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      {editingTrip ? 'Update' : 'Create'} Trip
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

