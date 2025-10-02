import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  PieChart,
  BarChart
} from 'lucide-react'

const Revenue = () => {
  const { user } = useUser()
  const navigationItems = getNavigationMenu(user?.role)
  const [activeTab, setActiveTab] = useState('revenue')
  const [loading, setLoading] = useState(true)
  const [revenueData] = useState({
    totalRevenue: 2450000,
    monthlyRevenue: 425000,
    weeklyRevenue: 89000,
    dailyRevenue: 14500,
    revenueGrowth: 12.5,
    revenueSources: [
      { source: 'Ticket Sales', amount: 2100000, percentage: 85.7 },
      { source: 'Online Bookings', amount: 280000, percentage: 11.4 },
      { source: 'Cancellations', amount: -70000, percentage: -2.9 },
      { source: 'Other Services', amount: 140000, percentage: 5.7 }
    ],
    monthlyTrend: [
      { month: 'Jan', revenue: 380000, bookings: 1520 },
      { month: 'Feb', revenue: 425000, bookings: 1700 },
      { month: 'Mar', revenue: 465000, bookings: 1860 },
      { month: 'Apr', revenue: 410000, bookings: 1640 },
      { month: 'May', revenue: 442000, bookings: 1768 },
      { month: 'Jun', revenue: 425000, bookings: 1700 }
    ],
    topRoutes: [
      { route: 'Mumbai-Delhi', revenue: 650000, percentage: 26.5 },
      { route: 'Pune-Mumbai', revenue: 480000, percentage: 19.6 },
      { route: 'Bangalore-Chennai', revenue: 420000, percentage: 17.1 },
      { route: 'Delhi-Agra', revenue: 320000, percentage: 13.1 },
      { route: 'Hyderabad-Bangalore', revenue: 310000, percentage: 12.7 }
    ],
    paymentMethods: [
      { method: 'Cash', revenue: 980000, percentage: 40.0 },
      { method: 'Card Payment', revenue: 735000, percentage: 30.0 },
      { method: 'UPI', revenue: 490000, percentage: 20.0 },
      { method: 'Online Wallet', revenue: 245000, percentage: 10.0 }
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
          <p className="mt-2 text-gray-600">Loading revenue data...</p>
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Revenue Analytics</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Revenue insights and financial performance tracking
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{revenueData.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">+{revenueData.revenueGrowth}% growth</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{revenueData.monthlyRevenue.toLocaleString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4">
              <span className="text-blue-600 text-sm font-medium">Current month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Weekly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{revenueData.weeklyRevenue.toLocaleString()}</p>
              </div>
              <BarChart className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4">
              <span className="text-purple-600 text-sm font-medium">This week</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Average</p>
                <p className="text-2xl font-bold text-gray-900">₹{revenueData.dailyRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="mt-4">
              <span className="text-yellow-600 text-sm font-medium">Per day</span>
            </div>
          </div>
        </div>

        {/* Revenue Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Sources</h3>
            <div className="space-y-4">
              {revenueData.revenueSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {source.amount < 0 ? (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      ) : (
                        <PieChart className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{source.source}</div>
                      <div className="text-sm text-gray-600">{source.percentage}%</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      source.amount < 0 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      ₹{Math.abs(source.amount).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue Trend</h3>
            <div className="space-y-4">
              {revenueData.monthlyTrend.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-600">{month.month}</div>
                  <div className="flex items-center space-x-4">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(month.revenue / 500000) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm font-medium text-gray-900 w-20 text-right">
                      ₹{(month.revenue / 1000).toFixed(0)}k
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Revenue Routes */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Revenue Generating Routes</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {revenueData.topRoutes.map((route, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {route.route}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{route.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {route.percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${route.percentage}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {revenueData.paymentMethods.map((method, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{method.method}</p>
                  <p className="text-xl font-bold text-gray-900">₹{method.revenue.toLocaleString()}</p>
                </div>
                <PieChart className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${method.percentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">{method.percentage}% of total</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Revenue
