import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
import { showToast } from '../../utils/toast'
import { dashboardAPI, busAdminAnalyticsAPI } from '../../services/api'
import { 
  Bus, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  Loader
} from 'lucide-react'

const BusAdminOverview = () => {
  const { user } = useUser()
  const navigationItems = getNavigationMenu(user?.role)
  const [activeTab, setActiveTab] = useState('overview')
  
  // State management
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  
  // Dashboard data
  const [dashboardData, setDashboardData] = useState({
    user: null,
    statistics: {
      totalBusEmployees: 0,
      totalBookingMen: 0,
      totalBuses: 0,
      totalRoutes: 0,
      totalBookings: 0,
      totalRevenue: 0
    },
    features: [],
    recentActivities: []
  })

  // Analytics data
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalBusEmployees: 0,
      totalBookingMen: 0,
      activeBusEmployees: 0,
      activeBookingMen: 0,
      inactiveBusEmployees: 0,
      inactiveBookingMen: 0
    },
    trends: {
      employeeGrowth: { current: 0, previous: 0, percentage: 0 },
      bookingMenGrowth: { current: 0, previous: 0, percentage: 0 }
    },
    recentActivities: []
  })

  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0,
    dailyRevenue: 0,
    revenueBreakdown: { busEmployees: 0, bookingMen: 0 },
    trends: { revenueGrowth: 0, monthlyGrowth: 0, weeklyGrowth: 0 },
    topPerformers: []
  })

  const [expenseData, setExpenseData] = useState({
    totalExpenses: 0,
    monthlyExpenses: 0,
    weeklyExpenses: 0,
    dailyExpenses: 0,
    expenseBreakdown: { salaries: 0, maintenance: 0, fuel: 0, other: 0 },
    trends: { expenseGrowth: 0, monthlyGrowth: 0, weeklyGrowth: 0 },
    categoryBreakdown: []
  })

  // Mock data for buses and routes (until these APIs are implemented)
  const [routes, setRoutes] = useState([])
  const [buses, setBuses] = useState([])

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getBusAdminDashboard()
      if (response.success) {
        setDashboardData(response.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      showToast.error('Failed to load dashboard data')
    }
  }

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      console.log('Fetching analytics data...')
      const response = await busAdminAnalyticsAPI.getAnalytics()
      console.log('Analytics response:', response)
      if (response.success) {
        setAnalyticsData(response.data)
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      showToast.error('Failed to load analytics data')
    }
  }

  // Fetch revenue data
  const fetchRevenueData = async () => {
    try {
      const response = await busAdminAnalyticsAPI.getRevenueAnalytics()
      if (response.success) {
        setRevenueData(response.data)
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error)
      showToast.error('Failed to load revenue data')
    }
  }

  // Fetch expense data
  const fetchExpenseData = async () => {
    try {
      const response = await busAdminAnalyticsAPI.getExpenseAnalytics()
      if (response.success) {
        setExpenseData(response.data)
      }
    } catch (error) {
      console.error('Error fetching expense data:', error)
      showToast.error('Failed to load expense data')
    }
  }

  // Test authentication
  const testAuth = async () => {
    try {
      console.log('Testing authentication...')
      console.log('User:', user)
      console.log('Token:', user?.token)
      
      // Test with a simple API call
      const response = await dashboardAPI.getBusAdminDashboard()
      console.log('Auth test response:', response)
      
      if (response.success) {
        showToast.success('Authentication test passed!')
      } else {
        showToast.error('Authentication test failed: ' + response.message)
      }
    } catch (error) {
      console.error('Auth test error:', error)
      showToast.error('Authentication test failed: ' + error.message)
    }
  }

  // Refresh all data
  const refreshData = async () => {
    setRefreshing(true)
    try {
      await Promise.all([
        fetchDashboardData(),
        fetchAnalyticsData(),
        fetchRevenueData(),
        fetchExpenseData()
      ])
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        await Promise.all([
          fetchDashboardData(),
          fetchAnalyticsData(),
          fetchRevenueData(),
          fetchExpenseData()
        ])
      } catch (error) {
        setError('Failed to load dashboard data')
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    // Mock data for buses and routes (until these APIs are implemented)
    setTimeout(() => {
      setRoutes([
        {
          id: 1,
          name: 'Mumbai - Delhi',
          routeName: 'Mumbai - Delhi',
          distance: 1380,
          duration: '18 hours',
          totalTrips: 8,
          assignedBuses: ['KA01-AB-1234', 'MH03-CD-5678']
        },
        {
          id: 2,
          name: 'Pune - Mumbai',
          routeName: 'Pune - Mumbai',
          distance: 150,
          duration: '3 hours',
          totalTrips: 15,
          assignedBuses: ['KA02-EF-9012', 'KA02-GH-3456']
        },
        {
          id: 3,
          name: 'Bangalore - Chennai',
          routeName: 'Bangalore - Chennai',
          distance: 345,
          duration: '6 hours',
          totalTrips: 12,
          assignedBuses: ['TN01-IJ-7890']
        }
      ])
      
      setBuses([
        {
          id: 1,
          number: 'KA01-AB-1234',
          busNumber: 'KA01-AB-1234',
          status: 'active',
          capacity: 40,
          route: 'Mumbai - Delhi',
          driver: 'Rajesh Kumar',
          driverName: 'Rajesh Kumar'
        },
        {
          id: 2,
          number: 'MH03-CD-5678',
          busNumber: 'MH03-CD-5678',
          status: 'active',
          capacity: 35,
          route: 'Pune - Mumbai',
          driver: 'Amit Sharma',
          driverName: 'Amit Sharma'
        },
        {
          id: 3,
          number: 'TN01-IJ-7890',
          busNumber: 'TN01-IJ-7890',
          status: 'maintenance',
          capacity: 45,
          route: 'Bangalore - Chennai',
          driver: 'Vikram Singh',
          driverName: 'Vikram Singh'
        }
      ])
      
    }, 1000)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
                  <h1 className="text-2xl font-bold" style={{color: "#B99750"}}>Bus Admin Overview</h1>
              <p className="text-gray-600 mt-1">Fleet management dashboard and operational insights</p>
              {/* Debug info */}
              <div className="text-xs text-gray-500 mt-1">
                User: {user?.email} | Role: {user?.role} | Token: {user?.token ? 'Present' : 'Missing'}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={testAuth}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
              >
                Test Auth
              </button>
              <button
                onClick={refreshData}
                disabled={refreshing}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              
              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('bus-analytics')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'bus-analytics'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                Bus Analytics
              </button>
              <button
                onClick={() => setActiveTab('route-analytics')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'route-analytics'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                Route Analytics
              </button>
              <button
                onClick={() => setActiveTab('trip-analytics')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'trip-analytics'
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                Trip Analytics
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center gap-3">
              <Loader className="h-6 w-6 animate-spin text-primary" />
              <span className="text-gray-600">Loading dashboard...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={refreshData}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100">
                  <Bus className="h-5 w-5" style={{color: "rgb(59 130 246 / var(--tw-text-opacity, 1))"}} />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-600">Total Buses</p>
                        <p className="text-lg font-bold text-gray-600">{dashboardData.statistics.totalBuses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Active Routes</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.statistics.totalRoutes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-100">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Bus Employees</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.statistics.totalBusEmployees}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-yellow-100">
                  <Users className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Booking Managers</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.statistics.totalBookingMen}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-indigo-100">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Trips</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.statistics.totalBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-orange-100">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">₹{dashboardData.statistics.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-pink-100">
                  <TrendingUp className="h-5 w-5 text-pink-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-900">{dashboardData.statistics.totalBookings.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-red-100">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                        <p className="text-sm font-medium text-gray-600">Inactive Staff</p>
                        <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.inactiveBusEmployees + analyticsData.overview.inactiveBookingMen}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Route-Bus Assignments */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Route-Bus Assignments</h3>
            {routes.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No routes found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {routes.map((route) => (
                  <div key={route._id || route.id} className="border rounded-lg p-4">
                    <div className="flex rounded-start justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-600">{route.name || route.routeName}</h4>
                        <p className="text-sm text-gray-600">
                          {route.distance ? `${route.distance} km` : 'Distance not specified'} • 
                          {route.duration ? ` ${route.duration}` : ' Duration not specified'} • 
                          {route.totalTrips || 0} trips/day
                        </p>
                      </div>
                      <span className="text-sm font-medium text-navy">
                        {route.assignedBuses ? route.assignedBuses.length : 0} bus(es)
                      </span>
                    </div>
                    {route.assignedBuses && route.assignedBuses.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {route.assignedBuses.map((busId, index) => {
                          const bus = buses.find(b => b._id === busId || b.id === busId || b.number === busId || b.busNumber === busId)
                          return (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <span className="font-medium text-sm">{bus?.number || bus?.busNumber || busId || 'Unknown'}</span>
                                <p className="text-xs text-gray-600">Capacity: {bus?.capacity || 'N/A'} seats</p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                bus?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {bus?.status || 'unknown'}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fleet Status */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Fleet Status</h3>
            {buses.length === 0 ? (
              <div className="text-center py-12">
                <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No buses found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {buses.map((bus) => (
                  <div key={bus._id || bus.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className={`w-5 h-5 mr-3 ${
                        bus.status === 'active' ? 'text-green-500' : 'text-red-500'
                      }`} />
                      <div>
                        <span className="text-sm font-medium text-gray-600">{bus.number || bus.busNumber}</span>
                        <p className="text-xs text-gray-600">
                          {bus.route ? `${bus.route} • ` : ''}{bus.capacity || 'N/A'} seats
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-medium ${
                        bus.status === 'active' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {bus.status || 'unknown'}
                      </span>
                      <p className="text-xs text-gray-600">
                        Driver: {bus.driver || bus.driverName || 'Not assigned'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        )}

        {/* Bus Analytics Tab */}
        {activeTab === 'bus-analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹{revenueData.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Employees</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.activeBusEmployees}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Employee Growth</p>
                    <p className="text-2xl font-bold text-gray-900">+{analyticsData.trends.employeeGrowth.percentage}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Booking Managers</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.activeBookingMen}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-100">
                    <TrendingUp className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Booking Manager Growth</p>
                    <p className="text-2xl font-bold text-gray-900">+{analyticsData.trends.bookingMenGrowth.percentage}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Inactive Staff</p>
                    <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.inactiveBusEmployees + analyticsData.overview.inactiveBookingMen}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
              {analyticsData.recentActivities.length === 0 ? (
              <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent activities</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {analyticsData.recentActivities.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          activity.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                  ))}
              </div>
              )}
            </div>
          </div>
        )}

        {/* Route Analytics Tab */}
        {activeTab === 'route-analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Revenue Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                      <p className="font-medium text-gray-600">Bus Employees Revenue</p>
                      <p className="text-sm text-gray-600">From employee operations</p>
                      </div>
                      <div className="text-right">
                      <p className="font-semibold text-blue-600">₹{revenueData.revenueBreakdown.busEmployees.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-600">Booking Managers Revenue</p>
                      <p className="text-sm text-gray-600">From booking operations</p>
                      </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">₹{revenueData.revenueBreakdown.bookingMen.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
                <div className="space-y-4">
                  {revenueData.topPerformers.map((performer, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium text-gray-600">{performer.name}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          performer.type === 'employee' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {performer.type === 'employee' ? 'Employee' : 'Booking Manager'}
                        </span>
                        </div>
                        <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Revenue Generated</span>
                        <span className="font-medium text-green-600">₹{performer.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Revenue Growth</p>
                  <p className="text-2xl font-bold text-green-600">+{revenueData.trends.revenueGrowth}%</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Monthly Growth</p>
                  <p className="text-2xl font-bold text-blue-600">+{revenueData.trends.monthlyGrowth}%</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Weekly Growth</p>
                  <p className="text-2xl font-bold text-purple-600">+{revenueData.trends.weeklyGrowth}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trip Analytics Tab */}
        {activeTab === 'trip-analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-100">
                    <DollarSign className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-900">₹{expenseData.totalExpenses.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
                    <p className="text-2xl font-bold text-gray-900">₹{expenseData.monthlyExpenses.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Expense Growth</p>
                    <p className="text-2xl font-bold text-gray-900">+{expenseData.trends.expenseGrowth}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100">
                    <Users className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Salaries</p>
                    <p className="text-2xl font-bold text-gray-900">₹{expenseData.expenseBreakdown.salaries.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100">
                    <AlertCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Maintenance</p>
                    <p className="text-2xl font-bold text-gray-900">₹{expenseData.expenseBreakdown.maintenance.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100">
                    <Activity className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Fuel</p>
                    <p className="text-2xl font-bold text-gray-900">₹{expenseData.expenseBreakdown.fuel.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Expense Breakdown by Category</h3>
              <div className="space-y-4">
                {expenseData.categoryBreakdown.map((category, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium text-gray-600">{category.category}</p>
                      <span className="text-sm font-medium text-gray-900">{category.percentage}%</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-medium text-gray-900">₹{category.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  )
}

export default BusAdminOverview
