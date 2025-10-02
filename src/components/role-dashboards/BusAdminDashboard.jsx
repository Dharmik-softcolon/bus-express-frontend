import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
import { showToast } from '../../utils/toast'
import { dashboardAPI, busEmployeeAPI, bookingManagerAPI, busAPI, routeAPI, tripAPI } from '../../services/api'
import { 
  Bus, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  UserCheck,
  UserX
} from 'lucide-react'

const BusAdminDashboard = () => {
  const { user } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('dashboard')
  const navigationItems = getNavigationMenu(user?.role)
  const [showAddModal, setShowAddModal] = useState(false)
  const [modalType, setModalType] = useState('employee') // 'employee', 'booking-manager', 'bus', 'route', 'trip'
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [editingBookingMan, setEditingBookingMan] = useState(null)
  const [editingBus, setEditingBus] = useState(null)
  const [editingRoute, setEditingRoute] = useState(null)
  const [editingTrip, setEditingTrip] = useState(null)

  // Dynamic data state
  const [dashboardData, setDashboardData] = useState(null)
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [busEmployees, setBusEmployees] = useState([])
  const [busEmployeesLoading, setBusEmployeesLoading] = useState(true)
  const [bookingManagers, setBookingManagers] = useState([])
  const [bookingManagersLoading, setBookingManagersLoading] = useState(true)
  const [buses, setBuses] = useState([])
  const [busesLoading, setBusesLoading] = useState(true)
  const [routes, setRoutes] = useState([])
  const [routesLoading, setRoutesLoading] = useState(true)
  
  // Request tracking to prevent duplicates
  const [ongoingRequests, setOngoingRequests] = useState(new Set())
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Form state
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    subrole: '',
    position: '',
    address: '',
    aadhaarCard: '',
    license: '',
    assignedBus: '',
    salary: '',
    status: 'active'
  })

  const [bookingManagerForm, setBookingManagerForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    position: '',
    address: '',
    commission: '',
    aadhaarCard: '',
    status: 'active'
  })

  const [busForm, setBusForm] = useState({
    number: '',
    type: 'Standard',
    capacity: '',
    driver: '',
    helper: '',
    status: 'active'
  })

  const [routeForm, setRouteForm] = useState({
    name: '',
    from: '',
    to: '',
    distance: '',
    duration: '',
    totalTrips: '',
    status: 'active'
  })

  const [tripForm, setTripForm] = useState({
    route: '',
    bus: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    status: 'active'
  })

  // Fetch dashboard data only
  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true)
      const response = await preventDuplicateRequest('dashboard', () => dashboardAPI.getBusAdminDashboard())
      if (response && response.success) {
        setDashboardData(response.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      showToast('Failed to load dashboard data', 'error')
    } finally {
      setDashboardLoading(false)
    }
  }

  // Fetch employees data
  const fetchEmployeesData = async () => {
    try {
      setBusEmployeesLoading(true)
      const response = await preventDuplicateRequest('employees', () => busEmployeeAPI.getAllEmployees({ limit: 20 }))
      if (response && response.success) {
        setBusEmployees(response.data.busEmployees || [])
      }
    } catch (error) {
      console.error('Error fetching employees data:', error)
      showToast('Failed to load employees data', 'error')
    } finally {
      setBusEmployeesLoading(false)
    }
  }

  // Fetch booking managers data
  const fetchBookingManagersData = async () => {
    try {
      setBookingManagersLoading(true)
      const response = await preventDuplicateRequest('booking-managers', () => bookingManagerAPI.getAllBookingManagers({ limit: 20 }))
      if (response && response.success) {
        setBookingManagers(response.data.bookingManagers || [])
      }
    } catch (error) {
      console.error('Error fetching booking managers data:', error)
      showToast('Failed to load booking managers data', 'error')
    } finally {
      setBookingManagersLoading(false)
    }
  }

  // Fetch buses data
  const fetchBusesData = async () => {
    try {
      setBusesLoading(true)
      const response = await preventDuplicateRequest('buses', () => busAPI.getAllBuses({ limit: 50 }))
      if (response && response.success) {
        setBuses(response.data.buses || [])
      }
    } catch (error) {
      console.error('Error fetching buses data:', error)
      showToast('Failed to load buses data', 'error')
    } finally {
      setBusesLoading(false)
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

  // Helper function to add delay between requests
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  // Helper function to prevent duplicate requests
  const preventDuplicateRequest = async (requestKey, apiCall, maxRetries = 3, baseDelay = 1000) => {
    // Check if request is already ongoing
    if (ongoingRequests.has(requestKey)) {
      console.log(`Request ${requestKey} already in progress, skipping...`)
      return null
    }

    // Add to ongoing requests
    setOngoingRequests(prev => new Set([...prev, requestKey]))

    try {
      // Retry logic with exponential backoff
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const result = await apiCall()
          return result
        } catch (error) {
          if (error.message.includes('429') && attempt < maxRetries - 1) {
            const delayTime = baseDelay * Math.pow(2, attempt) // Exponential backoff
            console.log(`Rate limited. Retrying in ${delayTime}ms... (attempt ${attempt + 1}/${maxRetries})`)
            await delay(delayTime)
            continue
          }
          throw error
        }
      }
    } finally {
      // Remove from ongoing requests
      setOngoingRequests(prev => {
        const newSet = new Set(prev)
        newSet.delete(requestKey)
        return newSet
      })
    }
  }

  // Fetch all data function (only for initial load) with sequential calls to avoid rate limiting
  const fetchAllData = async () => {
    if (!isInitialLoad) {
      console.log('Initial load already completed, skipping...')
      return
    }
    
    try {
      console.log('Starting initial data fetch...')
      setIsInitialLoad(false)
      
      // Fetch dashboard data first
      await fetchDashboardData()
      await delay(200) // 200ms delay between requests
      
      // Fetch employees data
      await fetchEmployeesData()
      await delay(200)
      
      // Fetch booking managers data
      await fetchBookingManagersData()
      await delay(200)
      
      // Fetch buses data
      await fetchBusesData()
      await delay(200)
      
      // Fetch routes data
      await fetchRoutesData()
      
      console.log('Initial data fetch completed')
    } catch (error) {
      console.error('Error in fetchAllData:', error)
      setIsInitialLoad(true) // Reset on error to allow retry
    }
  }

  // Fetch all data on component mount (only once)
  useEffect(() => {
    if (isInitialLoad) {
      fetchAllData()
    }
  }, []) // Empty dependency array ensures this runs only once

  // Employee management functions
  const handleCreateEmployee = async (e) => {
    e.preventDefault()
    try {
      const response = await preventDuplicateRequest('create-employee', () => busEmployeeAPI.createEmployee(employeeForm))
      if (response.success) {
        showToast('Bus employee created successfully', 'success')
        setShowAddModal(false)
        setEmployeeForm({
          name: '',
          email: '',
          password: '',
          phone: '',
          subrole: '',
          position: '',
          address: '',
          aadhaarCard: '',
          license: '',
          assignedBus: '',
          salary: '',
          status: 'active'
        })
        fetchEmployeesData()
      }
    } catch (error) {
      console.error('Error creating employee:', error)
      showToast('Failed to create employee', 'error')
    }
  }

  const handleUpdateEmployee = async (e) => {
    e.preventDefault()
    try {
      const response = await preventDuplicateRequest('update-employee', () => busEmployeeAPI.updateEmployee(editingEmployee.id, employeeForm))
      if (response.success) {
        showToast('Bus employee updated successfully', 'success')
        setEditingEmployee(null)
        setEmployeeForm({
          name: '',
          email: '',
          password: '',
          phone: '',
          subrole: '',
          position: '',
          address: '',
          aadhaarCard: '',
          license: '',
          assignedBus: '',
          salary: '',
          status: 'active'
        })
        fetchEmployeesData()
      }
    } catch (error) {
      console.error('Error updating employee:', error)
      showToast('Failed to update employee', 'error')
    }
  }

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await busEmployeeAPI.deleteEmployee(employeeId)
        if (response.success) {
          showToast('Employee deleted successfully', 'success')
          fetchEmployeesData()
        }
      } catch (error) {
        console.error('Error deleting employee:', error)
        showToast('Failed to delete employee', 'error')
      }
    }
  }

  const handleToggleEmployeeStatus = async (employeeId) => {
    try {
      const response = await busEmployeeAPI.updateEmployeeStatus(employeeId)
      if (response.success) {
        showToast('Employee status updated successfully', 'success')
        fetchEmployeesData()
      }
    } catch (error) {
      console.error('Error updating employee status:', error)
      showToast('Failed to update employee status', 'error')
    }
  }

  // Booking manager management functions
  const handleCreateBookingManager = async (e) => {
    e.preventDefault()
    try {
      const response = await preventDuplicateRequest('create-booking-manager', () => bookingManagerAPI.createBookingManager(bookingManagerForm))
      if (response.success) {
        showToast('Booking manager created successfully', 'success')
        setShowAddModal(false)
        setBookingManagerForm({
          name: '',
          email: '',
          password: '',
          phone: '',
          position: '',
          address: '',
          commission: '',
          aadhaarCard: '',
          status: 'active'
        })
        fetchBookingManagersData()
      }
    } catch (error) {
      console.error('Error creating booking manager:', error)
      showToast('Failed to create booking manager', 'error')
    }
  }

  const handleUpdateBookingManager = async (e) => {
    e.preventDefault()
    try {
      const response = await preventDuplicateRequest('update-booking-manager', () => bookingManagerAPI.updateBookingManager(editingBookingMan.id, bookingManagerForm))
      if (response.success) {
        showToast('Booking manager updated successfully', 'success')
        setEditingBookingMan(null)
        setBookingManagerForm({
          name: '',
          email: '',
          password: '',
          phone: '',
          position: '',
          address: '',
          commission: '',
          aadhaarCard: '',
          status: 'active'
        })
        fetchBookingManagersData()
      }
    } catch (error) {
      console.error('Error updating booking manager:', error)
      showToast('Failed to update booking manager', 'error')
    }
  }

  const handleDeleteBookingManager = async (managerId) => {
    if (window.confirm('Are you sure you want to delete this booking manager?')) {
      try {
        const response = await bookingManagerAPI.deleteBookingManager(managerId)
        if (response.success) {
          showToast('Booking manager deleted successfully', 'success')
          fetchBookingManagersData()
        }
      } catch (error) {
        console.error('Error deleting booking manager:', error)
        showToast('Failed to delete booking manager', 'error')
      }
    }
  }

  // Helper functions
  const openEditEmployee = (employee) => {
    setEditingEmployee(employee)
    setEmployeeForm({
      name: employee.name || '',
      email: employee.email || '',
      password: '',
      phone: employee.phone || '',
      subrole: employee.subrole || '',
      position: employee.position || '',
      address: employee.address || '',
      aadhaarCard: employee.aadhaarCard || '',
      license: employee.license || '',
      assignedBus: employee.assignedBus || '',
      salary: employee.salary || '',
      status: employee.status || 'active'
    })
  }

  const openEditBookingManager = (manager) => {
    setEditingBookingMan(manager)
    setBookingManagerForm({
      name: manager.name || '',
      email: manager.email || '',
      password: '',
      phone: manager.phone || '',
      position: manager.position || '',
      address: manager.address || '',
      commission: manager.commission || '',
      aadhaarCard: manager.aadhaarCard || '',
      status: manager.status || 'active'
    })
  }

  const closeModals = () => {
    setShowAddModal(false)
    setModalType('employee')
    setEditingEmployee(null)
    setEditingBookingMan(null)
    setEditingBus(null)
    setEditingRoute(null)
    setEditingTrip(null)
    setEmployeeForm({
      name: '',
      email: '',
      password: '',
      phone: '',
      subrole: '',
      position: '',
      address: '',
      aadhaarCard: '',
      license: '',
      assignedBus: '',
      salary: '',
      status: 'active'
    })
    setBookingManagerForm({
      name: '',
      email: '',
      password: '',
      phone: '',
      position: '',
      address: '',
      commission: '',
      aadhaarCard: '',
      status: 'active'
    })
    setBusForm({
      number: '',
      type: 'Standard',
      capacity: '',
      driver: '',
      helper: '',
      status: 'active'
    })
    setRouteForm({
      name: '',
      from: '',
      to: '',
      distance: '',
      duration: '',
      totalTrips: '',
      status: 'active'
    })
    setTripForm({
      route: '',
      bus: '',
      departureTime: '',
      arrivalTime: '',
      price: '',
      status: 'active'
    })
  }

  // Form input change handlers
  const handleEmployeeInputChange = (e) => {
    const { name, value } = e.target
    setEmployeeForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBookingManInputChange = (e) => {
    const { name, value } = e.target
    setBookingManagerForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBusInputChange = (e) => {
    const { name, value } = e.target
    setBusForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRouteInputChange = (e) => {
    const { name, value } = e.target
    setRouteForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTripInputChange = (e) => {
    const { name, value } = e.target
    setTripForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Form submission handlers
  const handleEmployeeSubmit = async (e) => {
    e.preventDefault()
    if (editingEmployee) {
      await handleUpdateEmployee(e)
    } else {
      await handleCreateEmployee(e)
    }
  }

  const handleBookingManSubmit = async (e) => {
    e.preventDefault()
    if (editingBookingMan) {
      await handleUpdateBookingManager(e)
    } else {
      await handleCreateBookingManager(e)
    }
  }

  // Bus management functions
  const handleCreateBus = async (e) => {
    e.preventDefault()
    try {
      const response = await preventDuplicateRequest('create-bus', () => busAPI.createBus(busForm))
      if (response.success) {
        showToast('Bus created successfully', 'success')
        setShowAddModal(false)
        setBusForm({
          number: '',
          type: 'Standard',
          capacity: '',
          driver: '',
          helper: '',
          status: 'active'
        })
        fetchBusesData()
      }
    } catch (error) {
      console.error('Error creating bus:', error)
      showToast('Failed to create bus', 'error')
    }
  }

  const handleUpdateBus = async (e) => {
    e.preventDefault()
    try {
      const response = await preventDuplicateRequest('update-bus', () => busAPI.updateBus(editingBus.id, busForm))
      if (response.success) {
        showToast('Bus updated successfully', 'success')
        setEditingBus(null)
        setBusForm({
          number: '',
          type: 'Standard',
          capacity: '',
          driver: '',
          helper: '',
          status: 'active'
        })
        fetchBusesData()
      }
    } catch (error) {
      console.error('Error updating bus:', error)
      showToast('Failed to update bus', 'error')
    }
  }

  const handleDeleteBus = async (busId) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        const response = await busAPI.deleteBus(busId)
        if (response.success) {
          showToast('Bus deleted successfully', 'success')
          fetchBusesData()
        }
      } catch (error) {
        console.error('Error deleting bus:', error)
        showToast('Failed to delete bus', 'error')
      }
    }
  }

  // Route management functions
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

  // Trip management functions
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
        // TODO: Add fetchTripsData() when trips API is implemented
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
        // TODO: Add fetchTripsData() when trips API is implemented
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
          // TODO: Add fetchTripsData() when trips API is implemented
        }
      } catch (error) {
        console.error('Error deleting trip:', error)
        showToast('Failed to delete trip', 'error')
      }
    }
  }

  // Mock data for demonstration (will be replaced with real data)
  const mockStats = {
    totalBuses: buses.length,
    activeRoutes: routes.filter(route => route.status === 'active').length,
    totalTrips: dashboardData?.statistics?.totalTrips || 0,
    monthlyRevenue: dashboardData?.statistics?.monthlyRevenue || 0,
    totalBookings: dashboardData?.statistics?.totalBookings || 0,
    maintenanceDue: buses.filter(bus => bus.status === 'maintenance').length,
    totalEmployees: dashboardData?.statistics?.totalBusEmployees || 0,
    totalBookingMen: dashboardData?.statistics?.totalBookingManagers || 0
  }

  if (dashboardLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }


  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Bus className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Buses</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.totalBuses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Routes</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.activeRoutes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bus Employees</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Booking Managers</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.totalBookingMen}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100">
              <Calendar className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Trips</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.totalTrips}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{mockStats.monthlyRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-pink-100">
              <TrendingUp className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.totalBookings.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Maintenance Due</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.maintenanceDue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Route-Bus Assignments */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Route-Bus Assignments</h3>
        {routesLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading routes...</p>
          </div>
        ) : routes.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No routes found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {routes.map((route) => (
              <div key={route._id || route.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{route.name || route.routeName}</h4>
                    <p className="text-sm text-gray-600">
                      {route.distance ? `${route.distance} km` : 'Distance not specified'} • 
                      {route.duration ? ` ${route.duration}` : ' Duration not specified'} • 
                      {route.totalTrips || 0} trips/day
                    </p>
                  </div>
                  <span className="text-sm font-medium text-blue-600">
                    {route.assignedBuses ? route.assignedBuses.length : 0} bus(es)
                  </span>
                </div>
                {route.assignedBuses && route.assignedBuses.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {route.assignedBuses.map((busId, index) => {
                      const bus = buses.find(b => b._id === busId || b.id === busId)
                      return (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium text-sm">{bus?.number || bus?.busNumber || 'Unknown'}</span>
                            <p className="text-xs text-gray-600">Capacity: {bus?.capacity || 'N/A'} seats</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            bus?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {bus?.status || 'unknown'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fleet Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Fleet Status</h3>
        {busesLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading buses...</p>
          </div>
        ) : buses.length === 0 ? (
          <div className="text-center py-8">
            <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No buses found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {buses.map((bus) => (
              <div key={bus._id || bus.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-3 ${
                    bus.status === 'active' ? 'text-green-500' : 'text-red-500'
                  }`} />
                  <div>
                    <span className="text-sm font-medium text-gray-900">{bus.number || bus.busNumber}</span>
                    <p className="text-xs text-gray-600">
                      {bus.route ? `${bus.route} • ` : ''}{bus.capacity || 'N/A'} seats
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${
                    bus.status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {bus.status || 'unknown'}
                  </span>
                  <p className="text-xs text-gray-500">
                    Driver: {bus.driver || bus.driverName || 'Not assigned'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderEmployees = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Bus Employees ({mockStats.totalEmployees})</h3>
        <button
          onClick={() => {
            setEditingEmployee(null)
            setModalType('employee')
            setShowAddModal(true)
          }}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {busEmployeesLoading ? (
          <div className="col-span-2 text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading employees...</p>
          </div>
        ) : busEmployees.length === 0 ? (
          <div className="col-span-2 text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No employees found</p>
          </div>
        ) : (
          busEmployees.map((employee) => (
            <div key={employee._id || employee.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{employee.name}</h4>
                  <p className="text-sm text-gray-600">{employee.subrole || employee.role}</p>
                  <p className="text-sm text-gray-600">Phone: {employee.phone}</p>
                  <p className="text-sm text-gray-600">Email: {employee.email}</p>
                  {employee.position && <p className="text-sm text-gray-600">Position: {employee.position}</p>}
                  {employee.salary && <p className="text-sm text-gray-600">Salary: ₹{employee.salary}</p>}
                </div>
                <div className="flex space-x-2">
                <button
                  onClick={() => handleToggleEmployeeStatus(employee._id || employee.id)}
                  className={`px-2 py-1 rounded text-xs ${
                    employee.isActive 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {employee.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => openEditEmployee(employee)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteEmployee(employee._id || employee.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span>Created: {new Date(employee.createdAt).toLocaleDateString()}</span>
              <span>ID: {employee._id || employee.id}</span>
            </div>
            <div className="mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.isActive ? 'active' : 'inactive')}`}>
                {employee.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  )

  const renderBookingMen = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Booking Managers ({mockStats.totalBookingMen})</h3>
        <button
          onClick={() => {
            setEditingBookingMan(null)
            setModalType('booking-manager')
            setShowAddModal(true)
          }}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Booking Manager
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookingManagersLoading ? (
          <div className="col-span-2 text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading booking managers...</p>
          </div>
        ) : bookingManagers.length === 0 ? (
          <div className="col-span-2 text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No booking managers found</p>
          </div>
        ) : (
          bookingManagers.map((bm) => (
            <div key={bm._id || bm.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{bm.name}</h4>
                  <p className="text-sm text-gray-600">{bm.email}</p>
                  <p className="text-sm text-gray-600">Phone: {bm.phone}</p>
                  {bm.position && <p className="text-sm text-gray-600">Position: {bm.position}</p>}
                  {bm.commission && <p className="text-sm text-gray-600">Commission: {bm.commission}%</p>}
                </div>
                <div className="flex space-x-2">
                <button
                  onClick={() => handleDeleteBookingManager(bm._id || bm.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openEditBookingManager(bm)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span>Created: {new Date(bm.createdAt).toLocaleDateString()}</span>
              <span>ID: {bm._id || bm.id}</span>
            </div>
            <div className="mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bm.isActive ? 'active' : 'inactive')}`}>
                {bm.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))
        )}
      </div>
    </div>
  )

  // Bus Management Section
  const renderBuses = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Bus Management</h3>
        <button
          onClick={() => {
            setEditingBus(null)
            setModalType('bus')
            setShowAddModal(true)
          }}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Bus
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {busesLoading ? (
          <div className="col-span-3 text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading buses...</p>
          </div>
        ) : buses.length === 0 ? (
          <div className="col-span-3 text-center py-8">
            <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No buses found</p>
          </div>
        ) : (
          buses.map((bus) => (
            <div key={bus._id || bus.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{bus.number || bus.busNumber}</h4>
                  <p className="text-sm text-gray-600">Type: {bus.type || 'Standard'}</p>
                  <p className="text-sm text-gray-600">Capacity: {bus.capacity || 'N/A'} seats</p>
                  <p className="text-sm text-gray-600">Driver: {bus.driver || bus.driverName || 'Not assigned'}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingBus(bus)
                      setBusForm({
                        number: bus.number || bus.busNumber || '',
                        type: bus.type || 'Standard',
                        capacity: bus.capacity || '',
                        driver: bus.driver || bus.driverName || '',
                        helper: bus.helper || '',
                        status: bus.status || 'active'
                      })
                      setModalType('bus')
                      setShowAddModal(true)
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBus(bus._id || bus.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bus.status || 'active')}`}>
                  {bus.status || 'Active'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

  // Route Management Section
  const renderRoutes = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Route Management</h3>
        <button
          onClick={() => {
            setEditingRoute(null)
            setModalType('route')
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
                    onClick={() => {
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
                    }}
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
  )

  // Trip Management Section
  const renderTrips = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Trip Management</h3>
        <button
          onClick={() => {
            setEditingTrip(null)
            setModalType('trip')
            setShowAddModal(true)
          }}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Trip
        </button>
      </div>

      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Trip management feature coming soon</p>
        <p className="text-sm text-gray-500 mt-2">This will include trip creation, scheduling, and management</p>
      </div>
    </div>
  )

  // Bus Analytics Section
  const renderBusAnalytics = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Bus Analytics</h3>
        <p className="text-sm text-gray-600">Shared with Bus Owner</p>
      </div>

      <div className="text-center py-12">
        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Bus analytics feature coming soon</p>
        <p className="text-sm text-gray-500 mt-2">This will include bus performance, utilization, and revenue analytics</p>
      </div>
    </div>
  )

  // Route Analytics Section
  const renderRouteAnalytics = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Route Analytics</h3>
        <p className="text-sm text-gray-600">Shared with Bus Owner</p>
      </div>

      <div className="text-center py-12">
        <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Route analytics feature coming soon</p>
        <p className="text-sm text-gray-500 mt-2">This will include route performance, passenger flow, and profitability analytics</p>
      </div>
    </div>
  )

  // Trip Analytics Section
  const renderTripAnalytics = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Trip Analytics</h3>
        <p className="text-sm text-gray-600">Shared with Bus Owner</p>
      </div>

      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Trip analytics feature coming soon</p>
        <p className="text-sm text-gray-500 mt-2">This will include trip performance, booking rates, and revenue analytics</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bus Admin Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage buses, routes, trips, and employees
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
        {activeTab === 'dashboard' && renderOverview()}
        {activeTab === 'buses' && renderBuses()}
        {activeTab === 'routes' && renderRoutes()}
        {activeTab === 'trips' && renderTrips()}
        {activeTab === 'employees' && renderEmployees()}
        {activeTab === 'bus-analytics' && renderBusAnalytics()}
        {activeTab === 'route-analytics' && renderRouteAnalytics()}
        {activeTab === 'trip-analytics' && renderTripAnalytics()}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingEmployee ? 'Edit Bus Employee' : 
                   editingBookingMan ? 'Edit Booking Manager' : 
                   editingBus ? 'Edit Bus' :
                   editingRoute ? 'Edit Route' :
                   editingTrip ? 'Edit Trip' :
                   modalType === 'employee' ? 'Add New Bus Employee' : 
                   modalType === 'booking-manager' ? 'Add New Booking Manager' :
                   modalType === 'bus' ? 'Add New Bus' :
                   modalType === 'route' ? 'Add New Route' :
                   modalType === 'trip' ? 'Add New Trip' : 'Add New'}
                </h3>
                
                {(modalType === 'employee' || editingEmployee) ? (
                  <form onSubmit={handleEmployeeSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={employeeForm.name}
                        onChange={handleEmployeeInputChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        name="subrole"
                        value={employeeForm.subrole}
                        onChange={handleEmployeeInputChange}
                        className="input-field"
                        required
                      >
                        <option value="DRIVER">Driver</option>
                        <option value="HELPER">Helper</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={employeeForm.phone}
                        onChange={handleEmployeeInputChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Aadhaar Card
                      </label>
                      <input
                        type="text"
                        name="aadhaarCard"
                        value={employeeForm.aadhaarCard || ''}
                        onChange={handleEmployeeInputChange}
                        className="input-field"
                        placeholder="1234-5678-9012"
                        required
                      />
                    </div>

                    {employeeForm.subrole === 'DRIVER' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Driving License
                        </label>
                        <input
                          type="text"
                          name="license"
                          value={employeeForm.license || ''}
                          onChange={handleEmployeeInputChange}
                          className="input-field"
                          placeholder="DL-1234567890123"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assigned Bus
                      </label>
                      <select
                        name="assignedBus"
                        value={employeeForm.assignedBus || ''}
                        onChange={handleEmployeeInputChange}
                        className="input-field"
                        required
                      >
                        <option value="">Select Bus</option>
                        {buses.map(bus => (
                          <option key={bus._id || bus.id} value={bus.number || bus.busNumber}>{bus.number || bus.busNumber}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Salary
                      </label>
                      <input
                        type="number"
                        name="salary"
                        value={employeeForm.salary || ''}
                        onChange={handleEmployeeInputChange}
                        className="input-field"
                        placeholder="Enter salary amount"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={employeeForm.address}
                        onChange={handleEmployeeInputChange}
                        className="input-field"
                        rows={3}
                        placeholder="Full address"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={employeeForm.status || 'active'}
                        onChange={handleEmployeeInputChange}
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
                        {editingEmployee ? 'Update' : 'Add'} Employee
                      </button>
                    </div>
                  </form>
                ) : (modalType === 'bus' || editingBus) ? (
                  <form onSubmit={editingBus ? handleUpdateBus : handleCreateBus} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bus Number
                      </label>
                      <input
                        type="text"
                        name="number"
                        value={busForm.number}
                        onChange={handleBusInputChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bus Type
                      </label>
                      <select
                        name="type"
                        value={busForm.type}
                        onChange={handleBusInputChange}
                        className="input-field"
                        required
                      >
                        <option value="Economy">Economy</option>
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                        <option value="Luxury">Luxury</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capacity
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        value={busForm.capacity}
                        onChange={handleBusInputChange}
                        className="input-field"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Driver
                      </label>
                      <input
                        type="text"
                        name="driver"
                        value={busForm.driver}
                        onChange={handleBusInputChange}
                        className="input-field"
                        placeholder="Driver name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Helper
                      </label>
                      <input
                        type="text"
                        name="helper"
                        value={busForm.helper}
                        onChange={handleBusInputChange}
                        className="input-field"
                        placeholder="Helper name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={busForm.status}
                        onChange={handleBusInputChange}
                        className="input-field"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="maintenance">Maintenance</option>
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
                        {editingBus ? 'Update' : 'Add'} Bus
                      </button>
                    </div>
                  </form>
                ) : (modalType === 'route' || editingRoute) ? (
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
                ) : (modalType === 'trip' || editingTrip) ? (
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
                ) : (
                  <form onSubmit={handleBookingManSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={bookingManagerForm.name}
                        onChange={handleBookingManInputChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={bookingManagerForm.email}
                        onChange={handleBookingManInputChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={bookingManagerForm.phone}
                        onChange={handleBookingManInputChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Commission (%)
                      </label>
                      <input
                        type="number"
                        name="commission"
                        value={bookingManagerForm.commission || ''}
                        onChange={handleBookingManInputChange}
                        className="input-field"
                        min="0"
                        max="100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Aadhaar Card
                      </label>
                      <input
                        type="text"
                        name="aadhaarCard"
                        value={bookingManagerForm.aadhaarCard || ''}
                        onChange={handleBookingManInputChange}
                        className="input-field"
                        placeholder="1234-5678-9012"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={bookingManagerForm.address}
                        onChange={handleBookingManInputChange}
                        className="input-field"
                        rows={3}
                        placeholder="Full address"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={bookingManagerForm.status || 'active'}
                        onChange={handleBookingManInputChange}
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
                        {editingBookingMan ? 'Update' : 'Add'} Booking Manager
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BusAdminDashboard
