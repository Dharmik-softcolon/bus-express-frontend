import { Link } from 'react-router-dom'
import { Bus, User, Menu, X } from 'lucide-react'
import { useUser } from '../../contexts/UserContext'
import UserProfile from '../auth/UserProfile'
import Navigation from './Navigation'
import { useState } from 'react'

const Header = () => {
  const { user } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <>
      <header className="bg-primary border-b border-hover sticky top-0 z-40" style={{boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}}>
        <div className="container-responsive">
          <div className="flex justify-between items-center h-10.5">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0 group">
              <Bus className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:text-hover transition-colors" />
              <span className="text-base sm:text-lg lg:text-xl font-bold text-white group-hover:text-hover transition-colors">
                BusExpress
              </span>
            </Link>

            {/* Company Name - Responsive visibility */}
            <div className="flex-1 text-center hidden md:block lg:block">
              {user && user.role !== 'MASTER_ADMIN' && user.company && (
                <h1 className="text-sm lg:text-base xl:text-lg font-semibold text-gray-300 truncate px-2">
                  {user.company}
                </h1>
              )}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden sm:flex items-center space-x-2 flex-shrink-0">
              {user ? (
                <>
                  {/* User Role Badge - Hidden on mobile, visible on tablet+ */}
                  <div className="hidden md:block px-2 py-1 rounded-full text-xs font-medium bg-white text-primary border border-hover">
                    {user.role === 'MASTER_ADMIN' ? 'Master Admin' :
                     user.role === 'BUS_OWNER' ? 'Bus Owner' :
                     user.role === 'BUS_ADMIN' ? 'Bus Admin' :
                     user.role === 'BOOKING_MAN' ? 'Booking Manager' :
                     user.role === 'BUS_EMPLOYEE' ? 'Bus Employee' : user.role}
                  </div>
                  <UserProfile />
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-hover/50 transition-all duration-200"
                >
                  <User className="h-4 w-4 lg:h-5 lg:w-5" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden flex items-center space-x-2">
              {user && (
                <div className="px-2 py-1 rounded-full text-xs font-medium bg-white text-primary border border-hover">
                  {user.role === 'MASTER_ADMIN' ? 'Master Admin' :
                   user.role === 'BUS_OWNER' ? 'Bus Owner' :
                   user.role === 'BUS_ADMIN' ? 'Bus Admin' :
                   user.role === 'BOOKING_MAN' ? 'Booking Manager' :
                   user.role === 'BUS_EMPLOYEE' ? 'Bus Employee' : user.role}
                </div>
              )}
              <button
                onClick={toggleMobileMenu}
                className="p-1.5 rounded-md text-gray-300 hover:text-white hover:bg-hover/50 transition-all duration-200"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden border-t border-hover bg-white shadow-sm">
              <div className="px-3 py-2">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#6A0066]">{user.name || user.email}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100/50 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Navigation for logged-in users */}
      {user && <Navigation />}
    </>
  )
}

export default Header
