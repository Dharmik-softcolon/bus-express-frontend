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
  Clock
} from 'lucide-react'

const BusOwnerDashboard = () => {
  const { user } = useUser()
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

  const navigationItems = getNavigationMenu(user?.role)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bus Owner Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your fleet and business operations</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="font-semibold text-gray-900">{user?.name}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Bus className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {navigationItems.slice(1).map((item) => (
                  <a
                    key={item.path}
                    href={item.path}
                    className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      {item.icon === 'buses' && <Bus className="w-4 h-4 text-blue-600" />}
                      {item.icon === 'routes' && <MapPin className="w-4 h-4 text-blue-600" />}
                      {item.icon === 'trips' && <Calendar className="w-4 h-4 text-blue-600" />}
                      {item.icon === 'revenue' && <DollarSign className="w-4 h-4 text-blue-600" />}
                      {item.icon === 'expenses' && <TrendingUp className="w-4 h-4 text-blue-600" />}
                      {item.icon === 'employees' && <Users className="w-4 h-4 text-blue-600" />}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

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
      </div>
    </div>
  )
}

export default BusOwnerDashboard
