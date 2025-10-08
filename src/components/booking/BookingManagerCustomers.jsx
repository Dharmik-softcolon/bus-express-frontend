import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import showToast from '../../utils/toast'
import { bookingAPI } from '../../services/api'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  Phone,
  Mail,
  User,
  Bus,
  Route,
  CreditCard,
  XCircle,
  CheckCircle2,
  Activity
} from 'lucide-react'

const BookingManagerCustomers = () => {
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [customers, setCustomers] = useState([])
  const [showCustomerDetails, setShowCustomerDetails] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState('all')

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Dummy customers data
      const dummyCustomers = [
        {
          _id: 'customer1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+91 9876543210',
          totalBookings: 5,
          totalSpent: 12000,
          lastBooking: new Date('2024-01-15'),
          status: 'active',
          joinDate: new Date('2023-06-15'),
          preferredRoutes: ['Bangalore to Mumbai', 'Mumbai to Pune'],
          averageBookingValue: 2400
        },
        {
          _id: 'customer2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+91 9876543211',
          totalBookings: 3,
          totalSpent: 7200,
          lastBooking: new Date('2024-01-16'),
          status: 'active',
          joinDate: new Date('2023-08-20'),
          preferredRoutes: ['Delhi to Chennai'],
          averageBookingValue: 2400
        },
        {
          _id: 'customer3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          phone: '+91 9876543212',
          totalBookings: 7,
          totalSpent: 16800,
          lastBooking: new Date('2024-01-17'),
          status: 'active',
          joinDate: new Date('2023-05-10'),
          preferredRoutes: ['Pune to Hyderabad', 'Hyderabad to Bangalore'],
          averageBookingValue: 2400
        },
        {
          _id: 'customer4',
          name: 'Sarah Wilson',
          email: 'sarah@example.com',
          phone: '+91 9876543213',
          totalBookings: 2,
          totalSpent: 3600,
          lastBooking: new Date('2024-01-18'),
          status: 'inactive',
          joinDate: new Date('2023-12-01'),
          preferredRoutes: ['Mumbai to Goa'],
          averageBookingValue: 1800
        },
        {
          _id: 'customer5',
          name: 'David Brown',
          email: 'david@example.com',
          phone: '+91 9876543214',
          totalBookings: 4,
          totalSpent: 6000,
          lastBooking: new Date('2024-01-19'),
          status: 'active',
          joinDate: new Date('2023-09-15'),
          preferredRoutes: ['Chennai to Bangalore'],
          averageBookingValue: 1500
        },
        {
          _id: 'customer6',
          name: 'Lisa Davis',
          email: 'lisa@example.com',
          phone: '+91 9876543215',
          totalBookings: 6,
          totalSpent: 14400,
          lastBooking: new Date('2024-01-20'),
          status: 'active',
          joinDate: new Date('2023-07-22'),
          preferredRoutes: ['Bangalore to Chennai', 'Chennai to Mumbai'],
          averageBookingValue: 2400
        }
      ]
      
      setCustomers(dummyCustomers)
      
    } catch (error) {
      console.error('Error fetching customers:', error)
      showToast.error('Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'blocked':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm)
    
    const matchesFilter = filterBy === 'all' || customer.status === filterBy
    
    return matchesSearch && matchesFilter
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCustomerStats = () => {
    const totalCustomers = customers.length
    const activeCustomers = customers.filter(c => c.status === 'active').length
    const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
    const averageSpent = totalCustomers > 0 ? totalRevenue / totalCustomers : 0
    
    return {
      totalCustomers,
      activeCustomers,
      totalRevenue,
      averageSpent
    }
  }

  const stats = getCustomerStats()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading customers...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
              <p className="text-gray-600 mt-1">Manage customer information and booking history</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchCustomers}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Customer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Customers</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Customers</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Spent</p>
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.averageSpent)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-[#6A0066] rounded-md focus:ring-primary focus:border-primary w-full"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-3 py-2 border border-[#6A0066] rounded-md focus:ring-primary focus:border-primary"
                >
                  <option value="all">All Customers</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Customers ({filteredCustomers.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Bookings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Booking</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{customer.email}</div>
                        <div className="text-gray-500">{customer.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.totalBookings || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(customer.totalSpent || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.lastBooking ? formatDate(customer.lastBooking) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer)
                          setShowCustomerDetails(true)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showCustomerDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Customer Details</h3>
                <button
                  onClick={() => setShowCustomerDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedCustomer.status)}`}>
                      {selectedCustomer.status}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.phone}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Join Date</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedCustomer.joinDate)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Booking</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(selectedCustomer.lastBooking)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Bookings</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedCustomer.totalBookings}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Spent</label>
                    <p className="mt-1 text-sm text-gray-900">{formatCurrency(selectedCustomer.totalSpent)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Average Booking Value</label>
                  <p className="mt-1 text-sm text-gray-900">{formatCurrency(selectedCustomer.averageBookingValue)}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preferred Routes</label>
                  <div className="mt-1">
                    {selectedCustomer.preferredRoutes?.map((route, index) => (
                      <span key={index} className="inline-block bg-gray-100 rounded px-2 py-1 text-sm mr-2 mb-2">
                        {route}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowCustomerDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-primary border-0 rounded-md text-sm font-medium text-white hover:bg-hover border-0 hover:border-0">
                  View Booking History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingManagerCustomers
