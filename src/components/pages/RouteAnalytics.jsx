import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
import { 
  MapPin,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
  Zap
} from 'lucide-react'

const RouteAnalytics = () => {
  const { user } = useUser()
  const navigationItems = getNavigationMenu(user?.role)
  const [activeTab, setActiveTab] = useState('route-analytics')
  const [loading, setLoading] = useState(true)
  const [analyticsData] = useState({
    totalRoutes: 15,
    activeRoutes: 12,
    averageDistance: 180,
    popularRoutes: [
      { name: 'Mumbai - Delhi', passengers: 1850, revenue: 65000, distance: 1380 },
      { name: 'Bangalore - Chennai', passengers: 1420, revenue: 48500, distance: 345 },
      { name: 'Pune - Mumbai', passengers: 1680, revenue: 52000, distance: 150 },
      { name: 'Delhi - Agra', passengers: 920, revenue: 32000, distance: 200 },
      { name: 'Hyderabad - Bangalore', passengers: 1150, revenue: 41000, distance: 570 }
    ],
    performanceMetrics: [
      { route: 'Mumbai - Delhi', occupancyRate: 92, avgRating: 4.3, tripsPerDay: 8 },
      { route: 'Bangalore - Chennai', occupancyRate: 87, avgRating: 4.1, tripsPerDay: 12 },
      { route: 'Pune - Mumbai', occupancyRate: 89, avgRating: 4.2, tripsPerDay: 15 },
      { route: 'Delhi - Agra', occupancyRate: 85, avgRating: 4.0, tripsPerDay: 6 },
      { route: 'Hyderabad - Bangalore', occupancyRate: 83, avgRating: 4.1, tripsPerDay: 10 }
    ],
    timeDistribution: [
      { time: '6:00 AM - 10:00 AM', bookings: 35, revenue: 45000 },
      { time: '10:00 AM - 2:00 PM', bookings: 20, revenue: 28000 },
      { time: '2:00 PM - 6:00 PM', bookings: 25, revenue: 32000 },
      { time: '6:00 PM - 10:00 PM', bookings: 30, revenue: 39000 },
      { time: '10:00 PM - 6:00 AM', bookings: 15, revenue: 19000 }
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
          <p className="mt-2 text-gray-600">Loading route analytics...</p>
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Route Analytics</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Performance insights and analytics for route operations
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Routes</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalRoutes}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4">
              <span className="text-blue-600 text-sm font-medium">{analyticsData.activeRoutes} active</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Distance</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.averageDistance} km</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">Per route</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Performer</p>
                <p className="text-lg font-bold text-gray-900">Mumbai-Delhi</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="mt-4">
              <span className="text-yellow-600 text-sm font-medium">92% occupancy</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Peak Hours</p>
                <p className="text-lg font-bold text-gray-900">6-10 AM</p>
              </div>
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4">
              <span className="text-purple-600 text-sm font-medium">35% bookings</span>
            </div>
          </div>
        </div>

        {/* Popular Routes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Routes</h3>
            <div className="space-y-4">
              {analyticsData.popularRoutes.map((route, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white text-sm font-medium rounded-full">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{route.name}</div>
                      <div className="text-sm text-gray-600">{route.distance} km • {route.tripsPerDay || 8} trips/day</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{route.passengers}</div>
                    <div className="text-sm text-gray-600">passengers</div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-medium text-gray-900">₹{route.revenue.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Route Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Route Performance</h3>
            <div className="space-y-4">
              {analyticsData.performanceMetrics.map((route, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900 mb-2">{route.route}</div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{route.occupancyRate}%</div>
                      <div className="text-xs text-gray-600">Occupancy</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{route.avgRating}</div>
                      <div className="text-xs text-gray-600">Rating</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">{route.tripsPerDay}</div>
                      <div className="text-xs text-gray-600">Trips/Day</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Time Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Time Distribution</h3>
          <div className="space-y-4">
            {analyticsData.timeDistribution.map((timeSlot, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-600">{timeSlot.time}</div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(timeSlot.bookings / 35) * 100}%` }}
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-900 w-16 text-right">
                    {timeSlot.bookings}%
                  </div>
                  <div className="text-sm font-medium text-gray-900 w-20 text-right">
                    ₹{timeSlot.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RouteAnalytics
