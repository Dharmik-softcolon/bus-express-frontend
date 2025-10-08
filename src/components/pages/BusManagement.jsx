import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
import { showToast } from '../../utils/toast'
import { busAPI } from '../../services/api'
import { 
  Bus, 
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Users,
  Wifi,
  Battery,
  Droplets,
  Coffee,
  Star,
  MapPin,
  Calendar,
  Fuel,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  Settings
} from 'lucide-react'

const BusManagement = () => {
  const { user } = useUser()
  const navigationItems = getNavigationMenu(user?.role)
  const [activeTab, setActiveTab] = useState('buses')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBus, setEditingBus] = useState(null)
  
  const [buses, setBuses] = useState([])
  const [ongoingRequests, setOngoingRequests] = useState(new Set())

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('latest')
  
  // Form validation states
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [busForm, setBusForm] = useState({
    busNumber: '',
    busName: '',
    type: 'AC',
    totalSeats: '',
    availableSeats: '',
    amenities: [],
    status: 'active',
    images: [],
    features: {
      wifi: false,
      charging: false,
      blankets: false,
      water: false,
      snacks: false
    },
    fuelCapacity: '',
    currentFuel: '',
    totalKm: '',
    lastServiceKm: '',
    fastTagNumber: '',
    description: ''
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

  // Fetch buses data
  const fetchBusesData = async () => {
    try {
      console.log('Fetching buses...')
      
      const response = await preventDuplicateRequest('buses', () => busAPI.getAllBuses({ limit: 50 }))
      
      console.log('Buses API Response:', response)
      
      if (response) {
        // Backend returns: { success: true, data: { buses: [...], pagination: {...} }, message: "...", timestamp: "..." }
        let busData = []
        
        if (response.success && response.data?.buses) {
          busData = response.data.buses
          console.log('Found buses in response.data.buses:', busData.length)
        } else if (response.data && Array.isArray(response.data)) {
          busData = response.data
          console.log('Found buses in response.data:', busData.length)
        } else if (response.buses && Array.isArray(response.buses)) {
          busData = response.buses
          console.log('Found buses in response.buses:', busData.length)
        } else if (Array.isArray(response)) {
          busData = response
          console.log('Response is directly an array:', busData.length)
        } else {
          console.log('No buses found in response:', response)
        }
        
        if (Array.isArray(busData) && busData.length > 0) {
          console.log('Setting buses:', busData)
          setBuses(busData)
        } else {
          console.log('Setting empty buses array')
          setBuses([])
        }
      } else {
        console.log('No response received')
        setBuses([])
      }
    } catch (error) {
      console.error('Error fetching buses data:', error)
      showToast.error(`Failed to load buses data: ${error.message}`)
      setBuses([])
    }
  }

  // Form validation
  const validateForm = () => {
    const errors = {}

    if (!busForm.busNumber.trim()) {
      errors.busNumber = 'Bus number is required'
    } else if (busForm.busNumber.trim().length < 3) {
      errors.busNumber = 'Bus number must be at least 3 characters'
    }

    if (!busForm.busName.trim()) {
      errors.busName = 'Bus name is required'
    } else if (busForm.busName.trim().length < 2) {
      errors.busName = 'Bus name must be at least 2 characters'
    }

    if (!busForm.totalSeats || busForm.totalSeats === '') {
      errors.totalSeats = 'Total seats is required'
    } else if (isNaN(busForm.totalSeats) || parseInt(busForm.totalSeats) < 1 || parseInt(busForm.totalSeats) > 100) {
      errors.totalSeats = 'Total seats must be between 1 and 100'
    }

    if (!busForm.fuelCapacity || busForm.fuelCapacity === '') {
      errors.fuelCapacity = 'Fuel capacity is required'
    } else if (isNaN(busForm.fuelCapacity) || parseFloat(busForm.fuelCapacity) <= 0) {
      errors.fuelCapacity = 'Fuel capacity must be a positive number'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  useEffect(() => {
    fetchBusesData()
  }, [])

  const handleBusInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.startsWith('features.')) {
      const featureName = name.split('.')[1]
      setBusForm(prev => ({
        ...prev,
        features: {
          ...prev.features,
          [featureName]: checked
        }
      }))
    } else if (name === 'amenities') {
      // Handle amenities selection
      const amenityValue = e.target.value
      setBusForm(prev => ({
        ...prev,
        amenities: checked 
          ? [...prev.amenities, amenityValue]
          : prev.amenities.filter(a => a !== amenityValue)
      }))
    } else {
    setBusForm(prev => ({
      ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
    
    // Clear form errors when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleCreateBus = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showToast.error('Please fix the form errors before submitting')
      return
    }

    setIsSubmitting(true)

    try {
      const busData = {
        busNumber: busForm.busNumber.toUpperCase(),
        busName: busForm.busName,
        type: busForm.type,
        totalSeats: parseInt(busForm.totalSeats),
        availableSeats: parseInt(busForm.availableSeats) || parseInt(busForm.totalSeats),
        amenities: busForm.amenities,
        status: busForm.status,
        features: busForm.features,
        fuelCapacity: parseFloat(busForm.fuelCapacity),
        currentFuel: parseFloat(busForm.currentFuel) || 0,
        totalKm: parseFloat(busForm.totalKm) || 0,
        lastServiceKm: parseFloat(busForm.lastServiceKm) || 0,
        fastTagNumber: busForm.fastTagNumber
      }

      console.log('Creating bus with data:', busData)

      const response = await preventDuplicateRequest('create-bus', () => busAPI.createBus(busData))

      console.log('Create bus response:', response)

      // Backend returns: { success: true, data: { bus: {...} }, message: "...", timestamp: "..." }
      if (response.success) {
        showToast.success(response.message || 'Bus created successfully')
        closeModals()
        fetchBusesData()
      } else {
        console.log('Create bus failed:', response)
        showToast.error(response.message || 'Failed to create bus')
      }
    } catch (error) {
      console.error('Error creating bus:', error)
      
      // Handle specific error cases
      if (error.message.includes('401') || error.message.includes('403')) {
        showToast.error('Authentication failed. Please login again.')
      } else if (error.message.includes('422')) {
        showToast.error('Bus number already exists or invalid data provided')
      } else if (error.message.includes('400')) {
        showToast.error('Invalid request data. Please check all fields.')
      } else if (error.message.includes('Network Error')) {
        showToast.error('Network error. Please check your connection.')
      } else {
        showToast.error(error.message || 'Failed to create bus')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateBus = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showToast.error('Please fix the form errors before submitting')
      return
    }

    if (!editingBus) return

    setIsSubmitting(true)

    try {
      const busId = editingBus._id || editingBus.id
      const updateData = {
        busNumber: busForm.busNumber.toUpperCase(),
        busName: busForm.busName,
        type: busForm.type,
        totalSeats: parseInt(busForm.totalSeats),
        availableSeats: parseInt(busForm.availableSeats),
        amenities: busForm.amenities,
        status: busForm.status,
        features: busForm.features,
        fuelCapacity: parseFloat(busForm.fuelCapacity),
        currentFuel: parseFloat(busForm.currentFuel) || 0,
        totalKm: parseFloat(busForm.totalKm) || 0,
        lastServiceKm: parseFloat(busForm.lastServiceKm) || 0,
        fastTagNumber: busForm.fastTagNumber
      }

      console.log('Updating bus with ID:', busId)
      console.log('Update data:', updateData)

      const response = await preventDuplicateRequest(`update-bus-${busId}`, () => busAPI.updateBus(busId, updateData))

      console.log('Update bus response:', response)

      // Backend returns: { success: true, data: { bus: {...} }, message: "...", timestamp: "..." }
      if (response.success) {
        showToast.success(response.message || 'Bus updated successfully')
        closeModals()
        fetchBusesData()
      } else {
        console.log('Update bus failed:', response)
        showToast.error(response.message || 'Failed to update bus')
      }
    } catch (error) {
      console.error('Error updating bus:', error)
      showToast.error(error.message || 'Failed to update bus')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteBus = async (busId) => {
    if (window.confirm('Are you sure you want to delete this bus? This action cannot be undone.')) {
      try {
        console.log('Deleting bus with ID:', busId)
        
        const response = await busAPI.deleteBus(busId)
        
        console.log('Delete bus response:', response)
        
        // Backend returns: { success: true, data: null, message: "...", timestamp: "..." }
        if (response.success) {
          showToast.success(response.message || 'Bus deleted successfully')
          fetchBusesData()
        } else {
          console.log('Delete bus failed:', response)
          showToast.error(response.message || 'Failed to delete bus')
        }
      } catch (error) {
        console.error('Error deleting bus:', error)
        showToast.error(error.message || 'Failed to delete bus')
      }
    }
  }

  const openEditBus = (bus) => {
    setEditingBus(bus)
    setBusForm({
      busNumber: bus.number || bus.busNumber || '',
      busName: bus.busName || bus.name || '',
      type: bus.type || 'AC',
      totalSeats: bus.totalSeats || bus.seats?.toString() || '',
      availableSeats: bus.availableSeats?.toString() || bus.totalSeats?.toString() || '',
      amenities: bus.amenities || [],
      status: bus.status || 'active',
      images: bus.images || [],
      features: bus.features || {
        wifi: false,
        charging: false,
        blankets: false,
        water: false,
        snacks: false
      },
      fuelCapacity: bus.fuelCapacity?.toString() || '',
      currentFuel: bus.currentFuel?.toString() || '',
      totalKm: bus.totalKm?.toString() || '',
      lastServiceKm: bus.lastServiceKm?.toString() || '',
      fastTagNumber: bus.fastTagNumber || '',
      description: bus.description || ''
    })
    setShowAddModal(true)
  }

  const closeModals = () => {
    setShowAddModal(false)
    setEditingBus(null)
    setBusForm({
      busNumber: '',
      busName: '',
      type: 'AC',
      totalSeats: '',
      availableSeats: '',
      amenities: [],
      status: 'active',
      images: [],
      features: {
        wifi: false,
        charging: false,
        blankets: false,
        water: false,
        snacks: false
      },
      fuelCapacity: '',
      currentFuel: '',
      totalKm: '',
      lastServiceKm: '',
      fastTagNumber: '',
      description: ''
    })
    setFormErrors({})
    setIsSubmitting(false)
  }

  // Filter and sort buses
  const filteredAndSortedBuses = () => {
    if (!Array.isArray(buses)) {
      return []
    }
    
    let filtered = buses.filter(bus => {
      const numberMatch = bus.busNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || bus.number?.toLowerCase().includes(searchTerm.toLowerCase()) || false
      const nameMatch = bus.busName?.toLowerCase().includes(searchTerm.toLowerCase()) || bus.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
      const typeMatch = bus.type?.toLowerCase().includes(searchTerm.toLowerCase()) || false
      
      const matchesSearch = searchTerm === '' || numberMatch || nameMatch || typeMatch
      
      const matchesStatus = filterStatus === 'all' || bus.status === filterStatus
      const matchesType = filterType === 'all' || bus.type === filterType
      
      return matchesSearch && matchesStatus && matchesType
    })

    // Sort buses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'number':
          return (a.busNumber || a.number || '').localeCompare(b.busNumber || b.number || '')
        case 'type':
          return (a.type || '').localeCompare(b.type || '')
        case 'seats':
          return (b.totalSeats || b.seats || 0) - (a.totalSeats || a.seats || 0)
        case 'latest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        default:
          return 0
      }
    })

    return filtered
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active': 
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': 
        return 'bg-red-100 text-red-800 border-red-200'
      case 'maintenance': 
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: 
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold" style={{color: "#B99750"}}>Bus Fleet Management</h1>
              <p className="text-gray-600 mt-1">Manage your bus fleet, schedules, and maintenance records</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchBusesData}
                disabled={false}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => {
                  setEditingBus(null)
                  setBusForm({
                    busNumber: '',
                    busName: '',
                    type: 'AC',
                    totalSeats: '',
                    availableSeats: '',
                    amenities: [],
                    status: 'active',
                    images: [],
                    features: {
                      wifi: false,
                      charging: false,
                      blankets: false,
                      water: false,
                      snacks: false
                    },
                    fuelCapacity: '',
                    currentFuel: '',
                    totalKm: '',
                    lastServiceKm: '',
                    fastTagNumber: '',
                    description: ''
                  })
                  setFormErrors({})
                  setShowAddModal(true)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Bus
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by bus number, name, or type..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
                <option value="Sleeper">Sleeper</option>
                <option value="Semi-Sleeper">Semi-Sleeper</option>
                <option value="Volvo">Volvo</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="number">Bus Number</option>
                <option value="type">Bus Type</option>
                <option value="seats">Seats</option>
              </select>
            </div>
          </div>
          </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bus className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Buses</p>
                <p className="text-2xl font-bold text-gray-900">{Array.isArray(buses) ? buses.length : 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Buses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(buses) ? buses.filter(b => b.status === 'active').length : 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Seats</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(buses) && buses.length > 0 
                    ? buses.reduce((sum, b) => sum + (b.totalSeats || b.seats || 0), 0)
                    : 0
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Capacity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(buses) && buses.length > 0 
                    ? Math.round(buses.reduce((sum, b) => sum + (b.totalSeats || b.seats || 0), 0) / buses.length)
                    : 0
                  } seats
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Buses List */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Buses</h2>
              {(searchTerm || filterStatus !== 'all' || filterType !== 'all') && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {filteredAndSortedBuses().length} result{(filteredAndSortedBuses().length !== 1 ? 's' : '')} found
                </span>
            )}
            </div>
          </div>
          
          {filteredAndSortedBuses().length === 0 ? (
            <div className="p-12 text-center">
              <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No buses found</h3>
              <p className="text-gray-600 mb-6">{searchTerm || filterStatus !== 'all' || filterType !== 'all' ? 'Try adjusting your search or filters.' : 'Get started by adding your first bus to the fleet.'}</p>
              {!searchTerm && filterStatus === 'all' && filterType === 'all' && (
                <button
                  onClick={() => {
                    setEditingBus(null)
                    setBusForm({
                      busNumber: '',
                      busName: '',
                      type: 'AC',
                      totalSeats: '',
                      availableSeats: '',
                      amenities: [],
                      status: 'active',
                      images: [],
                      features: {
                        wifi: false,
                        charging: false,
                        blankets: false,
                        water: false,
                        snacks: false
                      },
                      fuelCapacity: '',
                      currentFuel: '',
                      totalKm: '',
                      lastServiceKm: '',
                      fastTagNumber: '',
                      description: ''
                    })
                    setFormErrors({})
                    setShowAddModal(true)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add New Bus
                </button>
              )}
              </div>
            ) : (
            <div className="divide-y divide-gray-200">
              {filteredAndSortedBuses().map((bus) => (
                <div key={bus._id || bus.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <Bus className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{bus.busNumber || bus.number}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(bus.status)}`}>
                            {bus.status || 'Active'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Name:</span>
                            {bus.busName || bus.name || 'Not specified'}
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Type:</span>
                            {bus.type || 'Not specified'}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-400" />
                            {bus.totalSeats || bus.seats || 0} seats
                          </div>
                          <div className="flex items-center">
                            <Fuel className="h-4 w-4 mr-1 text-gray-400" />
                            {bus.fuelCapacity || 0}L capacity
                          </div>
                        </div>
                        {(bus.features && Object.values(bus.features).some(Boolean)) && (
                          <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                            <span className="font-medium">Features:</span>
                            {bus.features.wifi && <span className="flex items-center gap-1"><Wifi className="h-3 w-3" />WiFi</span>}
                            {bus.features.charging && <span className="flex items-center gap-1"><Battery className="h-3 w-3" />Charging</span>}
                            {bus.features.blankets && <span className="flex items-center gap-1"><Droplets className="h-3 w-3" />Blankets</span>}
                            {bus.features.water && <span className="flex items-center gap-1"><Coffee className="h-3 w-3" />Water</span>}
                            {bus.features.snacks && <span className="flex items-center gap-1"><Star className="h-3 w-3" />Snacks</span>}
                          </div>
                        )}
                        {bus.fastTagNumber && (
                          <div className="text-sm text-gray-500">
                            <span className="font-medium">FastTag:</span> {bus.fastTagNumber}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => openEditBus(bus)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit bus"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBus(bus._id || bus.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete bus"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>))}
                </div>
            )}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingBus ? 'Edit Bus' : 'Add New Bus'}
                </h2>
              </div>
              
              <form onSubmit={editingBus ? handleUpdateBus : handleCreateBus}>
                <div className="px-6 py-6 space-y-6">
                  {/* Basic Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bus Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bus Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="busNumber"
                        value={busForm.busNumber}
                        onChange={handleBusInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.busNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., KA-01-AB-1234"
                      />
                      {formErrors.busNumber && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.busNumber}</p>
                      )}
                    </div>

                    {/* Bus Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bus Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="busName"
                        value={busForm.busName}
                        onChange={handleBusInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.busName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., Express Deluxe"
                      />
                      {formErrors.busName && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.busName}</p>
                      )}
                    </div>

                    {/* Bus Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bus Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="type"
                        value={busForm.type}
                        onChange={handleBusInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="AC">AC</option>
                        <option value="Non-AC">Non-AC</option>
                        <option value="Sleeper">Sleeper</option>
                        <option value="Semi-Sleeper">Semi-Sleeper</option>
                        <option value="Volvo">Volvo</option>
                        <option value="Luxury">Luxury</option>
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="status"
                        value={busForm.status}
                        onChange={handleBusInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>

                  {/* Seating Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Seats <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="totalSeats"
                        value={busForm.totalSeats}
                        onChange={handleBusInputChange}
                        min="1"
                        max="100"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.totalSeats ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 40"
                      />
                      {formErrors.totalSeats && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.totalSeats}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Seats
                      </label>
                      <input
                        type="number"
                        name="availableSeats"
                        value={busForm.availableSeats}
                        onChange={handleBusInputChange}
                        min="0"
                        max={busForm.totalSeats || 100}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Defaults to total seats"
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Bus Features
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          name="features.wifi"
                          checked={busForm.features.wifi}
                          onChange={handleBusInputChange}
                          className="mr-2"
                        />
                        <Wifi className="h-4 w-4 mr-2 text-blue-600" />
                        WiFi
                      </label>
                      <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          name="features.charging"
                          checked={busForm.features.charging}
                          onChange={handleBusInputChange}
                          className="mr-2"
                        />
                        <Battery className="h-4 w-4 mr-2 text-green-600" />
                        Charging
                      </label>
                      <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          name="features.blankets"
                          checked={busForm.features.blankets}
                          onChange={handleBusInputChange}
                          className="mr-2"
                        />
                        <Droplets className="h-4 w-4 mr-2 text-orange-600" />
                        Blankets
                      </label>
                      <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          name="features.water"
                          checked={busForm.features.water}
                          onChange={handleBusInputChange}
                          className="mr-2"
                        />
                        <Coffee className="h-4 w-4 mr-2 text-blue-600" />
                        Water
                      </label>
                      <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          name="features.snacks"
                          checked={busForm.features.snacks}
                          onChange={handleBusInputChange}
                          className="mr-2"
                        />
                        <Star className="h-4 w-4 mr-2 text-yellow-600" />
                        Snacks
                      </label>
                    </div>
                  </div>

                  {/* Fuel Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fuel Capacity (Liters) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="fuelCapacity"
                        value={busForm.fuelCapacity}
                        onChange={handleBusInputChange}
                        min="0"
                        step="0.1"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          formErrors.fuelCapacity ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="e.g., 100"
                      />
                      {formErrors.fuelCapacity && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.fuelCapacity}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Fuel (Liters)
                      </label>
                      <input
                        type="number"
                        name="currentFuel"
                        value={busForm.currentFuel}
                        onChange={handleBusInputChange}
                        min="0"
                        max={busForm.fuelCapacity || 1000}
                        step="0.1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 50"
                      />
                    </div>
                  </div>

                  {/* Mileage Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Kilometers
                      </label>
                      <input
                        type="number"
                        name="totalKm"
                        value={busForm.totalKm}
                        onChange={handleBusInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 50000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Service (Km)
                      </label>
                      <input
                        type="number"
                        name="lastServiceKm"
                        value={busForm.lastServiceKm}
                        onChange={handleBusInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 45000"
                      />
                    </div>
                  </div>

                  {/* FastTag */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      FastTag Number
                    </label>
                    <input
                      type="text"
                      name="fastTagNumber"
                      value={busForm.fastTagNumber}
                      onChange={handleBusInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., FT123456789"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={busForm.description}
                      onChange={handleBusInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Additional details about the bus..."
                    />
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingBus ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingBus ? 'Update Bus' : 'Create Bus'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BusManagement
