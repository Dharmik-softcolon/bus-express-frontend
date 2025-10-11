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
    }, 1000)
  }, [])

  const navigationItems = getNavigationMenu(user?.role)

  return (
    <div className="min-h-screen bg-hover-light">
      {/* Header */}
      <div className="bg-background shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-heading-1">Master Admin Dashboard</h1>
              <p className="text-body-small mt-2">System administration and management</p>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex space-x-2 bg-hover-light p-2 rounded-xl">
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
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out ${
                    activeTab === tab.id
                      ? 'bg-primary text-text shadow-md'
                      : 'text-text-dark hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="dashboard-stat">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="dashboard-stat-icon bg-primary/10 text-primary">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-caption">Total Users</p>
                <p className="dashboard-stat-value">
                  {stats.totalUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-stat">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="dashboard-stat-icon bg-success/10 text-success">
                  <Bus className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-caption">Total Buses</p>
                <p className="dashboard-stat-value">
                  {stats.totalBuses}
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-stat">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="dashboard-stat-icon bg-info/10 text-info">
                  <BarChart3 className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-caption">Total Routes</p>
                <p className="dashboard-stat-value">
                  {stats.totalRoutes}
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-stat">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="dashboard-stat-icon bg-warning/10 text-warning">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-caption">Total Bookings</p>
                <p className="dashboard-stat-value">
                  {stats.totalBookings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-stat">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="dashboard-stat-icon bg-success/10 text-success">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-caption">Active Users</p>
                <p className="dashboard-stat-value">
                  {stats.activeUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-stat">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="dashboard-stat-icon bg-error/10 text-error">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-caption">Pending</p>
                <p className="dashboard-stat-value">
                  {stats.pendingApprovals}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* System Status */}
            <div className="dashboard-card">
              <div className="dashboard-card-header">
                <h2 className="text-heading-3">System Status</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-success mr-3" />
                    <span className="text-body-small font-medium">Database</span>
                  </div>
                  <span className="text-sm font-semibold text-success">Online</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-success mr-3" />
                    <span className="text-body-small font-medium">API Services</span>
                  </div>
                  <span className="text-sm font-semibold text-success">Online</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-success mr-3" />
                    <span className="text-body-small font-medium">Payment Gateway</span>
                  </div>
                  <span className="text-sm font-semibold text-success">Online</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-warning/5 border border-warning/20">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-warning mr-3" />
                    <span className="text-body-small font-medium">Email Service</span>
                  </div>
                  <span className="text-sm font-semibold text-warning">Maintenance</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-heading-3 mb-2">User Management</h3>
            <p className="text-body-small">User management feature coming soon</p>
            <p className="text-body-small mt-2">This will include user creation, editing, and role management</p>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="h-8 w-8 text-info" />
            </div>
            <h3 className="text-heading-3 mb-2">System Analytics</h3>
            <p className="text-body-small">System analytics feature coming soon</p>
            <p className="text-body-small mt-2">This will include system-wide analytics and reporting</p>
          </div>
        )}
        
        {activeTab === 'roles' && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-warning" />
            </div>
            <h3 className="text-heading-3 mb-2">Role Management</h3>
            <p className="text-body-small">Role management feature coming soon</p>
            <p className="text-body-small mt-2">This will include role creation, permissions, and hierarchy management</p>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Settings className="h-8 w-8 text-error" />
            </div>
            <h3 className="text-heading-3 mb-2">System Settings</h3>
            <p className="text-body-small">System settings feature coming soon</p>
            <p className="text-body-small mt-2">This will include system configuration and preferences</p>
          </div>
        )}

        {/* Recent Activity */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 className="text-heading-3">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <div className="flex-1">
                <p className="text-body-small font-medium">New bus owner registered: ABC Transport</p>
                <p className="text-caption mt-1">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-success/5 border border-success/20">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <div className="flex-1">
                <p className="text-body-small font-medium">Route updated: Mumbai to Delhi</p>
                <p className="text-caption mt-1">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-warning/5 border border-warning/20">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <div className="flex-1">
                <p className="text-body-small font-medium">System backup completed</p>
                <p className="text-caption mt-1">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-info/5 border border-info/20">
              <div className="w-3 h-3 bg-info rounded-full"></div>
              <div className="flex-1">
                <p className="text-body-small font-medium">New user role created: Fleet Manager</p>
                <p className="text-caption mt-1">2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MasterAdminDashboard
