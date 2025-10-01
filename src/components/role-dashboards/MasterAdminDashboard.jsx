import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
import { 
  Users, 
  Shield, 
  BarChart3, 
  Settings, 
  Bus, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

const MasterAdminDashboard = () => {
  const { user } = useUser()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBuses: 0,
    totalRoutes: 0,
    totalBookings: 0,
    activeUsers: 0,
    pendingApprovals: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch master admin dashboard data
    setTimeout(() => {
      setStats({
        totalUsers: 1250,
        totalBuses: 85,
        totalRoutes: 45,
        totalBookings: 3420,
        activeUsers: 1180,
        pendingApprovals: 12
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
              <h1 className="text-3xl font-bold text-gray-900">Master Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">System overview and management</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="font-semibold text-gray-900">{user?.name}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-red-600" />
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
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? '...' : stats.totalUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
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
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Routes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? '...' : stats.totalRoutes}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
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
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? '...' : stats.activeUsers.toLocaleString()}
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
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {loading ? '...' : stats.pendingApprovals}
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
                      {item.icon === 'users' && <Users className="w-4 h-4 text-blue-600" />}
                      {item.icon === 'analytics' && <BarChart3 className="w-4 h-4 text-blue-600" />}
                      {item.icon === 'roles' && <Shield className="w-4 h-4 text-blue-600" />}
                      {item.icon === 'settings' && <Settings className="w-4 h-4 text-blue-600" />}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">System Status</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-900">Database</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-900">API Services</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-900">Payment Gateway</span>
                  </div>
                  <span className="text-sm text-green-600 font-medium">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="text-sm text-gray-900">Email Service</span>
                  </div>
                  <span className="text-sm text-yellow-600 font-medium">Maintenance</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">New bus owner registered: ABC Transport</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Route updated: Mumbai to Delhi</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">System backup completed</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">New user role created: Fleet Manager</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MasterAdminDashboard
