import { useState } from 'react'
import { Users, Building, Bus, UserCheck, Settings } from 'lucide-react'

const RoleSwitcher = () => {
  const [currentRole, setCurrentRole] = useState('MASTER_ADMIN')

  const roles = [
    {
      id: 'MASTER_ADMIN',
      name: 'Master Admin',
      description: 'System administrator with full control',
      icon: Settings,
      color: 'bg-red-100 text-red-800',
      features: [
        'Manage all bus owners',
        'System-wide settings',
        'Platform commission tracking',
        'User role management'
      ]
    },
    {
      id: 'BUS_OWNER',
      name: 'Bus Owner',
      description: 'Company owner managing multiple buses',
      icon: Building,
      color: 'bg-blue-100 text-blue-800',
      features: [
        'Manage bus admins',
        'View daily reports',
        'Employee management',
        'Revenue tracking'
      ]
    },
    {
      id: 'BUS_ADMIN',
      name: 'Bus Admin',
      description: 'Administrator for bus operations',
      icon: Bus,
      color: 'bg-green-100 text-green-800',
      features: [
        'Create and manage trips',
        'Assign employees to buses',
        'Manage routes and schedules',
        'Booking management'
      ]
    },
    {
      id: 'BOOKING_MAN',
      name: 'Booking Man',
      description: 'Agent for customer bookings',
      icon: UserCheck,
      color: 'bg-purple-100 text-purple-800',
      features: [
        'Book customer seats',
        'Cancel bookings',
        'View booking reports',
        'Commission tracking'
      ]
    },
    {
      id: 'BUS_EMPLOYEE',
      name: 'Bus Employee',
      description: 'Driver or conductor',
      icon: Users,
      color: 'bg-orange-100 text-orange-800',
      features: [
        'View assigned trips',
        'Customer list access',
        'Add trip expenses',
        'Pickup/drop point details'
      ]
    }
  ]

  const getRoleRoutes = (roleId) => {
    switch (roleId) {
      case 'MASTER_ADMIN':
        return '/master-admin'
      case 'BUS_OWNER':
        return '/bus-owner'
      case 'BUS_ADMIN':
        return '/bus-admin'
      case 'BOOKING_MAN':
        return '/booking-man'
      case 'BUS_EMPLOYEE':
        return '/bus-employee'
      default:
        return '/bus-admin'
    }
  }

  const handleRoleSwitch = (roleId) => {
    setCurrentRole(roleId)
    const route = getRoleRoutes(roleId)
    window.location.href = route
  }

  const currentRoleData = roles.find(role => role.id === currentRole)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Role-Based Access Control
          </h1>
          <p className="text-gray-600">
            Switch between different user roles to test the system
          </p>
        </div>

        {/* Current Role Display */}
        {currentRoleData && (
          <div className="card mb-8">
            <div className="flex items-center mb-4">
              <div className={`p-3 rounded-full ${currentRoleData.color}`}>
                <currentRoleData.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">{currentRoleData.name}</h2>
                <p className="text-gray-600">{currentRoleData.description}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Key Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {currentRoleData.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${
                currentRole === role.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => handleRoleSwitch(role.id)}
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-full ${role.color}`}>
                  <role.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  {role.features.slice(0, 3).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                  {role.features.length > 3 && (
                    <li className="text-blue-600">+{role.features.length - 3} more</li>
                  )}
                </ul>
              </div>
              
              <button
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  currentRole === role.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {currentRole === role.id ? 'Current Role' : 'Switch to Role'}
              </button>
            </div>
          ))}
        </div>

        {/* Role Hierarchy */}
        <div className="card mt-8">
          <h3 className="text-lg font-semibold mb-4">Role Hierarchy & Permissions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <Settings className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <span className="font-medium">Master Admin</span>
                  <p className="text-sm text-gray-600">Full system control</p>
                </div>
              </div>
              <span className="text-sm text-red-600 font-medium">Level 1</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Building className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <span className="font-medium">Bus Owner</span>
                  <p className="text-sm text-gray-600">Company management</p>
                </div>
              </div>
              <span className="text-sm text-blue-600 font-medium">Level 2</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Bus className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <span className="font-medium">Bus Admin</span>
                  <p className="text-sm text-gray-600">Operations management</p>
                </div>
              </div>
              <span className="text-sm text-green-600 font-medium">Level 3</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <UserCheck className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <span className="font-medium">Booking Man</span>
                  <p className="text-sm text-gray-600">Customer service</p>
                </div>
              </div>
              <span className="text-sm text-purple-600 font-medium">Level 4</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-orange-600 mr-3" />
                <div>
                  <span className="font-medium">Bus Employee</span>
                  <p className="text-sm text-gray-600">Trip execution</p>
                </div>
              </div>
              <span className="text-sm text-orange-600 font-medium">Level 5</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="card mt-8">
          <h3 className="text-lg font-semibold mb-4">How to Use</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <span className="font-medium text-blue-600 mr-2">1.</span>
              <span>Click on any role card to switch to that user's dashboard</span>
            </div>
            <div className="flex items-start">
              <span className="font-medium text-blue-600 mr-2">2.</span>
              <span>Each role has different permissions and features</span>
            </div>
            <div className="flex items-start">
              <span className="font-medium text-blue-600 mr-2">3.</span>
              <span>Test the system by switching between roles</span>
            </div>
            <div className="flex items-start">
              <span className="font-medium text-blue-600 mr-2">4.</span>
              <span>Higher level roles can access lower level features</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoleSwitcher

