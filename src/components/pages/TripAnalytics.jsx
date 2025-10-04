import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { showToast } from '../../utils/toast'
import { tripAPI, analyticsAPI } from '../../services/api'
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Users,
  Bus,
  Route,
  DollarSign,
  Activity,
  RefreshCw,
  Download,
  Filter,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  PlayCircle,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'

const TripAnalytics = () => {
  const { user } = useUser()
  
  // State management
  const [timeRange, setTimeRange] = useState('monthly')
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Analytics data
  const [tripStats, setTripStats] = useState(null)
  const [revenueData, setRevenueData] = useState([])
  const [bookingData, setBookingData] = useState([])
  const [busPerformanceData, setBusPerformanceData] = useState([])
  const [routePerformanceData, setRoutePerformanceData] = useState([])
  
  // UI state
  const [showFilters, setShowFilters] = useState(false)
  const [selectedChart, setSelectedChart] = useState('revenue')
  const [chartView, setChartView] = useState('chart') // chart or table

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = {
        period: timeRange,
        ...(dateRange.startDate && dateRange.endDate ? {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        } : {})
      }
      
      // Fetch trip statistics
      const tripStatsResponse = await tripAPI.getTripStatistics(params)
      if (tripStatsResponse.success) {
        setTripStats(tripStatsResponse.data)
      }
      
      // Fetch revenue analytics
      const revenueResponse = await analyticsAPI.getRevenueAnalytics(params)
      if (revenueResponse.success) {
        setRevenueData(revenueResponse.data)
      }
      
      // Fetch booking analytics
      const bookingResponse = await analyticsAPI.getBookingAnalytics(params)
      if (bookingResponse.success) {
        setBookingData(bookingResponse.data)
      }
      
      // Fetch bus performance analytics
      const busPerformanceResponse = await analyticsAPI.getBusPerformanceAnalytics(params)
      if (busPerformanceResponse.success) {
        setBusPerformanceData(busPerformanceResponse.data)
      }
      
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setError('Failed to load analytics data')
      showToast('Failed to load analytics data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange, dateRange])

  // Handle date range change
  const handleDateRangeChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Clear date range
  const clearDateRange = () => {
    setDateRange({ startDate: '', endDate: '' })
  }

  // Export data
  const exportData = (data, filename) => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      data.map(row => Object.values(row).join(",")).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${filename}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Stat card component
  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          {trend > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(trend)}% from last period
          </span>
        </div>
      )}
    </div>
  )

  // Chart component placeholder (you can integrate with Chart.js or similar)
  const ChartPlaceholder = ({ title, data, type = 'bar' }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartView(chartView === 'chart' ? 'table' : 'chart')}
            className="btn-secondary text-sm"
          >
            {chartView === 'chart' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {chartView === 'chart' ? 'Table' : 'Chart'}
          </button>
          <button
            onClick={() => exportData(data, title.toLowerCase().replace(/\s+/g, '_'))}
            className="btn-secondary text-sm"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {chartView === 'chart' ? (
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Chart visualization</p>
            <p className="text-sm text-gray-500">Integrate with Chart.js or similar library</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {data.length > 0 && Object.keys(data[0]).map(key => (
                  <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Trip Analytics</h1>
              <p className="text-gray-600 mt-2">
                Comprehensive insights into trip performance and analytics
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              <button
                onClick={fetchAnalyticsData}
                disabled={loading}
                className="btn-primary flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="input-field"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearDateRange}
                className="btn-secondary text-sm"
              >
                Clear Date Range
              </button>
            </div>
          </div>
        )}

        {/* Statistics Overview */}
        {tripStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Trips"
              value={tripStats.totalTrips}
              icon={BarChart3}
              color="bg-blue-500"
              subtitle={`${tripStats.completedTrips} completed`}
            />
            <StatCard
              title="Total Revenue"
              value={`₹${tripStats.totalRevenue?.toLocaleString() || 0}`}
              icon={DollarSign}
              color="bg-green-500"
              subtitle={`${tripStats.totalBookings} bookings`}
            />
            <StatCard
              title="Average Occupancy"
              value={`${Math.round((tripStats.averageOccupancy || 0) * 100)}%`}
              icon={Users}
              color="bg-purple-500"
              subtitle="Seat utilization"
            />
            <StatCard
              title="Success Rate"
              value={`${Math.round(((tripStats.completedTrips || 0) / (tripStats.totalTrips || 1)) * 100)}%`}
              icon={Activity}
              color="bg-orange-500"
              subtitle="Completed vs Total"
            />
          </div>
        )}

        {/* Status Distribution */}
        {tripStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full mr-3">
                  <Calendar className="h-4 w-4 text-navy" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Scheduled</p>
                  <p className="text-lg font-bold text-gray-900">{tripStats.scheduledTrips}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-full mr-3">
                  <PlayCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-lg font-bold text-gray-900">{tripStats.inProgressTrips}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-full mr-3">
                  <CheckCircle className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-lg font-bold text-gray-900">{tripStats.completedTrips}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-full mr-3">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Cancelled</p>
                  <p className="text-lg font-bold text-gray-900">{tripStats.cancelledTrips}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-full mr-3">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Delayed</p>
                  <p className="text-lg font-bold text-gray-900">{tripStats.delayedTrips}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="space-y-6">
          {/* Chart Selection */}
          <div className="flex space-x-2">
            {[
              { id: 'revenue', name: 'Revenue Analytics', icon: DollarSign },
              { id: 'bookings', name: 'Booking Analytics', icon: Users },
              { id: 'bus-performance', name: 'Bus Performance', icon: Bus },
              { id: 'route-performance', name: 'Route Performance', icon: Route }
            ].map((chart) => (
              <button
                key={chart.id}
                onClick={() => setSelectedChart(chart.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedChart === chart.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <chart.icon className="h-4 w-4 mr-2" />
                {chart.name}
              </button>
            ))}
          </div>

          {/* Selected Chart */}
          {selectedChart === 'revenue' && (
            <ChartPlaceholder
              title="Revenue Analytics"
              data={revenueData}
              type="bar"
            />
          )}

          {selectedChart === 'bookings' && (
            <ChartPlaceholder
              title="Booking Analytics"
              data={bookingData}
              type="line"
            />
          )}

          {selectedChart === 'bus-performance' && (
            <ChartPlaceholder
              title="Bus Performance"
              data={busPerformanceData}
              type="bar"
            />
          )}

          {selectedChart === 'route-performance' && (
            <ChartPlaceholder
              title="Route Performance"
              data={routePerformanceData}
              type="pie"
            />
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Analytics</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchAnalyticsData}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TripAnalytics