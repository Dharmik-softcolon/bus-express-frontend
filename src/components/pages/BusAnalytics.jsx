import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
import { showToast } from '../../utils/toast'
import { analyticsAPI } from '../../services/api'
import { 
  BarChart,
  TrendingUp,
  Bus,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  RefreshCw,
  Clock
} from 'lucide-react'

const BusAnalytics = () => {
  const { user } = useUser()
  const navigationItems = getNavigationMenu(user?.role)
  const [activeTab, setActiveTab] = useState('bus-analytics')
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 125000,
    occupancyRate: 78.5,
    averageRating: 4.2,
    totalPassengers: 2500,
    peakHours: ['8:00 AM - 10:00 AM', '5:00 PM - 7:00 PM'],
    topRoutes: [
      { name: 'Mumbai - Pune', revenue: 45000, passengers: 850 },
      { name: 'Delhi - Agra', revenue: 38000, passengers: 720 },
      { name: 'Bangalore - Chennai', revenue: 32000, passengers: 680 }
    ],
    monthlyData: [
      { month: 'Jan', revenue: 110000, passengers: 2100 },
      { month: 'Feb', revenue: 125000, passengers: 2500 },
      { month: 'Mar', revenue: 145000, passengers: 2900 },
      { month: 'Apr', revenue: 120000, passengers: 2400 },
      { month: 'May', revenue: 135000, passengers: 2700 },
      { month: 'Jun', revenue: 140000, passengers: 2800 }
    ]
  })

  useEffect(() => {
    // Simulate loading analytics data
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading bus analytics...</p>
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
              <h1 className="text-2xl font-bold" style={{color: "#B99750"}}>Bus Analytics</h1>
              <p className="text-gray-600 mt-1">Performance insights and analytics for your bus fleet</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{analyticsData.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">+12% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.occupancyRate}%</p>
              </div>
              <Users className="h-8 w-8 text-navy" />
            </div>
            <div className="mt-4">
              <span className="text-navy text-sm font-medium">+3.2% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.averageRating}/5</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="mt-4">
              <span className="text-yellow-600 text-sm font-medium">Stable</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Passengers</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalPassengers.toLocaleString()}</p>
              </div>
              <Bus className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4">
              <span className="text-purple-600 text-sm font-medium">+8.5% from last month</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue Trend</h3>
            <div className="space-y-4">
              {analyticsData.monthlyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-600">{data.month}</div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(data.revenue / 145000) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm font-medium text-gray-900 w-20 text-right">
                      ₹{data.revenue.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Routes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Routes</h3>
            <div className="space-y-4">
              {analyticsData.topRoutes.map((route, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{route.name}</div>
                      <div className="text-sm text-gray-600">{route.passengers} passengers</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">₹{route.revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Peak Travel Hours</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analyticsData.peakHours.map((hour, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Clock className="h-5 w-5 text-navy" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{hour}</div>
                  <div className="text-sm text-gray-600">High demand period</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusAnalytics
