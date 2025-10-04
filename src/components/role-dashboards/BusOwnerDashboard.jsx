import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Bus, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  Users,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

const BusOwnerDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalBuses: 0,
    activeRoutes: 0,
    totalTrips: 0,
    monthlyRevenue: 0,
    totalBookings: 0,
    maintenanceDue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch bus owner dashboard data
    setTimeout(() => {
      setStats({
        totalBuses: 12,
        activeRoutes: 8,
        totalTrips: 156,
        monthlyRevenue: 245000,
        totalBookings: 1240,
        maintenanceDue: 3
      })
      setLoading(false)
    }, 1000)
  }, [])

  const handleQuickAction = (action) => {
    switch(action) {
      case 'bus-analytics':
        navigate('/bus-owner/bus-analytics')
        break
      case 'route-analytics':
        navigate('/bus-owner/route-analytics')
        break
      case 'trip-analytics':
        navigate('/bus-owner/trip-analytics')
        break
      case 'revenue':
        navigate('/bus-owner/revenue')
        break
      case 'expenses':
        navigate('/bus-owner/expenses')
        break
      default:
        break
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bus Owner Dashboard</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Monitor fleet performance and analytics
            </p>
          </div>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Bus className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Buses</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? '...' : stats.totalBuses}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Routes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? '...' : stats.activeRoutes}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Trips</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? '...' : stats.totalTrips}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? '...' : `₹${stats.monthlyRevenue.toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? '...' : stats.totalBookings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Maintenance Due</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? '...' : stats.maintenanceDue}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-6">
          {/* Fleet Status */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Fleet Status</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-900">Bus-001 (Mumbai-Delhi)</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">On Route</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-900">Bus-002 (Delhi-Bangalore)</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">On Route</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="text-sm text-gray-900">Bus-003 (Chennai-Hyderabad)</span>
                  </div>
                  <span className="text-sm text-yellow-600 font-medium">Scheduled</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-sm text-gray-900">Bus-004 (Pune-Goa)</span>
                  </div>
                  <span className="text-sm text-red-600 font-medium">Maintenance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Recent Bookings</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mumbai → Delhi</p>
                    <p className="text-xs text-gray-500">Bus-001 • Seat 12A, 12B</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₹2,500</p>
                    <p className="text-xs text-gray-500">Today, 6:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Delhi → Bangalore</p>
                    <p className="text-xs text-gray-500">Bus-002 • Seat 8C, 8D</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₹3,200</p>
                    <p className="text-xs text-gray-500">Tomorrow, 8:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Chennai → Hyderabad</p>
                    <p className="text-xs text-gray-500">Bus-003 • Seat 15A</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₹1,800</p>
                    <p className="text-xs text-gray-500">Dec 25, 10:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div 
                  onClick={() => handleQuickAction('bus-analytics')}
                  className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <Bus className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Bus Analytics</p>
                </div>
                <div 
                  onClick={() => handleQuickAction('route-analytics')}
                  className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                >
                  <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Route Analytics</p>
                </div>
                <div 
                  onClick={() => handleQuickAction('trip-analytics')}
                  className="text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Trip Analytics</p>
                </div>
                <div 
                  onClick={() => handleQuickAction('revenue')}
                  className="text-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors cursor-pointer"
                >
                  <DollarSign className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Revenue</p>
                </div>
                <div 
                  onClick={() => handleQuickAction('expenses')}
                  className="text-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <TrendingUp className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Expenses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusOwnerDashboard
