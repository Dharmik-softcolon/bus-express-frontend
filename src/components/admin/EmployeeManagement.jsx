import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { ROLES, BUS_EMPLOYEE_SUBROLES, ROLE_HIERARCHY } from '../../config/config'
import { employeeAPI, authAPI } from '../../services/api'
import { showToast } from '../../utils/toast'
import { formatAadhaarCard } from '../../utils/formatters'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign,
  Shield,
  Users,
  Search,
  Filter,
  Download,
  Upload
} from 'lucide-react'

const EmployeeManagement = () => {
  const { user } = useUser()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: getDefaultRole(), // Default based on user role
    subrole: getDefaultRole() === ROLES.BUS_EMPLOYEE ? BUS_EMPLOYEE_SUBROLES.DRIVER : undefined, // Only for BUS_EMPLOYEE
    license: '',
    aadhaarCard: '',
    address: '',
    assignedBus: '',
    status: 'active'
  })

  // Get default role based on user's role
  function getDefaultRole() {
    switch (user?.role) {
      case ROLES.MASTER_ADMIN:
        return ROLES.BUS_OWNER;
      case ROLES.BUS_OWNER:
        return ROLES.BUS_ADMIN;
      case ROLES.BUS_ADMIN:
        return ROLES.BUS_EMPLOYEE;
      default:
        return ROLES.BUS_EMPLOYEE;
    }
  }

  // Get available roles based on user's role
  function getAvailableRoles() {
    switch (user?.role) {
      case ROLES.MASTER_ADMIN:
        return [
          { value: ROLES.BUS_OWNER, label: 'Bus Owner' }
        ];
      case ROLES.BUS_OWNER:
        return [
          { value: ROLES.BUS_ADMIN, label: 'Bus Admin' }
        ];
      case ROLES.BUS_ADMIN:
        return [
          { value: ROLES.BUS_EMPLOYEE, label: 'Bus Employee' },
          { value: ROLES.BOOKING_MAN, label: 'Booking Manager' }
        ];
      default:
        return [
          { value: ROLES.BUS_EMPLOYEE, label: 'Bus Employee' }
        ];
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  // Role is fixed to BUS_ADMIN, no need for dynamic role setting

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      
      // Fetch employees and bus admins separately
      const [employeesResponse, busAdminsResponse] = await Promise.all([
        employeeAPI.getAllEmployees({ search: searchTerm, isActive: filterRole === 'all' ? undefined : filterRole === 'active' }),
        authAPI.getBusAdmins()
      ])
      
      const allEmployees = []
      
      // Add bus employees
      if (employeesResponse.success) {
        const busEmployees = (employeesResponse.data.employees || []).map(emp => ({
          ...emp,
          id: emp._id || emp.id,
          role: ROLES.BUS_EMPLOYEE,
          status: emp.isActive ? 'active' : 'inactive'
        }))
        allEmployees.push(...busEmployees)
      }
      
      // Add bus admins (convert to employee format for display)
      if (busAdminsResponse.success) {
        const busAdmins = (busAdminsResponse.data.busAdmins || []).map(admin => ({
          ...admin,
          id: admin._id || admin.id,
          role: ROLES.BUS_ADMIN,
          status: admin.isActive ? 'active' : 'inactive'
        }))
        allEmployees.push(...busAdmins)
      }
      
      setEmployees(allEmployees)
    } catch (error) {
      console.error('Error fetching employees:', error)
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      showToast.error('Passwords do not match!')
      return
    }
    
    if (!editingEmployee && formData.password.length < 6) {
      showToast.error('Password must be at least 6 characters long!')
      return
    }
    
    try {
      const employeeData = {
        ...formData,
        company: user.company,
        createdBy: user.id
      }
      
      // Remove confirmPassword from the data
      delete employeeData.confirmPassword
      
      // Remove subrole if not BUS_EMPLOYEE
      if (employeeData.role !== ROLES.BUS_EMPLOYEE) {
        delete employeeData.subrole
      }
      
      // Remove license if not DRIVER
      if (employeeData.subrole !== BUS_EMPLOYEE_SUBROLES.DRIVER) {
        delete employeeData.license
      }
      
      // Remove assignedBus if not DRIVER
      if (employeeData.subrole !== BUS_EMPLOYEE_SUBROLES.DRIVER) {
        delete employeeData.assignedBus
      }
      
      let response
      if (editingEmployee) {
        const employeeId = editingEmployee.id || editingEmployee._id
        // Use bus admin API for BUS_ADMIN role, employee API for others
        if (formData.role === ROLES.BUS_ADMIN) {
          response = await authAPI.updateBusAdmin(employeeId, employeeData)
        } else {
          response = await employeeAPI.updateEmployee(employeeId, employeeData)
        }
      } else {
        // Use bus admin API for BUS_ADMIN role, employee API for others
        if (formData.role === ROLES.BUS_ADMIN) {
          response = await authAPI.createBusAdmin(employeeData)
        } else {
          response = await employeeAPI.createEmployee(employeeData)
        }
      }
      
      if (response.success) {
        setShowModal(false)
        setEditingEmployee(null)
        resetForm()
        fetchEmployees()
        const employeeType = formData.role === ROLES.BUS_ADMIN ? 'bus admin' : 'employee'
        showToast.success(editingEmployee ? `${employeeType.charAt(0).toUpperCase() + employeeType.slice(1)} updated successfully!` : `${employeeType.charAt(0).toUpperCase() + employeeType.slice(1)} created successfully!`)
      } else {
        showToast.error(response.message || 'Failed to save employee')
      }
    } catch (error) {
      console.error('Error saving employee:', error)
      const employeeType = formData.role === ROLES.BUS_ADMIN ? 'bus admin' : 'employee'
      showToast.error(`Error saving ${employeeType}. Please try again.`)
    }
  }
  
  const resetForm = () => {
    const defaultRole = getDefaultRole()
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: defaultRole,
      subrole: defaultRole === ROLES.BUS_EMPLOYEE ? BUS_EMPLOYEE_SUBROLES.DRIVER : undefined,
      license: '',
      aadhaarCard: '',
      address: '',
      assignedBus: '',
      status: 'active'
    })
    setShowPassword(false)
  }

  const handleEdit = (employee) => {
    setEditingEmployee(employee)
    const role = employee.role || getDefaultRole()
    setFormData({
      name: employee.name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      password: '',
      confirmPassword: '',
      role: role,
      subrole: role === ROLES.BUS_EMPLOYEE ? (employee.subrole || BUS_EMPLOYEE_SUBROLES.DRIVER) : undefined,
      license: employee.license || '',
      aadhaarCard: employee.aadhaarCard || '',
      address: employee.address || '',
      assignedBus: employee.assignedBus || '',
      status: employee.status || 'active'
    })
    setShowModal(true)
  }

  const handleDelete = async (employeeId) => {
    const employee = employees.find(emp => (emp.id === employeeId) || (emp._id === employeeId))
    const employeeType = employee?.role === ROLES.BUS_ADMIN ? 'bus admin' : 'employee'
    
    if (window.confirm(`Are you sure you want to delete this ${employeeType}? This action cannot be undone.`)) {
      try {
        // Use bus admin API for BUS_ADMIN role, employee API for others
        let response
        if (employee?.role === ROLES.BUS_ADMIN) {
          response = await authAPI.deleteBusAdmin(employeeId)
        } else {
          response = await employeeAPI.deleteEmployee(employeeId)
        }
        
        if (response.success) {
          fetchEmployees()
          showToast.success(`${employeeType.charAt(0).toUpperCase() + employeeType.slice(1)} deleted successfully!`)
        } else {
          showToast.error(response.message || `Failed to delete ${employeeType}`)
        }
      } catch (error) {
        console.error('Error deleting employee:', error)
        showToast.error(`Error deleting ${employeeType}. Please try again.`)
      }
    }
  }
  
  const handleStatusToggle = async (employeeId, currentStatus) => {
    const employee = employees.find(emp => (emp.id === employeeId) || (emp._id === employeeId))
    const employeeType = employee?.role === ROLES.BUS_ADMIN ? 'bus admin' : 'employee'
    
    try {
      let response
      if (employee?.role === ROLES.BUS_ADMIN) {
        // For bus admins, we need to use a different approach since there's no toggle endpoint
        const newStatus = currentStatus === 'active' ? false : true
        response = await authAPI.updateBusAdmin(employeeId, { isActive: newStatus })
      } else {
        // For bus employees, use the toggle endpoint
        response = await employeeAPI.updateEmployeeStatus(employeeId)
      }
      
      if (response.success) {
        fetchEmployees()
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
        showToast.success(`${employeeType.charAt(0).toUpperCase() + employeeType.slice(1)} status updated to ${newStatus}!`)
      } else {
        showToast.error(response.message || `Failed to update ${employeeType} status`)
      }
    } catch (error) {
      console.error('Error updating employee status:', error)
      showToast.error(`Error updating ${employeeType} status. Please try again.`)
    }
  }
  

  // Filter and search employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.phone?.includes(searchTerm)
    const matchesRole = filterRole === 'all' || employee.role === filterRole
    return matchesSearch && matchesRole
  })

  const getRoleLabel = (role) => {
    const labels = {
      [ROLES.BUS_ADMIN]: 'Bus Admin',
      [ROLES.BOOKING_MAN]: 'Booking Manager',
      [ROLES.BUS_EMPLOYEE]: 'Bus Employee',
    }
    return labels[role] || role
  }

  const getSubroleLabel = (subrole) => {
    const labels = {
      [BUS_EMPLOYEE_SUBROLES.DRIVER]: 'Driver',
      [BUS_EMPLOYEE_SUBROLES.HELPER]: 'Helper',
    }
    return labels[subrole] || subrole
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="h-8 w-8 text-blue-600" />
                {user?.role === ROLES.BUS_OWNER ? 'Bus Admin Management' : 'Employee Management'}
              </h1>
              <p className="mt-2 text-gray-600">
                {user?.role === ROLES.BUS_OWNER 
                  ? 'Manage your bus company administrators.' 
                  : 'Manage your bus company employees and administrators.'
                }
              </p>
              {user?.role === ROLES.MASTER_ADMIN && (
                <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded-md">
                  <p className="text-sm text-purple-800">
                    <Shield className="inline h-4 w-4 mr-1" />
                    You can create Bus Owners.
                  </p>
                </div>
              )}
              {user?.role === ROLES.BUS_OWNER && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <Shield className="inline h-4 w-4 mr-1" />
                    You can create Bus Admins.
                  </p>
                </div>
              )}
              {user?.role === ROLES.BUS_ADMIN && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">
                    <Shield className="inline h-4 w-4 mr-1" />
                    You can create Bus Employees and Booking Managers.
                  </p>
                </div>
              )}
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {user?.role === ROLES.BUS_OWNER ? 'Add Bus Admin' : 'Add Employee'}
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={user?.role === ROLES.BUS_OWNER 
                    ? "Search bus admins by name, email, or phone..." 
                    : "Search employees by name, email, or phone..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="input-field pl-10"
                >
                  <option value="all">All Bus Admins</option>
                  <option value={ROLES.BUS_ADMIN}>Bus Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-outline flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </button>
              <button className="btn-outline flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import
              </button>
            </div>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading employees...</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {employees.length === 0 ? 'No bus admins' : 'No bus admins found'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {employees.length === 0 
                  ? 'Get started by adding your first bus admin.' 
                  : 'Try adjusting your search or filter criteria.'}
              </p>
              {employees.length === 0 && user?.role === ROLES.BUS_OWNER && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2 mx-auto"
                  >
                    <Plus className="h-4 w-4" />
                    Add Bus Admin
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bus Admin
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id || employee._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {employee.name?.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {employee.id || employee._id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getRoleLabel(employee.role)}
                        </div>
                        {employee.subrole && (
                          <div className="text-sm text-gray-500">
                            {getSubroleLabel(employee.subrole)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {employee.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{employee.salary}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleStatusToggle(employee.id || employee._id, employee.status)}
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                            employee.status === 'active' 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {employee.status}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            title={employee.role === ROLES.BUS_ADMIN ? "Edit Bus Admin" : "Edit Employee"}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id || employee._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            title={employee.role === ROLES.BUS_ADMIN ? "Delete Bus Admin" : "Delete Employee"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit Employee Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  {editingEmployee 
                    ? 'Edit Employee' 
                    : user?.role === ROLES.BUS_OWNER 
                      ? 'Add New Bus Admin' 
                      : 'Add New Employee'
                  }
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingEmployee(null)
                    resetForm()
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="input-field"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="input-field"
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="input-field"
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Joining Date
                    </label>
                    <input
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Password Fields - Only for new employees */}
                {!editingEmployee && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="input-field pr-10"
                          placeholder="Enter password"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="input-field"
                        placeholder="Confirm password"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Role Selection - Hidden for BUS_OWNER, shown for others */}
                {user?.role !== ROLES.BUS_OWNER && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="input-field"
                      required
                    >
                      {getAvailableRoles().map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Fixed Role Display for BUS_OWNER */}
                {user?.role === ROLES.BUS_OWNER && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Role: Bus Admin</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      This user will have administrative privileges for your bus company.
                    </p>
                  </div>
                )}

                {/* Subrole Selection - Only for BUS_EMPLOYEE */}
                {formData.role === ROLES.BUS_EMPLOYEE && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee Type *
                    </label>
                    <select
                      value={formData.subrole}
                      onChange={(e) => setFormData({...formData, subrole: e.target.value})}
                      className="input-field"
                      required
                    >
                      <option value={BUS_EMPLOYEE_SUBROLES.DRIVER}>Driver</option>
                      <option value={BUS_EMPLOYEE_SUBROLES.HELPER}>Helper</option>
                    </select>
                  </div>
                )}

                {/* License Field - Only for Drivers */}
                {formData.role === ROLES.BUS_EMPLOYEE && formData.subrole === BUS_EMPLOYEE_SUBROLES.DRIVER && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Driving License
                    </label>
                    <input
                      type="text"
                      value={formData.license}
                      onChange={(e) => setFormData({...formData, license: e.target.value})}
                      className="input-field"
                      placeholder="Enter driving license number"
                    />
                  </div>
                )}

                {/* Assigned Bus - Only for Drivers */}
                {formData.role === ROLES.BUS_EMPLOYEE && formData.subrole === BUS_EMPLOYEE_SUBROLES.DRIVER && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned Bus *
                    </label>
                    <input
                      type="text"
                      value={formData.assignedBus}
                      onChange={(e) => setFormData({...formData, assignedBus: e.target.value})}
                      className="input-field"
                      placeholder="Enter bus number (e.g., MH-01-AB-1234)"
                      required
                    />
                  </div>
                )}

                {/* Salary and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Salary
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        value={formData.salary}
                        onChange={(e) => setFormData({...formData, salary: e.target.value})}
                        className="input-field pl-10"
                        placeholder="Enter salary"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="input-field"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Aadhaar Card */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aadhaar Card Number
                  </label>
                  <input
                    type="text"
                    value={formData.aadhaarCard}
                    onChange={(e) => setFormData({...formData, aadhaarCard: formatAadhaarCard(e.target.value)})}
                    className="input-field"
                    placeholder="1234-5678-9012"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows={3}
                    className="input-field"
                    placeholder="Enter full address"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingEmployee(null)
                      resetForm()
                    }}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    {editingEmployee ? 'Update Bus Admin' : 'Create Bus Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmployeeManagement
