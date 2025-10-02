import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
import { formatAadhaarCard } from '../../utils/formatters'
import { showToast } from '../../utils/toast'
import { dashboardAPI, busEmployeeAPI, bookingManagerAPI } from '../../services/api'
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
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [editingBookingMan, setEditingBookingMan] = useState(null)

  // Dynamic data state
  const [dashboardData, setDashboardData] = useState(null)
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [busEmployees, setBusEmployees] = useState([])
  const [busEmployeesLoading, setBusEmployeesLoading] = useState(true)
  const [bookingManagers, setBookingManagers] = useState([])
  const [bookingManagersLoading, setBookingManagersLoading] = useState(true)

  // Form state
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    subrole: '',
    position: '',
    address: ''
  })

  const [bookingManagerForm, setBookingManagerForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    position: '',
    address: ''
  })

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setDashboardLoading(true)
      const [dashboardResponse, employeesResponse, managersResponse] = await Promise.all([
        dashboardAPI.getBusAdminDashboard(),
        busEmployeeAPI.getAllEmployees({ limit: 20 }),
        bookingManagerAPI.getAllBookingManagers({ limit: 20 })
      ])

      // Set dashboard data
      if (dashboardResponse.success) {
        setDashboardData(dashboardResponse.data)
      }

      // Set employees data
      if (employeesResponse.success) {
        setBusEmployees(employeesResponse.data.busEmployees || [])
      }

      // Set booking managers data
      if (managersResponse.success) {
        setBookingManagers(managersResponse.data.bookingManagers || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      showToast('Failed to load dashboard data', 'error')
    } finally {
      setDashboardLoading(false)
      setBusEmployeesLoading(false)
      setBookingManagersLoading(false)
    }
  }

  // Employee management functions
  const handleCreateEmployee = async (e) => {
    e.preventDefault()
    try {
      const response = await busEmployeeAPI.createEmployee(employeeForm)
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
          address: ''
        })
        fetchAllData()
      }
    } catch (error) {
      console.error('Error creating employee:', error)
      showToast('Failed to create employee', 'error')
    }
  }

  const handleUpdateEmployee = async (e) => {
    e.preventDefault()
    try {
      const response = await busEmployeeAPI.updateEmployee(editingEmployee.id, employeeForm)
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
          address: ''
        })
        fetchAllData()
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
          fetchAllData()
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
        fetchAllData()
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
      const response = await bookingManagerAPI.createBookingManager(bookingManagerForm)
      if (response.success) {
        showToast('Booking manager created successfully', 'success')
        setShowAddModal(false)
        setBookingManagerForm({
          name: '',
          email: '',
          password: '',
          phone: '',
          position: '',
          address: ''
        })
        fetchAllData()
      }
    } catch (error) {
      console.error('Error creating booking manager:', error)
      showToast('Failed to create booking manager', 'error')
    }
  }

  const handleUpdateBookingManager = async (e) => {
    e.preventDefault()
    try {
      const response = await bookingManagerAPI.updateBookingManager(editingBookingMan.id, bookingManagerForm)
      if (response.success) {
        showToast('Booking manager updated successfully', 'success')
        setEditingBookingMan(null)
        setBookingManagerForm({
          name: '',
          email: '',
          password: '',
          phone: '',
          position: '',
          address: ''
        })
        fetchAllData()
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
          fetchAllData()
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
      address: employee.address || ''
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
      address: manager.address || ''
    })
  }

  const closeModals = () => {
    setShowAddModal(false)
    setEditingEmployee(null)
    setEditingBookingMan(null)
    setEmployeeForm({
      name: '',
      email: '',
      password: '',
      phone: '',
      subrole: '',
      position: '',
      address: ''
    })
    setBookingManagerForm({
      name: '',
      email: '',
      password: '',
      phone: '',
      position: '',
      address: ''
    })
  }

  // Mock data for demonstration (will be replaced with real data)
  const mockStats = {
    totalBuses: 0,
    activeRoutes: 0,
    totalTrips: 0,
    monthlyRevenue: 0,
    totalBookings: 0,
    maintenanceDue: 0,
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

  const navigationItems = getNavigationMenu(user?.role)

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
              <p className="text-2xl font-bold text-gray-900">{stats.totalTrips}</p>
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
              <p className="text-2xl font-bold text-gray-900">₹{stats.monthlyRevenue.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.maintenanceDue}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Route-Bus Assignments */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Route-Bus Assignments</h3>
        <div className="space-y-4">
          {routes.map((route) => (
            <div key={route.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{route.name}</h4>
                  <p className="text-sm text-gray-600">{route.distance} • {route.duration} • {route.totalTrips} trips/day</p>
                </div>
                <span className="text-sm font-medium text-blue-600">{route.buses.length} bus(es)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {route.buses.map((busNumber, index) => {
                  const bus = buses.find(b => b.number === busNumber)
                  return (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium text-sm">{busNumber}</span>
                        <p className="text-xs text-gray-600">Capacity: {bus?.capacity} seats</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bus?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {bus?.status}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fleet Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Fleet Status</h3>
        <div className="space-y-4">
          {buses.map((bus) => (
            <div key={bus.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <div>
                  <span className="text-sm font-medium text-gray-900">{bus.number}</span>
                  <p className="text-xs text-gray-600">{bus.route} • {bus.capacity} seats</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-medium ${
                  bus.status === 'active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {bus.status}
                </span>
                <p className="text-xs text-gray-500">Driver: {bus.driver}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderEmployees = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Bus Employees ({stats.totalEmployees})</h3>
        <button
          onClick={() => {
            setEditingEmployee(null)
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

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bus Admin Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage buses, routes, trips, and employees
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'employees', name: 'Bus Employees' },
              { id: 'booking-men', name: 'Booking Managers' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'employees' && renderEmployees()}
        {activeTab === 'booking-men' && renderBookingMen()}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingEmployee ? 'Edit Bus Employee' : editingBookingMan ? 'Edit Booking Manager' : 'Add New Employee/Manager'}
                </h3>
                
                {!editingBookingMan ? (
                  <form onSubmit={handleEmployeeSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={employeeFormData.name}
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
                        name="role"
                        value={employeeFormData.role}
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
                        value={employeeFormData.phone}
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
                        value={employeeFormData.aadhaarCard}
                        onChange={handleEmployeeInputChange}
                        className="input-field"
                        placeholder="1234-5678-9012"
                        required
                      />
                    </div>

                    {employeeFormData.role === 'DRIVER' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Driving License
                        </label>
                        <input
                          type="text"
                          name="license"
                          value={employeeFormData.license}
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
                        value={employeeFormData.assignedBus}
                        onChange={handleEmployeeInputChange}
                        className="input-field"
                        required
                      >
                        <option value="">Select Bus</option>
                        {buses.map(bus => (
                          <option key={bus.id} value={bus.number}>{bus.number}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={employeeFormData.address}
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
                        value={employeeFormData.status}
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
                        onClick={() => {
                          setShowAddModal(false)
                          setEditingEmployee(null)
                        }}
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
                ) : (
                  <form onSubmit={handleBookingManSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={bookingManFormData.name}
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
                        value={bookingManFormData.email}
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
                        value={bookingManFormData.phone}
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
                        value={bookingManFormData.commission}
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
                        value={bookingManFormData.aadhaarCard}
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
                        value={bookingManFormData.address}
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
                        value={bookingManFormData.status}
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
                        onClick={() => {
                          setShowAddModal(false)
                          setEditingBookingMan(null)
                        }}
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
