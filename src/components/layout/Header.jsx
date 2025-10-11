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
      <header className="bg-primary border-b border-primary/20 sticky top-0 z-40 shadow-lg">
        <div className="container-responsive">
          <div className="flex justify-between items-center h-10.5">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0 group">
              <Bus className="h-5 w-5 sm:h-6 sm:w-6 text-text group-hover:text-text/80 transition-all duration-300" />
              <span className="text-base sm:text-lg lg:text-xl font-bold text-text group-hover:text-text/80 transition-all duration-300">
                SafeRun
              </span>
            </Link>

            {/* Company Name - Responsive visibility */}
            <div className="flex-1 text-center hidden md:block lg:block">
              {user && user.role !== 'MASTER_ADMIN' && user.company && (
                <h1 className="text-sm lg:text-base xl:text-lg font-semibold text-text truncate px-2">
                  {user.company}
                </h1>
              )}
            </div>

            {/* Desktop User Menu */}
            <div className="hidden sm:flex items-center space-x-2 flex-shrink-0">
              {user ? (
                <>
                  {/* User Role Badge - Hidden on mobile, visible on tablet+ */}
                  <div className="hidden md:block px-3 py-1.5 rounded-full text-xs font-semibold bg-background text-primary border border-background/20 shadow-sm">
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
                  className="flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-semibold text-text hover:text-text/80 hover:bg-background/10 transition-all duration-300 ease-in-out"
                >
                  <User className="h-4 w-4 lg:h-5 lg:w-5" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden flex items-center space-x-2">
              {user && (
                <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-background text-primary border border-background/20 shadow-sm">
                  {user.role === 'MASTER_ADMIN' ? 'Master Admin' :
                   user.role === 'BUS_OWNER' ? 'Bus Owner' :
                   user.role === 'BUS_ADMIN' ? 'Bus Admin' :
                   user.role === 'BOOKING_MAN' ? 'Booking Manager' :
                   user.role === 'BUS_EMPLOYEE' ? 'Bus Employee' : user.role}
                </div>
              )}
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg text-text hover:text-text/80 hover:bg-background/10 transition-all duration-300 ease-in-out"
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
            <div className="sm:hidden border-t border-primary/20 bg-background shadow-lg">
              <div className="px-4 py-3">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-dark">{user.name || user.email}</p>
                      <p className="text-xs text-text-light">{user.email}</p>
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold text-text-dark hover:text-primary hover:bg-primary/5 transition-all duration-300 ease-in-out"
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
