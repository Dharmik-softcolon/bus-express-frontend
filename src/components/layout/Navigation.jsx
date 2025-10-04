import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
import { 
  BarChart3, 
  Bus, 
  MapPin, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Users,
  Settings,
  Shield,
  UserCheck,
  ClipboardList,
  PlusCircle,
  UserPlus,
  BarChart2
} from 'lucide-react'

const Navigation = () => {
  const { user, logout } = useUser()
  const location = useLocation()

  if (!user) {
    return null
  }

  const navigationItems = getNavigationMenu(user.role)

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  // Icon mapping for navigation items
  const getIcon = (iconName) => {
    const iconMap = {
      dashboard: BarChart3,
      buses: Bus,
      routes: MapPin,
      trips: Calendar,
      revenue: DollarSign,
      expenses: TrendingUp,
      users: Users,
      settings: Settings,
      roles: Shield,
      analytics: BarChart2,
      overview: BarChart3,
      employees: UserCheck,
      booking: ClipboardList,
      bookings: ClipboardList,
      customers: UserPlus,
      createBooking: PlusCircle,
      bookingMen: UserCheck,
      profile: UserCheck
    }
    return iconMap[iconName] || BarChart3
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigationItems.map((item) => {
                const IconComponent = getIcon(item.icon)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActiveRoute(item.path)
                        ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigationItems.map((item) => {
            const IconComponent = getIcon(item.icon)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors ${
                  isActiveRoute(item.path)
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <IconComponent className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
