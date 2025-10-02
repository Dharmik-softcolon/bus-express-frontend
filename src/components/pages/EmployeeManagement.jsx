import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
import { showToast } from '../../utils/toast'
import { busEmployeeAPI } from '../../services/api'
import { 
  User, 
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Shield,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar
} from 'lucide-react'

const EmployeeManagement = () => {
  const { user } = useUser()
  const navigationItems = getNavigationMenu(user?.role)
  const [activeTab, setActiveTab] = useState('employees')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [ongoingRequests, setOngoingRequests] = useState(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    subrole: '',
    password: '',
    aadhaarCard: '',
    salary: '',
    license: '',
    status: 'active'
  })

  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Helper function to prevent duplicate requests
  const preventDuplicateRequest = async (requestKey, apiCall, maxRetries = 3, baseDelay = 1000) => {
    if (ongoingRequests.has(requestKey)) {
      console.log(`Request ${requestKey} already in progress, skipping...`)
      return null
    }

    setOngoingRequests(prev => new Set([...prev, requestKey]))

    try {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const result = await apiCall()
          return result
        } catch (error) {
          if (error.message.includes('429') && attempt < maxRetries - 1) {
            const delayTime = baseDelay * Math.pow(2, attempt)
            console.log(`Rate limited. Retrying in ${delayTime}ms... (attempt ${attempt + 1}/${maxRetries})`)
            await new Promise(resolve => setTimeout(resolve, delayTime))
            continue
          }
          throw error
        }
      }
    } finally {
      setOngoingRequests(prev => {
        const newSet = new Set(prev)
        newSet.delete(requestKey)
        return newSet
      })
    }
  }

  // Fetch employees data
  const fetchEmployeesData = async () => {
    try {
      setLoading(true)
      const response = await preventDuplicateRequest('employees', () => busEmployeeAPI.getAllEmployees({ limit: 50 }))
      if (response && response.success) {
        setEmployees(response.data.busEmployees || [])
      }
    } catch (error) {
      console.error('Error fetching employees data:', error)
      showToast.error('Failed to load employees data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployeesData()
    
    // Test toast notification on component mount (remove later)
    setTimeout(() => {
      showToast.success('Employee Management loaded successfully!')
    }, 2000)
  }, [])

  const handleEmployeeInputChange = (e) => {
    const { name, value } = e.target
    setEmployeeForm(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Form validation
  const validateForm = () => {
    const errors = {}
    
    if (!employeeForm.name.trim()) {
      errors.name = 'Name is required'
    } else if (employeeForm.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }
    
    if (!employeeForm.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(employeeForm.email)) {
      errors.email = 'Please enter a valid email'
    }
    
    if (!employeeForm.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(employeeForm.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number'
    }
    
    if (!employeeForm.subrole) {
      errors.subrole = 'Sub-role is required'
    }
    
    // Password validation - required only for new employees or when updating password
    if (!editingEmployee) {
      if (!employeeForm.password.trim()) {
        errors.password = 'Password is required'
      } else if (employeeForm.password.length < 6) {
        errors.password = 'Password must be at least 6 characters'
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(employeeForm.password)) {
        errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }
    } else if (employeeForm.password.trim() && employeeForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    } else if (employeeForm.password.trim() && !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(employeeForm.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }
    
    if (!employeeForm.aadhaarCard.trim()) {
      errors.aadhaarCard = 'Aadhaar card is required'
    } else if (!/^\d{4}-\d{4}-\d{4}$/.test(employeeForm.aadhaarCard)) {
      errors.aadhaarCard = 'Aadhaar card must be in format XXXX-XXXX-XXXX'
    }
    
    if (!employeeForm.salary.trim()) {
      errors.salary = 'Salary is required'
    } else if (isNaN(employeeForm.salary) || parseFloat(employeeForm.salary) <= 0) {
      errors.salary = 'Salary must be a positive number'
    }
    
    if (employeeForm.subrole === 'DRIVER' && !employeeForm.license.trim()) {
      errors.license = 'License number is required for drivers'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateEmployee = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      showToast.error('Please fix the form errors before submitting')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const employeeData = {
        name: employeeForm.name,
        email: employeeForm.email,
        phone: employeeForm.phone,
        password: employeeForm.password || 'Employee123', // Default if not provided
        position: employeeForm.position,
        subrole: employeeForm.subrole,
        address: employeeForm.address,
        aadhaarCard: employeeForm.aadhaarCard,
        salary: parseFloat(employeeForm.salary),
        license: employeeForm.license
      }
      
      const response = await preventDuplicateRequest('create_employee', 
        () => busEmployeeAPI.createEmployee(employeeData)
      )
      
      console.log('Create employee response:', response) // Debug
      
      // Always show success message for create operation (if we get here, it's successful)
      if (response) {
        showToast.success('Employee created successfully')
        closeModals()
        fetchEmployeesData() // Refresh the list
      }
    } catch (error) {
      console.error('Error creating employee:', error)
      showToast.error(error.message || 'Failed to create employee')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateEmployee = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      showToast.error('Please fix the form errors before submitting')
      return
    }
    
    if (!editingEmployee) return
    
    setIsSubmitting(true)
    
    try {
      const employeeId = editingEmployee._id || editingEmployee.id
      const updateData = {
        name: employeeForm.name,
        email: employeeForm.email,
        phone: employeeForm.phone,
        address: employeeForm.address,
        position: employeeForm.position,
        subrole: employeeForm.subrole,
        aadhaarCard: employeeForm.aadhaarCard,
        salary: parseFloat(employeeForm.salary),
        license: employeeForm.license,
        isActive: employeeForm.status === 'active'
      }
      
      // Only include password if provided (for updating)
      if (employeeForm.password.trim()) {
        updateData.password = employeeForm.password
      }
      
      const response = await preventDuplicateRequest(`update_employee_${employeeId}`, 
        () => busEmployeeAPI.updateEmployee(employeeId, updateData)
      )
      
      console.log('Update employee response:', response) // Debug
      
      // Always show success message for update operation (if we get here, it's successful)
      if (response) {
        showToast.success('Employee updated successfully')
        closeModals()
        fetchEmployeesData() // Refresh the list
      }
    } catch (error) {
      console.error('Error updating employee:', error)
      showToast.error(error.message || 'Failed to update employee')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await preventDuplicateRequest(`delete_employee_${employeeId}`, 
          () => busEmployeeAPI.deleteEmployee(employeeId)
        )
        
        console.log('Delete employee response:', response) // Debug
        
        // Always show success message for delete operation (if we get here, it's successful)
        if (response) {
          showToast.success('Employee deleted successfully')
          fetchEmployeesData() // Refresh the list
        }
      } catch (error) {
        console.error('Error deleting employee:', error)
        showToast.error(error.message || 'Failed to delete employee')
      }
    }
  }

  const openEditEmployee = (employee) => {
    setEditingEmployee(employee)
    setEmployeeForm({
      name: employee.name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      address: employee.address || '',
      position: employee.position || '',
      subrole: employee.subrole || '',
      password: '', // Don't show existing password for security
      aadhaarCard: employee.aadhaarCard || '',
      salary: employee.salary?.toString() || '',
      license: employee.license || '',
      status: employee.isActive ? 'active' : 'inactive'
    })
    setShowAddModal(true)
  }

  const closeModals = () => {
    setShowAddModal(false)
    setEditingEmployee(null)
    setEmployeeForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      position: '',
      subrole: '',
      password: '',
      aadhaarCard: '',
      salary: '',
      license: '',
      status: 'active'
    })
    setFormErrors({})
    setIsSubmitting(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Filter and sort employees
  const filteredAndSortedEmployees = () => {
    let filtered = employees.filter(employee => {
      const matchesSearch = searchTerm === '' || 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone.includes(searchTerm) ||
        employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.subrole?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'active' && employee.isActive !== false) ||
        (filterStatus === 'inactive' && employee.isActive === false)
      
      return matchesSearch && matchesStatus
    })

    // Sort employees
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'subrole':
          return (a.subrole || '').localeCompare(b.subrole || '')
        case 'position':
          return (a.position || '').localeCompare(b.position || '')
        case 'email':
          return a.email.localeCompare(b.email)
        case 'status':
          return (a.isActive === b.isActive) ? 0 : a.isActive ? -1 : 1
        default:
          return 0
      }
    })

    return filtered
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Employee Management</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage bus employees and staff
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Employee Management
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Manage your bus employees and their accounts
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchEmployeesData}
                className="btn-secondary flex items-center"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => {
                  setEditingEmployee(null)
                  setShowAddModal(true)
                }}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employees by name, email, phone, position, or subrole..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="input-field min-w-[120px]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field min-w-[140px]"
                >
                  <option value="name">Sort by Name</option>
                  <option value="subrole">Sort by Subrole</option>
                  <option value="position">Sort by Position</option>
                  <option value="email">Sort by Email</option>
                  <option value="status">Sort by Status</option>
                </select>
              </div>
            </div>
          </div>

          {/* Employee Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3 text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading employees...</p>
              </div>
            ) : filteredAndSortedEmployees().length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filterStatus !== 'all' ? 'No employees match your filters' : 'No employees found'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search terms or filters' 
                    : 'Add employees to manage your bus operations'
                  }
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <button
                    onClick={() => {
                      setEditingEmployee(null)
                      setShowAddModal(true)
                    }}
                    className="btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Employee
                  </button>
                )}
              </div>
            ) : (
              filteredAndSortedEmployees().map((employee) => (
                <div key={employee._id || employee.id} className="bg-white rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <h4 className="font-semibold text-gray-900 text-lg">{employee.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.isActive ? 'active' : 'inactive')}`}>
                            {employee.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditEmployee(employee)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit employee"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(employee._id || employee.id)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete employee"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Eye className="h-3 w-3 mr-1" />
                        {employee.subrole || 'No subrole specified'}
                      </span>
                      {employee.position && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 ml-2">
                          {employee.position}
                        </span>
                      )}
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="truncate">{employee.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{employee.phone}</span>
                      </div>
                      {employee.salary && (
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-4 h-4 mr-2 flex items-center justify-center text-gray-400">₹</div>
                          <span>{employee.salary.toLocaleString()} / month</span>
                        </div>
                      )}
                      {employee.license && employee.subrole === 'DRIVER' && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Shield className="h-4 w-4 mr-2 text-gray-400" />
                          <span>License: {employee.license}</span>
                        </div>
                      )}
                      {employee.aadhaarCard && (
                        <div className="flex items-center text-sm text-gray-500">
                          <div className="w-4 h-4 mr-2 flex items-center justify-center text-gray-400">🆔</div>
                          <span>{employee.aadhaarCard}</span>
                        </div>
                      )}
                      {employee.address && (
                        <div className="flex items-start text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="break-words">{employee.address}</span>
                        </div>
                      )}
                      {employee.createdAt && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Joined {new Date(employee.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                  </h3>
                  <button
                    onClick={closeModals}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  <form onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={employeeForm.name}
                        onChange={handleEmployeeInputChange}
                        className={`input-field ${formErrors.name ? 'border-red-300 bg-red-50' : ''}`}
                        placeholder="Enter employee's full name"
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={employeeForm.email}
                        onChange={handleEmployeeInputChange}
                        className={`input-field ${formErrors.email ? 'border-red-300 bg-red-50' : ''}`}
                        placeholder="employee@example.com"
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={employeeForm.phone}
                        onChange={handleEmployeeInputChange}
                        className={`input-field ${formErrors.phone ? 'border-red-300 bg-red-50' : ''}`}
                        placeholder="10-digit phone number"
                        maxLength={10}
                      />
                      {formErrors.phone && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={employeeForm.password}
                        onChange={handleEmployeeInputChange}
                        className={`input-field ${formErrors.password ? 'border-red-300 bg-red-50' : ''}`}
                        placeholder={editingEmployee ? "Leave blank to keep existing password" : "Enter password"}
                        required={!editingEmployee}
                      />
                      {formErrors.password && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                      )}
                      {!editingEmployee && (
                        <p className="mt-1 text-xs text-gray-500">
                          Must contain uppercase, lowercase, and number
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub-role *
                      </label>
                      <select
                        name="subrole"
                        value={employeeForm.subrole || ''}
                        onChange={(e) => {
                          handleEmployeeInputChange(e)
                          // Clear license when changing from DRIVER to HELPER
                          if (e.target.value !== 'DRIVER') {
                            setEmployeeForm(prev => ({ ...prev, license: '' }))
                            if (formErrors.license) {
                              setFormErrors(prev => ({ ...prev, license: '' }))
                            }
                          }
                        }}
                        className={`input-field ${formErrors.subrole ? 'border-red-300 bg-red-50' : ''}`}
                      >
                        <option value="">Select Sub-role</option>
                        <option value="DRIVER">Driver</option>
                        <option value="HELPER">Helper/Conductor</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Driver: Operates the bus | Helper: Assists driver, handles passengers
                      </p>
                      {formErrors.subrole && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.subrole}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position/Job Title
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={employeeForm.position}
                        onChange={handleEmployeeInputChange}
                        className="input-field"
                        placeholder="e.g., Senior Driver, Route Helper"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Aadhaar Card Number *
                      </label>
                      <input
                        type="text"
                        name="aadhaarCard"
                        value={employeeForm.aadhaarCard}
                        onChange={handleEmployeeInputChange}
                        className={`input-field ${formErrors.aadhaarCard ? 'border-red-300 bg-red-50' : ''}`}
                        placeholder="1234-5678-9012"
                        maxLength={14}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Format: XXXX-XXXX-XXXX
                      </p>
                      {formErrors.aadhaarCard && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.aadhaarCard}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Salary *
                      </label>
                      <input
                        type="number"
                        name="salary"
                        value={employeeForm.salary}
                        onChange={handleEmployeeInputChange}
                        className={`input-field ${formErrors.salary ? 'border-red-300 bg-red-50' : ''}`}
                        placeholder="25000"
                        min="0"
                        step="100"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Enter salary in Rupees
                      </p>
                      {formErrors.salary && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.salary}</p>
                      )}
                    </div>

                    {employeeForm.subrole === 'DRIVER' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Driving License Number *
                        </label>
                        <input
                          type="text"
                          name="license"
                          value={employeeForm.license}
                          onChange={handleEmployeeInputChange}
                          className={`input-field ${formErrors.license ? 'border-red-300 bg-red-50' : ''}`}
                          placeholder="Enter driving license number"
                        />
                        {formErrors.license && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.license}</p>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={employeeForm.address}
                        onChange={handleEmployeeInputChange}
                        className="input-field"
                        rows="3"
                        placeholder="Employee's residential address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={employeeForm.status}
                        onChange={handleEmployeeInputChange}
                        className="input-field"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>


                    {/* Modal Footer */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={closeModals}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white transition-colors ${
                          isSubmitting 
                            ? 'bg-blue-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {editingEmployee ? 'Updating...' : 'Adding...'}
                          </span>
                        ) : (
                          `${editingEmployee ? 'Update' : 'Add'} Employee`
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmployeeManagement
