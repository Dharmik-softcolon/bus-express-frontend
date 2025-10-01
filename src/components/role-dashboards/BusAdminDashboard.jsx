import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
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

  const [stats, setStats] = useState({
    totalBuses: 0,
    activeRoutes: 0,
    totalTrips: 0,
    monthlyRevenue: 0,
    totalBookings: 0,
    maintenanceDue: 0,
    totalEmployees: 0,
    totalBookingMen: 0
  })

  const [busEmployees, setBusEmployees] = useState([
    {
      id: 1,
      name: 'Mike Johnson',
      role: 'DRIVER',
      license: 'DL123456',
      phone: '+91 9876543214',
      status: 'active',
      assignedBus: 'MH-01-AB-1234',
      totalTrips: 120,
      rating: 4.8,
      aadhaarCard: '3456-7890-1234',
      address: 'Mumbai, Maharashtra'
    },
    {
      id: 2,
      name: 'John Smith',
      role: 'DRIVER',
      license: 'DL789012',
      phone: '+91 9876543215',
      status: 'active',
      assignedBus: 'MH-02-CD-5678',
      totalTrips: 95,
      rating: 4.6,
      aadhaarCard: '4567-8901-2345',
      address: 'Pune, Maharashtra'
    },
    {
      id: 3,
      name: 'Sarah Wilson',
      role: 'HELPER',
      phone: '+91 9876543217',
      status: 'active',
      assignedBus: 'MH-01-AB-1234',
      totalTrips: 120,
      rating: 4.7,
      aadhaarCard: '5678-9012-3456',
      address: 'Mumbai, Maharashtra'
    }
  ])

  const [bookingMen, setBookingMen] = useState([
    {
      id: 1,
      name: 'Bob Wilson',
      email: 'bob@abctransport.com',
      phone: '+91 9876543213',
      status: 'active',
      totalBookings: 320,
      monthlyEarnings: 2400,
      commission: 5,
      aadhaarCard: '6789-0123-4567',
      address: 'Nashik, Maharashtra'
    },
    {
      id: 2,
      name: 'Carol Brown',
      email: 'carol@abctransport.com',
      phone: '+91 9876543220',
      status: 'active',
      totalBookings: 280,
      monthlyEarnings: 2100,
      commission: 5,
      aadhaarCard: '7890-1234-5678',
      address: 'Goa, Goa'
    }
  ])

  const [buses] = useState([
    { id: 1, number: 'MH-01-AB-1234', route: 'Mumbai-Pune', status: 'active', capacity: 50, driver: 'Mike Johnson', conductor: 'Sarah Wilson' },
    { id: 2, number: 'MH-02-CD-5678', route: 'Mumbai-Pune', status: 'active', capacity: 45, driver: 'John Smith', conductor: 'Alice Brown' },
    { id: 3, number: 'MH-03-EF-9012', route: 'Mumbai-Nashik', status: 'active', capacity: 40, driver: 'David Lee', conductor: 'Emma Davis' }
  ])

  const [routes] = useState([
    { id: 1, name: 'Mumbai-Pune', distance: '150 km', duration: '3 hours', buses: ['MH-01-AB-1234', 'MH-02-CD-5678'], totalTrips: 24 },
    { id: 2, name: 'Mumbai-Nashik', distance: '180 km', duration: '4 hours', buses: ['MH-03-EF-9012'], totalTrips: 18 }
  ])

  const [employeeFormData, setEmployeeFormData] = useState({
    name: '',
    role: 'DRIVER',
    license: '',
    phone: '',
    status: 'active',
    assignedBus: '',
    aadhaarCard: '',
    address: ''
  })

  const [bookingManFormData, setBookingManFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active',
    commission: 5,
    aadhaarCard: '',
    address: ''
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch bus admin dashboard data
    setTimeout(() => {
      setStats({
        totalBuses: buses.length,
        activeRoutes: routes.length,
        totalTrips: 156,
        monthlyRevenue: 245000,
        totalBookings: 1240,
        maintenanceDue: 1,
        totalEmployees: busEmployees.length,
        totalBookingMen: bookingMen.length
      })
      setLoading(false)
    }, 1000)
  }, [])

  const navigationItems = getNavigationMenu(user?.role)

  const handleEmployeeInputChange = (e) => {
    const { name, value } = e.target
    setEmployeeFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBookingManInputChange = (e) => {
    const { name, value } = e.target
    setBookingManFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEmployeeSubmit = (e) => {
    e.preventDefault()
    
    if (editingEmployee) {
      setBusEmployees(prev => prev.map(emp => 
        emp.id === editingEmployee.id ? { ...emp, ...employeeFormData } : emp
      ))
    } else {
      const newEmployee = {
        ...employeeFormData,
        id: busEmployees.length + 1,
        totalTrips: 0,
        rating: 5.0
      }
      setBusEmployees(prev => [...prev, newEmployee])
    }
    
    setShowAddModal(false)
    setEditingEmployee(null)
    setEmployeeFormData({
      name: '',
      role: 'DRIVER',
      license: '',
      phone: '',
      status: 'active',
      assignedBus: '',
      aadhaarCard: '',
      address: ''
    })
  }

  const handleBookingManSubmit = (e) => {
    e.preventDefault()
    
    if (editingBookingMan) {
      setBookingMen(prev => prev.map(bm => 
        bm.id === editingBookingMan.id ? { ...bm, ...bookingManFormData } : bm
      ))
    } else {
      const newBookingMan = {
        ...bookingManFormData,
        id: bookingMen.length + 1,
        totalBookings: 0,
        monthlyEarnings: 0
      }
      setBookingMen(prev => [...prev, newBookingMan])
    }
    
    setShowAddModal(false)
    setEditingBookingMan(null)
    setBookingManFormData({
      name: '',
      email: '',
      phone: '',
      status: 'active',
      commission: 5,
      aadhaarCard: '',
      address: ''
    })
  }

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee)
    setEmployeeFormData(employee)
    setShowAddModal(true)
  }

  const handleEditBookingMan = (bookingMan) => {
    setEditingBookingMan(bookingMan)
    setBookingManFormData(bookingMan)
    setShowAddModal(true)
  }

  const handleDeleteEmployee = (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setBusEmployees(prev => prev.filter(emp => emp.id !== id))
    }
  }

  const handleDeleteBookingMan = (id) => {
    if (window.confirm('Are you sure you want to delete this booking manager?')) {
      setBookingMen(prev => prev.filter(bm => bm.id !== id))
    }
  }

  const toggleEmployeeStatus = (id) => {
    setBusEmployees(prev => prev.map(emp => 
      emp.id === id 
        ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' }
        : emp
    ))
  }

  const toggleBookingManStatus = (id) => {
    setBookingMen(prev => prev.map(bm => 
      bm.id === id 
        ? { ...bm, status: bm.status === 'active' ? 'inactive' : 'active' }
        : bm
    ))
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
              <p className="text-2xl font-bold text-gray-900">{stats.totalBuses}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.activeRoutes}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookingMen}</p>
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
        {busEmployees.map((employee) => (
          <div key={employee.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{employee.name}</h4>
                <p className="text-sm text-gray-600">{employee.role}</p>
                <p className="text-sm text-gray-600">Bus: {employee.assignedBus}</p>
                <p className="text-sm text-gray-600">Phone: {employee.phone}</p>
                {employee.license && <p className="text-sm text-gray-600">License: {employee.license}</p>}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleEmployeeStatus(employee.id)}
                  className={`px-2 py-1 rounded text-xs ${
                    employee.status === 'active' 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {employee.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEditEmployee(employee)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteEmployee(employee.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span>Trips: {employee.totalTrips}</span>
              <span>Rating: {employee.rating}⭐</span>
            </div>
            <div className="mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                {employee.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderBookingMen = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Booking Managers ({stats.totalBookingMen})</h3>
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
        {bookingMen.map((bm) => (
          <div key={bm.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{bm.name}</h4>
                <p className="text-sm text-gray-600">{bm.email}</p>
                <p className="text-sm text-gray-600">Phone: {bm.phone}</p>
                <p className="text-sm text-gray-600">Commission: {bm.commission}%</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleBookingManStatus(bm.id)}
                  className={`px-2 py-1 rounded text-xs ${
                    bm.status === 'active' 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {bm.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEditBookingMan(bm)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteBookingMan(bm.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span>Bookings: {bm.totalBookings}</span>
              <span>Earnings: ₹{bm.monthlyEarnings}</span>
            </div>
            <div className="mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bm.status)}`}>
                {bm.status}
              </span>
            </div>
          </div>
        ))}
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
