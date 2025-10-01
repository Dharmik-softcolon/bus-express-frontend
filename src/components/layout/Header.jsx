import { Link } from 'react-router-dom'
import { Bus, User } from 'lucide-react'
import { useUser } from '../../contexts/UserContext'
import UserProfile from '../auth/UserProfile'
import Navigation from './Navigation'

const Header = () => {
  const { user } = useUser()

  return (
    <>
      <header className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <Bus className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <span className="text-lg sm:text-xl font-bold text-gray-900">BusExpress</span>
            </Link>

            {/* Company Name - Empty for Master Admin */}
            <div className="flex-1 text-center hidden sm:block">
              {user && user.role !== 'MASTER_ADMIN' && user.company && (
                <h1 className="text-sm lg:text-lg font-semibold text-gray-800 truncate px-2">
                  {user.company}
                </h1>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {user ? (
                <>
                  {/* User Role Badge - Hidden on mobile */}
                  <div className="hidden md:block px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium bg-green-100 text-green-800">
                    {user.role === 'MASTER_ADMIN' ? 'Master Admin' :
                     user.role === 'BUS_OWNER' ? 'Bus Owner' :
                     user.role === 'BUS_ADMIN' ? 'Bus Admin' :
                     user.role === 'BOOKING_MAN' ? 'Booking Manager' :
                     user.role === 'BUS_EMPLOYEE' ? 'Bus Employee' :
                     user.role === 'CUSTOMER' ? 'Customer' : user.role}
                  </div>
                  <UserProfile />
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-2 sm:px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Navigation for logged-in users */}
      {user && <Navigation />}
    </>
  )
}

export default Header
