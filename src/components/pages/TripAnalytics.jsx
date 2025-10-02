import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
import { 
  Calendar,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  RefreshCw,
  CheckCircle
} from 'lucide-react'

const TripAnalytics = () => {
  const { user } = useUser()
  const navigationItems = getNavigationMenu(user?.role)
  const [activeTab, setActiveTab] = useState('trip-analytics')
  const [loading, setLoading] = useState(true)
  const [analyticsData] = useState({
    totalTrips: 1250,
    completedTrips: 1180,
    averageDelay: 12,
    peakDays: ['Monday', 'Friday', 'Saturday'],
    tripPerformance: [
      { route: 'Mumbai-Delhi', trips: 25, revenue: 225000, avgOccupancy: 92, avgDelay: 8 },
      { route: 'Pune-Mumbai', trips: 45, revenue: 180000, avgOccupancy: 89, avgDelay: 12 },
      { route: 'Bangalore-Chennai', trips: 38, revenue: 152000, avgOccupancy: 87, avgDelay: 15 },
      { route: 'Delhi-Agra', trips: 28, revenue: 98000, avgOccupancy: 85, avgDelay: 6 },
      { route: 'Hyderabad-Bangalore', trips: 32, revenue: 128000, avgOccupancy: 83, avgDelay: 18 }
    ],
    weeklyTrends: [
      { day: 'Monday', trips: 185, revenue: 740000, occupancy: 89 },
      { day: 'Tuesday', trips: 162, revenue: 648000, occupancy: 84 },
      { day: 'Wednesday', trips: 158, revenue: 632000, occupancy: 82 },
      { day: 'Thursday', trips: 167, revenue: 668000, occupancy: 86 },
      { day: 'Friday', trips: 195, revenue: 780000, occupancy: 91 },
      { day: 'Saturday', trips: 198, revenue: 792000, occupancy: 93 },
      { day: 'Sunday', trips: 145, revenue: 580000, occupancy: 76 }
    ],
    timeSlots: [
      { slot: '6:00 AM - 9:00 AM', trips: 185, avgOccupancy: 95 },
      { slot: '9:00 AM - 12:00 PM', trips: 142, avgOccupancy: 78 },
      { slot: '12:00 PM - 3:00 PM', trips: 98, avgOccupancy: 65 },
      { slot: '3:00 PM - 6:00 PM', trips: 165, avgOccupancy: 82 },
      { slot: '6:00 PM - 9:00 PM', trips: 178, avgOccupancy: 88 },
      { slot: '9:00 PM - 6:00 AM', trips: 89, avgOccupancy: 45 }
    ]
  })

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading trip analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Trip Analytics</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Performance insights and analytics for trip operations
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Trips</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalTrips.toLocaleString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4">
              <span className="text-blue-600 text-sm font-medium">{analyticsData.completedTrips} completed</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Delay</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.averageDelay} min</p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
            <div className="mt-4">
              <span className="text-red-600 text-sm font-medium">Per trip</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((analyticsData.completedTrips / analyticsData.totalTrips) * 100)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">Completion rate</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Peak Days</p>
                <p className="text-lg font-bold text-gray-900">M-F-S</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4">
              <span className="text-purple-600 text-sm font-medium">High demand</span>
            </div>
          </div>
        </div>

        {/* Trip Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Trip Performance by Route</h3>
            <div className="space-y-4">
              {analyticsData.tripPerformance.map((route, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-3">{route.route}</div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{route.trips}</div>
                      <div className="text-xs text-gray-600">Trips</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{route.avgOccupancy}%</div>
                      <div className="text-xs text-gray-600">Occupancy</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">₹{route.revenue.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Revenue</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-600">{route.avgDelay}m</div>
                      <div className="text-xs text-gray-600">Avg Delay</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Trends */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Weekly Trip Trends</h3>
            <div className="space-y-4">
              {analyticsData.weeklyTrends.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-600 w-20">{day.day}</div>
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(day.trips / 200) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm font-medium text-gray-900 w-16 text-right">
                      {day.trips}
                    </div>
                    <div className="text-sm font-medium text-gray-900 w-20 text-right">
                      ₹{(day.revenue / 1000).toFixed(0)}k
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Time Slot Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Time Slot Performance</h3>
            <div className="space-y-4">
              {analyticsData.timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{slot.slot}</div>
                    <div className="text-sm text-gray-600">{slot.trips} trips</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{slot.avgOccupancy}%</div>
                    <div className="text-sm text-gray-600">avg occupancy</div>
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${slot.avgOccupancy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delay Analysis</h3>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-red-900">Delayed Trips</div>
                    <div className="text-sm text-red-700">70 trips this month</div>
                  </div>
                  <RefreshCw className="h-8 w-8 text-red-600" />
                </div>
                <div className="mt-3">
                  <div className="w-full bg-red-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full w-5/6"></div>
                  </div>
                  <div className="text-xs text-red-600 mt-1">83% delay rate</div>
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-green-900">On-Time Trips</div>
                    <div className="text-sm text-green-700">1,110 trips this month</div>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="mt-3">
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full w-11/12"></div>
                  </div>
                  <div className="text-xs text-green-600 mt-1">89% on-time rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripAnalytics
