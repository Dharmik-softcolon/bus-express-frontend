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
            System that make management easy
          </p>
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
      </div>
    </div>
  )
}

export default RoleSwitcher

