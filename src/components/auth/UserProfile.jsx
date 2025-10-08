import { useState } from 'react'
import { useUser } from '../../contexts/UserContext'
import { User, LogOut, Settings, Building, Mail, Phone, Calendar } from 'lucide-react'

const UserProfile = () => {
  const { user, logout, updateUser } = useUser()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
  }

  const getRoleDisplayName = (role) => {
    const roleNames = {
      'MASTER_ADMIN': 'Master Admin',
      'BUS_OWNER': 'Bus Owner',
      'BUS_ADMIN': 'Bus Admin',
      'BOOKING_MAN': 'Booking Man',
      'BUS_EMPLOYEE': 'Bus Employee',
      'customer': 'Customer'
    }
    return roleNames[role] || role
  }

  const getRoleColor = (role) => {
    const colors = {
      'MASTER_ADMIN': 'bg-red-100 text-red-800',
      'BUS_OWNER': 'bg-button text-gray-600',
      'BUS_ADMIN': 'bg-green-100 text-green-800',
      'BOOKING_MAN': 'bg-purple-100 text-purple-800',
      'BUS_EMPLOYEE': 'bg-orange-100 text-orange-800',
      'customer': 'bg-gray-100 text-gray-600'
    }
    return colors[role] || 'bg-gray-100 text-gray-600'
  }

  if (!user) return null

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-white hover:text-white hover:bg-hover transition-colors"
      >
        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
          <User className="h-4 w-4 text-icon" />
        </div>
        <span className="hidden sm:inline max-w-24 lg:max-w-none truncate font-medium">{user.name}</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-6">
            {/* User Info */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-hover rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-600 text-lg truncate">{user.name}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getRoleColor(user.role)}`}>
                  {getRoleDisplayName(user.role)}
                </span>
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex items-center text-gray-600 p-2 rounded-lg bg-gray-50">
                <Mail className="h-4 w-4 mr-3 flex-shrink-0 text-icon" />
                <span className="truncate">{user.email}</span>
              </div>
              {user.company && (
                <div className="flex items-center text-gray-600 p-2 rounded-lg bg-gray-50">
                  <Building className="h-4 w-4 mr-3 flex-shrink-0 text-icon" />
                  <span className="truncate">{user.company}</span>
                </div>
              )}
              {user.position && (
                <div className="flex items-center text-gray-600 p-2 rounded-lg bg-gray-50">
                  <User className="h-4 w-4 mr-3 flex-shrink-0 text-icon" />
                  <span className="truncate">{user.position}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={() => {
                  setShowDropdown(false)
                  // Add profile settings functionality here
                }}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
              >
                <Settings className="h-4 w-4 mr-3 flex-shrink-0 text-icon" />
                <span className="truncate">Profile Settings</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2 font-medium"
              >
                <LogOut className="h-4 w-4 mr-3 flex-shrink-0" />
                <span className="truncate">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}

export default UserProfile

