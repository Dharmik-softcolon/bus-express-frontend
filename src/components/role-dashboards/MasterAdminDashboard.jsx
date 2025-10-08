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
  const [activeTab, setActiveTab] = useState('overview')
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#B99750]">Master Admin Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                System administration and management
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'overview', name: 'Overview' },
                { id: 'users', name: 'Users' },
                { id: 'analytics', name: 'Analytics' },
                { id: 'roles', name: 'Roles' },
                { id: 'settings', name: 'Settings' }
              ].map((tab) => (
                  <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors border-0 hover:border-0 active:border-0 focus:border-0 ${
                          activeTab === tab.id
                              ? 'bg-primary text-white'
                              : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {tab.name}
                  </button>
              ))}
            </div>
          </div>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5" style={{color: "rgb(34 197 94 / var(--tw-text-opacity, 1))"}} />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-600">
                  {loading ? '...' : stats.totalUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Bus className="w-5 h-5" style={{color: "rgb(147 51 234 / var(--tw-text-opacity, 1))"}} />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Buses</p>
                <p className="text-2xl font-semibold text-gray-600">
                  {loading ? '...' : stats.totalBuses}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" style={{color: "rgb(234 179 8 / var(--tw-text-opacity, 1))"}} />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Routes</p>
                <p className="text-2xl font-semibold text-gray-600">
                  {loading ? '...' : stats.totalRoutes}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" style={{color: "rgb(99 102 241 / var(--tw-text-opacity, 1))"}} />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-600">
                  {loading ? '...' : stats.totalBookings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" style={{color: "rgb(239 68 68 / var(--tw-text-opacity, 1))"}} />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-semibold text-gray-600">
                  {loading ? '...' : stats.activeUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" style={{color: "rgb(234 179 8 / var(--tw-text-opacity, 1))"}} />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-600">
                  {loading ? '...' : stats.pendingApprovals}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* System Status */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-600">System Status</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5" style={{color: "rgb(234 88 12 / var(--tw-text-opacity, 1))"}} mr-2 />
                      <span className="text-sm text-gray-600">Database</span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5" style={{color: "rgb(234 88 12 / var(--tw-text-opacity, 1))"}} mr-2 />
                      <span className="text-sm text-gray-600">API Services</span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5" style={{color: "rgb(234 88 12 / var(--tw-text-opacity, 1))"}} mr-2 />
                      <span className="text-sm text-gray-600">Payment Gateway</span>
                    </div>
                    <span className="text-sm text-green-600 font-medium">Online</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5" style={{color: "rgb(234 88 12 / var(--tw-text-opacity, 1))"}} mr-2 />
                      <span className="text-sm text-gray-600">Email Service</span>
                    </div>
                    <span className="text-sm text-yellow-600 font-medium">Maintenance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="text-center py-12">
            <Users className="h-12 w-12" style={{color: "rgb(234 88 12 / var(--tw-text-opacity, 1))"}} mx-auto mb-4 />
            <p className="text-gray-600">User management feature coming soon</p>
            <p className="text-sm text-gray-600 mt-2">This will include user creation, editing, and role management</p>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12" style={{color: "rgb(234 88 12 / var(--tw-text-opacity, 1))"}} mx-auto mb-4 />
            <p className="text-gray-600">System analytics feature coming soon</p>
            <p className="text-sm text-gray-600 mt-2">This will include system-wide analytics and reporting</p>
          </div>
        )}
        
        {activeTab === 'roles' && (
          <div className="text-center py-12">
            <Shield className="h-12 w-12" style={{color: "rgb(234 88 12 / var(--tw-text-opacity, 1))"}} mx-auto mb-4 />
            <p className="text-gray-600">Role management feature coming soon</p>
            <p className="text-sm text-gray-600 mt-2">This will include role creation, permissions, and hierarchy management</p>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="text-center py-12">
            <Settings className="h-12 w-12" style={{color: "rgb(234 88 12 / var(--tw-text-opacity, 1))"}} mx-auto mb-4 />
            <p className="text-gray-600">System settings feature coming soon</p>
            <p className="text-sm text-gray-600 mt-2">This will include system configuration and preferences</p>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-600">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-navy rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">New bus owner registered: ABC Transport</p>
                  <p className="text-xs text-gray-600">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Route updated: Mumbai to Delhi</p>
                  <p className="text-xs text-gray-600">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">System backup completed</p>
                  <p className="text-xs text-gray-600">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">New user role created: Fleet Manager</p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
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
