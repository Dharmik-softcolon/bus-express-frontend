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
    <nav className="bg-white shadow-sm border-b border-gray-200 -mt-px">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 p-1">
        <div className="flex justify-between h-11">
          <div className="flex">
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigationItems.map((item) => {
                const IconComponent = getIcon(item.icon)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors border-0 hover:border-0 active:border-0 focus:border-0 ${
                      isActiveRoute(item.path)
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-button/20 hover:text-gray-600'
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
        <div className="px-2 py-1 space-y-1">
          {navigationItems.map((item) => {
            const IconComponent = getIcon(item.icon)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center pl-3 pr-4 py-2 text-base font-medium transition-colors border-0 hover:border-0 active:border-0 focus:border-0 ${
                  isActiveRoute(item.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-button/20 hover:text-gray-600'
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
