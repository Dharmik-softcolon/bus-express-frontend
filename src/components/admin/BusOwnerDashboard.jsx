import { useState } from 'react'
import { Users, Bus, Calendar, DollarSign, TrendingUp, TrendingDown, BarChart3, Plus, Edit, Trash2, UserCheck, UserX, Link } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const BusOwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const navigate = useNavigate()

  const [busAdmins, setBusAdmins] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@abctransport.com',
      phone: '+91 9876543212',
      role: 'Bus Admin',
      status: 'active',
      joinDate: '2023-02-15',
      totalTrips: 45,
      totalBookings: 320,
      monthlyEarnings: 2800,
      aadhaarCard: '3456-7890-1234',
      drivingLicense: null,
      position: 'Bus Administrator',
      address: 'Nashik, Maharashtra'
    },
    {
      id: 2,
      name: 'Bob Wilson',
      email: 'bob@abctransport.com',
      phone: '+91 9876543213',
      role: 'Bus Admin',
      status: 'active',
      joinDate: '2023-03-20',
      totalTrips: 38,
      totalBookings: 280,
      monthlyEarnings: 2400,
      aadhaarCard: '4567-8901-2345',
      drivingLicense: null,
      position: 'Bus Administrator',
      address: 'Goa, Goa'
    }
  ])


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Bus Admin',
    status: 'active',
    aadhaarCard: '',
    drivingLicense: '',
    position: 'Bus Administrator',
    address: ''
  })

  // Mock data for buses, routes, employees, and booking men
  const [buses] = useState([
    { id: 1, number: 'MH-01-AB-1234', route: 'Mumbai-Pune', status: 'active', capacity: 50, driver: 'Mike Johnson', conductor: 'Sarah Wilson' },
    { id: 2, number: 'MH-02-CD-5678', route: 'Mumbai-Pune', status: 'active', capacity: 45, driver: 'John Smith', conductor: 'Alice Brown' },
    { id: 3, number: 'MH-03-EF-9012', route: 'Mumbai-Nashik', status: 'active', capacity: 40, driver: 'David Lee', conductor: 'Emma Davis' },
    { id: 4, number: 'MH-04-GH-3456', route: 'Pune-Nashik', status: 'maintenance', capacity: 35, driver: 'Robert Wilson', conductor: 'Lisa Garcia' },
    { id: 5, number: 'MH-05-IJ-7890', route: 'Mumbai-Goa', status: 'active', capacity: 55, driver: 'Michael Brown', conductor: 'Jennifer Taylor' }
  ])

  const [routes] = useState([
    { id: 1, name: 'Mumbai-Pune', distance: '150 km', duration: '3 hours', buses: ['MH-01-AB-1234', 'MH-02-CD-5678'], totalTrips: 24 },
    { id: 2, name: 'Mumbai-Nashik', distance: '180 km', duration: '4 hours', buses: ['MH-03-EF-9012'], totalTrips: 18 },
    { id: 3, name: 'Pune-Nashik', distance: '120 km', duration: '2.5 hours', buses: ['MH-04-GH-3456'], totalTrips: 12 },
    { id: 4, name: 'Mumbai-Goa', distance: '600 km', duration: '12 hours', buses: ['MH-05-IJ-7890'], totalTrips: 6 }
  ])

  const [busEmployees] = useState([
    { id: 1, name: 'Mike Johnson', role: 'Driver', license: 'DL123456', phone: '+91 9876543214', status: 'active', assignedBus: 'MH-01-AB-1234', totalTrips: 120, rating: 4.8 },
    { id: 2, name: 'John Smith', role: 'Driver', license: 'DL789012', phone: '+91 9876543215', status: 'active', assignedBus: 'MH-02-CD-5678', totalTrips: 95, rating: 4.6 },
    { id: 3, name: 'David Lee', role: 'Driver', license: 'DL345678', phone: '+91 9876543216', status: 'active', assignedBus: 'MH-03-EF-9012', totalTrips: 88, rating: 4.9 },
    { id: 4, name: 'Sarah Wilson', role: 'Conductor', phone: '+91 9876543217', status: 'active', assignedBus: 'MH-01-AB-1234', totalTrips: 120, rating: 4.7 },
    { id: 5, name: 'Alice Brown', role: 'Conductor', phone: '+91 9876543218', status: 'active', assignedBus: 'MH-02-CD-5678', totalTrips: 95, rating: 4.5 },
    { id: 6, name: 'Emma Davis', role: 'Conductor', phone: '+91 9876543219', status: 'active', assignedBus: 'MH-03-EF-9012', totalTrips: 88, rating: 4.8 }
  ])

  const [bookingMen] = useState([
    { id: 1, name: 'Bob Wilson', email: 'bob@abctransport.com', phone: '+91 9876543213', status: 'active', totalBookings: 320, monthlyEarnings: 2400, commission: 5 },
    { id: 2, name: 'Carol Brown', email: 'carol@abctransport.com', phone: '+91 9876543220', status: 'active', totalBookings: 280, monthlyEarnings: 2100, commission: 5 }
  ])


  const ownerStats = {
    totalBuses: buses.length,
    activeBuses: buses.filter(bus => bus.status === 'active').length,
    totalRoutes: routes.length,
    totalAdmins: busAdmins.length,
    activeAdmins: busAdmins.filter(admin => admin.status === 'active').length,
    totalEmployees: busEmployees.length,
    activeEmployees: busEmployees.filter(emp => emp.status === 'active').length,
    totalBookingMen: bookingMen.length,
    activeBookingMen: bookingMen.filter(bm => bm.status === 'active').length,
    monthlyRevenue: 45000,
    monthlyExpenses: 28000,
    netProfit: 17000
  }

  const dailyBookings = [
    { date: '2024-01-15', bookings: 45, revenue: 2025 },
    { date: '2024-01-14', bookings: 52, revenue: 2340 },
    { date: '2024-01-13', bookings: 38, revenue: 1710 },
    { date: '2024-01-12', bookings: 41, revenue: 1845 },
    { date: '2024-01-11', bookings: 48, revenue: 2160 }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Check if trying to add more than 2 Bus Admins
    if (!editingAdmin && busAdmins.length >= 2) {
      alert('You can only have a maximum of 2 Bus Admins.')
      return
    }
    
    if (editingAdmin) {
      setBusAdmins(prev => prev.map(admin => 
        admin.id === editingAdmin.id ? { ...admin, ...formData } : admin
      ))
    } else {
      const newAdmin = {
        ...formData,
        id: busAdmins.length + 1,
        joinDate: new Date().toISOString().split('T')[0],
        totalTrips: 0,
        totalBookings: 0,
        monthlyEarnings: 0
      }
      setBusAdmins(prev => [...prev, newAdmin])
    }
    setShowAddModal(false)
    setEditingAdmin(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'Bus Admin',
      status: 'active',
      aadhaarCard: '',
      drivingLicense: '',
      position: 'Bus Administrator',
      address: ''
    })
  }

  const handleEdit = (admin) => {
    setEditingAdmin(admin)
    setFormData(admin)
    setShowAddModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      setBusAdmins(prev => prev.filter(admin => admin.id !== id))
    }
  }

  const toggleAdminStatus = (id) => {
    setBusAdmins(prev => prev.map(admin => 
      admin.id === id 
        ? { ...admin, status: admin.status === 'active' ? 'inactive' : 'active' }
        : admin
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
      {/* Owner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Bus className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Buses</p>
              <p className="text-2xl font-bold text-gray-900">{ownerStats.totalBuses}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bus Admins</p>
              <p className="text-2xl font-bold text-gray-900">{ownerStats.totalAdmins}/2</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100">
              <Bus className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Routes</p>
              <p className="text-2xl font-bold text-gray-900">{ownerStats.totalRoutes}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bus Employees</p>
              <p className="text-2xl font-bold text-gray-900">{ownerStats.totalEmployees}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-pink-100">
              <Users className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Booking Men</p>
              <p className="text-2xl font-bold text-gray-900">{ownerStats.totalBookingMen}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{ownerStats.monthlyRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900">₹{ownerStats.netProfit.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Route-Bus Assignments */}
      <div className="card">
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

      {/* Bus Employees */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Bus Employees ({ownerStats.totalEmployees})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {busEmployees.map((employee) => (
            <div key={employee.id} className="border rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{employee.name}</h4>
                  <p className="text-sm text-gray-600">{employee.role}</p>
                  <p className="text-sm text-gray-600">Bus: {employee.assignedBus}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {employee.status}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Trips: {employee.totalTrips}</span>
                <span>Rating: {employee.rating}⭐</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Men */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Booking Men ({ownerStats.totalBookingMen})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookingMen.map((bm) => (
            <div key={bm.id} className="border rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-900">{bm.name}</h4>
                  <p className="text-sm text-gray-600">{bm.email}</p>
                  <p className="text-sm text-gray-600">Commission: {bm.commission}%</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  bm.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {bm.status}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Bookings: {bm.totalBookings}</span>
                <span>Earnings: ₹{bm.monthlyEarnings}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Bookings Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Daily Bookings (Last 5 Days)</h3>
        <div className="space-y-3">
          {dailyBookings.map((day, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium">{new Date(day.date).toLocaleDateString()}</span>
                <p className="text-sm text-gray-600">{day.bookings} bookings</p>
              </div>
              <div className="text-right">
                <span className="font-semibold text-green-600">₹{day.revenue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'New trip created', admin: 'Alice Johnson', time: '1 hour ago' },
            { action: 'Employee added', admin: 'Bob Wilson', time: '3 hours ago' },
            { action: 'Route updated', admin: 'Alice Johnson', time: '1 day ago' },
            { action: 'Booking cancelled', admin: 'System', time: '2 days ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium">{activity.action}</span>
                <p className="text-sm text-gray-600">by {activity.admin}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )


  const renderBusAdmins = () => (
    <div className="space-y-4">
      {/* Bus Admin Limit Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <Users className="h-5 w-5 text-blue-600 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">Bus Admin Limit</h3>
            <p className="text-sm text-blue-600">
              You can manage up to 2 Bus Admins. Currently: {busAdmins.length}/2
            </p>
          </div>
        </div>
      </div>

      {busAdmins.map((admin) => (
        <div key={admin.id} className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{admin.name}</h3>
              <p className="text-gray-600">{admin.email}</p>
              <p className="text-gray-600">{admin.phone}</p>
              <p className="text-gray-600">Aadhaar: {admin.aadhaarCard}</p>
              {admin.drivingLicense && <p className="text-gray-600">License: {admin.drivingLicense}</p>}
              <p className="text-gray-600">Address: {admin.address}</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(admin.status)}`}>
                {admin.status}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleAdminStatus(admin.id)}
                className={`px-3 py-1 rounded text-sm ${
                  admin.status === 'active' 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
                title={admin.status === 'active' ? 'Temporarily deactivate' : 'Activate'}
              >
                {admin.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => handleEdit(admin)}
                className="text-blue-600 hover:text-blue-900"
                title="Edit Bus Admin"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(admin.id)}
                className="text-red-600 hover:text-red-900"
                title="Remove Bus Admin"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{admin.totalTrips}</div>
              <div className="text-sm text-gray-600">Total Trips</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{admin.totalBookings}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">₹{admin.monthlyEarnings}</div>
              <div className="text-sm text-gray-600">Monthly Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{admin.role}</div>
              <div className="text-sm text-gray-600">Role</div>
            </div>
          </div>
        </div>
      ))}

      {busAdmins.length === 0 && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Bus Admins</h3>
          <p className="text-gray-600 mb-4">You haven't created any Bus Admins yet.</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create First Bus Admin
          </button>
        </div>
      )}
    </div>
  )


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">
                Manage your bus operations, employees, and view reports
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              disabled={busAdmins.length >= 2}
              className={`btn-primary flex items-center ${busAdmins.length >= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Bus Admin ({busAdmins.length}/2)
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {[
              { id: 'overview', name: 'Analytics Overview' },
              { id: 'admins', name: 'Bus Admins (2 Max)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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

        {/* Quick Analytics Links (View Only) */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/admin/revenue')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <DollarSign className="h-4 w-4" />
              <span>View Revenue Analytics</span>
            </button>
            <button
              onClick={() => navigate('/admin/expenses')}
              className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <TrendingDown className="h-4 w-4" />
              <span>View Expense Analytics</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'admins' && renderBusAdmins()}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingAdmin ? 'Edit Bus Admin' : 'Add New Bus Admin'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
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
                      value={formData.email}
                      onChange={handleInputChange}
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
                      value={formData.phone}
                      onChange={handleInputChange}
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
                      value={formData.aadhaarCard}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="1234-5678-9012"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Driving License
                    </label>
                    <input
                      type="text"
                      name="drivingLicense"
                      value={formData.drivingLicense}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="DL-1234567890123 (Optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
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
                        setEditingAdmin(null)
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      {editingAdmin ? 'Update' : 'Add'} Admin
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

export default BusOwnerDashboard
