import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, MapPin, Bus, Calendar, Filter, Download } from 'lucide-react'
import { analyticsAPI } from '../../services/api'

const RevenueAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [selectedRoute, setSelectedRoute] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [revenueData, setRevenueData] = useState(null)

  // Load revenue analytics on component mount
  useEffect(() => {
    loadRevenueAnalytics()
  }, [selectedPeriod])

  const loadRevenueAnalytics = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await analyticsAPI.getRevenueAnalytics({
        period: selectedPeriod,
        route: selectedRoute === 'all' ? undefined : selectedRoute
      })
      
      if (response.success) {
        setRevenueData(response.data)
          } else {
            setError('Failed to load revenue analytics')
            setRevenueData(null)
          }
    } catch (error) {
      console.error('Error loading revenue analytics:', error)
      setError('Failed to load revenue analytics')
      setRevenueData(null)
    } finally {
      setLoading(false)
    }
  }

  const routes = ['Mumbai-Pune', 'Mumbai-Nashik', 'Pune-Nashik', 'Mumbai-Goa']
  const periods = ['daily', 'weekly', 'monthly', 'yearly']

  // Handle loading and error states
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading revenue analytics...</span>
        </div>
      </div>
    )
  }

  if (error || !revenueData) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-600">
            <p className="text-lg font-medium mb-2">Error loading analytics</p>
            <p className="text-sm">{error || 'No data available'}</p>
          </div>
        </div>
      </div>
    )
  }

  const filteredData = revenueData[selectedPeriod]?.filter(item => 
    selectedRoute === 'all' || item.route === selectedRoute
  ) || []

  const totalRevenue = filteredData.reduce((sum, item) => sum + item.revenue, 0)
  const totalPassengers = filteredData.reduce((sum, item) => sum + item.passengers, 0)
  const totalTrips = filteredData.reduce((sum, item) => sum + item.trips, 0)

  const routeWiseRevenue = routes.map(route => {
    const routeData = revenueData[selectedPeriod].filter(item => item.route === route)
    const revenue = routeData.reduce((sum, item) => sum + item.revenue, 0)
    const passengers = routeData.reduce((sum, item) => sum + item.passengers, 0)
    const trips = routeData.reduce((sum, item) => sum + item.trips, 0)
    
    return {
      route,
      revenue,
      passengers,
      trips,
      avgRevenuePerTrip: trips > 0 ? Math.round(revenue / trips) : 0,
      avgRevenuePerPassenger: passengers > 0 ? Math.round(revenue / passengers) : 0
    }
  }).sort((a, b) => b.revenue - a.revenue)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#B99750]">Revenue Analytics</h1>
          <p className="text-gray-600">Detailed revenue analysis by route and time period</p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input-field"
            >
              {periods.map(period => (
                <option key={period} value={period}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Route</label>
            <select
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="input-field"
            >
              <option value="all">All Routes</option>
              {routes.map(route => (
                <option key={route} value={route}>{route}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Passengers</p>
              <p className="text-2xl font-bold text-gray-900">{totalPassengers.toLocaleString()}</p>
            </div>
            <Bus className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trips</p>
              <p className="text-2xl font-bold text-gray-900">{totalTrips}</p>
            </div>
            <MapPin className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Route-wise Revenue Analysis */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Route-wise Revenue Analysis</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passengers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trips</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg/Trip</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg/Passenger</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {routeWiseRevenue.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{item.route}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-green-600">₹{item.revenue.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.passengers.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.trips}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.avgRevenuePerTrip.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.avgRevenuePerPassenger.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Revenue Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Detailed Revenue Data</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {selectedPeriod === 'daily' ? 'Date' : selectedPeriod === 'weekly' ? 'Week' : selectedPeriod === 'monthly' ? 'Month' : 'Year'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passengers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trips</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {selectedPeriod === 'daily' ? item.date : 
                     selectedPeriod === 'weekly' ? item.week : 
                     selectedPeriod === 'monthly' ? item.month : item.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{item.route}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-green-600">₹{item.revenue.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.passengers.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.trips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default RevenueAnalytics

