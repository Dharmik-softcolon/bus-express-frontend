import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
import { 
  Bus, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  CheckCircle
} from 'lucide-react'

const BusAdminOverview = () => {
  const { user } = useUser()
  const navigationItems = getNavigationMenu(user?.role)
  const [activeTab, setActiveTab] = useState('overview')
  
  const [mockStats] = useState({
    totalBuses: 25,
    activeRoutes: 12,
    totalEmployees: 45,
    totalBookingMen: 8,
    totalTrips: 120,
    monthlyRevenue: 245000,
    totalBookings: 1840,
    maintenanceDue: 3
  })

  const [routes, setRoutes] = useState([])
  const [buses, setBuses] = useState([])
  const [routesLoading, setRoutesLoading] = useState(true)
  const [busesLoading, setBusesLoading] = useState(true)

  useEffect(() => {
    // Mock data for demonstration
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
      
      setRoutesLoading(false)
      setBusesLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bus Admin Overview</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Fleet management dashboard and operational insights
              </p>
            </div>
          </div>
        </div>

        {/* Overview Content */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Bus className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Buses</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalBuses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Routes</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.activeRoutes}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Bus Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalEmployees}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Users className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Booking Managers</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalBookingMen}</p>
                </div>
              </div>
          </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Trips</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalTrips}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{mockStats.monthlyRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-pink-100">
                  <TrendingUp className="h-6 w-6 text-pink-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.totalBookings.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Maintenance Due</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.maintenanceDue}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Route-Bus Assignments */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Route-Bus Assignments</h3>
            {routesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading routes...</p>
              </div>
            ) : routes.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No routes found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {routes.map((route) => (
                  <div key={route._id || route.id} className="border rounded-lg p-4">
                    <div className="flex rounded-start justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{route.name || route.routeName}</h4>
                        <p className="text-sm text-gray-600">
                          {route.distance ? `${route.distance} km` : 'Distance not specified'} • 
                          {route.duration ? ` ${route.duration}` : ' Duration not specified'} • 
                          {route.totalTrips || 0} trips/day
                        </p>
                      </div>
                      <span className="text-sm font-medium text-blue-600">
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
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Fleet Status</h3>
            {busesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading buses...</p>
              </div>
            ) : buses.length === 0 ? (
              <div className="text-center py-8">
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
                        <span className="text-sm font-medium text-gray-900">{bus.number || bus.busNumber}</span>
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
                      <p className="text-xs text-gray-500">
                        Driver: {bus.driver || bus.driverName || 'Not assigned'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusAdminOverview
