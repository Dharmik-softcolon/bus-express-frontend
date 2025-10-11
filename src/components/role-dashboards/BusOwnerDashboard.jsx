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
    <div className="min-h-screen bg-hover-light">
      {/* Header */}
      <div className="bg-background shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-heading-1">Bus Owner Dashboard</h1>
              <p className="text-body-small mt-2">Monitor fleet performance and analytics</p>
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
                  <Bus className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-caption">Total Buses</p>
                <p className="dashboard-stat-value">
                  {loading ? '...' : stats.totalBuses}
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-stat">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="dashboard-stat-icon bg-success/10 text-success">
                  <MapPin className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-caption">Active Routes</p>
                <p className="dashboard-stat-value">
                  {loading ? '...' : stats.activeRoutes}
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-stat">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="dashboard-stat-icon bg-info/10 text-info">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-caption">Total Trips</p>
                <p className="dashboard-stat-value">
                  {loading ? '...' : stats.totalTrips}
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-stat">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="dashboard-stat-icon bg-warning/10 text-warning">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-caption">Monthly Revenue</p>
                <p className="dashboard-stat-value">
                  {loading ? '...' : `₹${stats.monthlyRevenue.toLocaleString()}`}
                </p>
              </div>
            </div>
          </div>

          <div className="dashboard-stat">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="dashboard-stat-icon bg-primary/10 text-primary">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-caption">Total Bookings</p>
                <p className="dashboard-stat-value">
                  {loading ? '...' : stats.totalBookings.toLocaleString()}
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
                <p className="text-caption">Maintenance Due</p>
                <p className="dashboard-stat-value">
                  {loading ? '...' : stats.maintenanceDue}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-8">
          {/* Fleet Status */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2 className="text-heading-3">Fleet Status</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success mr-3" />
                  <span className="text-body-small font-medium">Bus-001 (Mumbai-Delhi)</span>
                </div>
                <span className="text-sm font-semibold text-success">On Route</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-success/5 border border-success/20">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-success mr-3" />
                  <span className="text-body-small font-medium">Bus-002 (Delhi-Bangalore)</span>
                </div>
                <span className="text-sm font-semibold text-success">On Route</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-warning/5 border border-warning/20">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-warning mr-3" />
                  <span className="text-body-small font-medium">Bus-003 (Chennai-Hyderabad)</span>
                </div>
                <span className="text-sm font-semibold text-warning">Scheduled</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-error/5 border border-error/20">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-error mr-3" />
                  <span className="text-body-small font-medium">Bus-004 (Pune-Goa)</span>
                </div>
                <span className="text-sm font-semibold text-error">Maintenance</span>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2 className="text-heading-3">Recent Bookings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-hover-light border border-border hover:border-primary/20 transition-colors duration-200">
                <div>
                  <p className="text-body-small font-medium">Mumbai → Delhi</p>
                  <p className="text-caption">Bus-001 • Seat 12A, 12B</p>
                </div>
                <div className="text-right">
                  <p className="text-body-small font-semibold">₹2,500</p>
                  <p className="text-caption">Today, 6:00 AM</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-hover-light border border-border hover:border-primary/20 transition-colors duration-200">
                <div>
                  <p className="text-body-small font-medium">Delhi → Bangalore</p>
                  <p className="text-caption">Bus-002 • Seat 8C, 8D</p>
                </div>
                <div className="text-right">
                  <p className="text-body-small font-semibold">₹3,200</p>
                  <p className="text-caption">Tomorrow, 8:00 PM</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-hover-light border border-border hover:border-primary/20 transition-colors duration-200">
                <div>
                  <p className="text-body-small font-medium">Chennai → Hyderabad</p>
                  <p className="text-caption">Bus-003 • Seat 15A</p>
                </div>
                <div className="text-right">
                  <p className="text-body-small font-semibold">₹1,800</p>
                  <p className="text-caption">Dec 25, 10:00 AM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h2 className="text-heading-3">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div 
                onClick={() => handleQuickAction('bus-analytics')}
                className="text-center p-6 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1 hover:shadow-md"
              >
                <Bus className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-body-small font-semibold">Bus Analytics</p>
              </div>
              <div 
                onClick={() => handleQuickAction('route-analytics')}
                className="text-center p-6 rounded-xl bg-success/5 border border-success/20 hover:bg-success/10 hover:border-success/30 transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1 hover:shadow-md"
              >
                <MapPin className="w-8 h-8 text-success mx-auto mb-3" />
                <p className="text-body-small font-semibold">Route Analytics</p>
              </div>
              <div 
                onClick={() => handleQuickAction('trip-analytics')}
                className="text-center p-6 rounded-xl bg-info/5 border border-info/20 hover:bg-info/10 hover:border-info/30 transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1 hover:shadow-md"
              >
                <Calendar className="w-8 h-8 text-info mx-auto mb-3" />
                <p className="text-body-small font-semibold">Trip Analytics</p>
              </div>
              <div 
                onClick={() => handleQuickAction('revenue')}
                className="text-center p-6 rounded-xl bg-warning/5 border border-warning/20 hover:bg-warning/10 hover:border-warning/30 transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1 hover:shadow-md"
              >
                <DollarSign className="w-8 h-8 text-warning mx-auto mb-3" />
                <p className="text-body-small font-semibold">Revenue</p>
              </div>
              <div 
                onClick={() => handleQuickAction('expenses')}
                className="text-center p-6 rounded-xl bg-error/5 border border-error/20 hover:bg-error/10 hover:border-error/30 transition-all duration-300 ease-in-out cursor-pointer hover:-translate-y-1 hover:shadow-md"
              >
                <TrendingUp className="w-8 h-8 text-error mx-auto mb-3" />
                <p className="text-body-small font-semibold">Expenses</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusOwnerDashboard
