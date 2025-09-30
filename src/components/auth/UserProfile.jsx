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
      'master-admin': 'Master Admin',
      'bus-owner': 'Bus Owner',
      'bus-admin': 'Bus Admin',
      'booking-man': 'Booking Man',
      'bus-employee': 'Bus Employee',
      'customer': 'Customer'
    }
    return roleNames[role] || role
  }

  const getRoleColor = (role) => {
    const colors = {
      'master-admin': 'bg-red-100 text-red-800',
      'bus-owner': 'bg-blue-100 text-blue-800',
      'bus-admin': 'bg-green-100 text-green-800',
      'booking-man': 'bg-purple-100 text-purple-800',
      'bus-employee': 'bg-orange-100 text-orange-800',
      'customer': 'bg-gray-100 text-gray-800'
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  if (!user) return null

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
      >
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
        </div>
        <span className="hidden sm:inline max-w-24 lg:max-w-none truncate">{user.name}</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4">
            {/* User Info */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {getRoleDisplayName(user.role)}
                </span>
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              {user.company && (
                <div className="flex items-center text-gray-600">
                  <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{user.company}</span>
                </div>
              )}
              {user.position && (
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{user.position}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="border-t pt-4">
              <button
                onClick={() => {
                  setShowDropdown(false)
                  // Add profile settings functionality here
                }}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                <Settings className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">Profile Settings</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors mt-2"
              >
                <LogOut className="h-4 w-4 mr-2 flex-shrink-0" />
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

