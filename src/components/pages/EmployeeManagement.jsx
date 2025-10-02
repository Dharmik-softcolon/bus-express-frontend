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
  AlertCircle
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

  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    status: 'active'
  })

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
      const response = await preventDuplicateRequest('employees', () => busEmployeeAPI.getBusEmployees({ limit: 50 }))
      if (response && response.success) {
        setEmployees(response.data.employees || [])
      }
    } catch (error) {
      console.error('Error fetching employees data:', error)
      showToast('Failed to load employees data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployeesData()
  }, [])

  const handleEmployeeInputChange = (e) => {
    const { name, value } = e.target
    setEmployeeForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCreateEmployee = async (e) => {
    e.preventDefault()
    try {
      // TODO: Add API call when backend is ready
      showToast('Creating employee feature will be implemented soon', 'info')
      setShowAddModal(false)
      setEmployeeForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        position: '',
        status: 'active'
      })
      // fetchEmployeesData()
    } catch (error) {
      console.error('Error creating employee:', error)
      showToast('Failed to create employee', 'error')
    }
  }

  const handleUpdateEmployee = async (e) => {
    e.preventDefault()
    try {
      // TODO: Add API call when backend is ready
      showToast('Updating employee feature will be implemented soon', 'info')
      setEditingEmployee(null)
      setEmployeeForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        position: ''
      })
      // fetchEmployeesData()
    } catch (error) {
      console.error('Error updating employee:', error)
      showToast('Failed to update employee', 'error')
    }
  }

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        // TODO: Add API call when backend is ready
        showToast('Deleting employee feature will be implemented soon', 'info')
        // fetchEmployeesData()
      } catch (error) {
        console.error('Error deleting employee:', error)
        showToast('Failed to delete employee', 'error')
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
      status: employee.status || 'active'
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
      status: 'active'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Employee Management</h3>
            <button
              onClick={() => {
                setEditingEmployee(null)
                setShowAddModal(true)
              }}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Employee
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-3 text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading employees...</p>
              </div>
            ) : employees.length === 0 ? (
              <div className="col-span-3 text-center py-8">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No employees found</p>
                <p className="text-sm text-gray-500 mt-2">Add employees to manage your bus operations</p>
              </div>
            ) : (
              employees.map((employee) => (
                <div key={employee._id || employee.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{employee.name}</h4>
                      <p className="text-sm text-gray-600">{employee.email}</p>
                      <p className="text-sm text-gray-600">{employee.phone}</p>
                      <p className="text-sm text-gray-600">{employee.position || 'Position not specified'}</p>
                      <p className="text-sm text-gray-600">{employee.address || 'Address not specified'}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditEmployee(employee)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee._id || employee.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status || 'active')}`}>
                      {employee.status || 'Active'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h3>
                
                <form onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={employeeForm.name}
                      onChange={handleEmployeeInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={employeeForm.email}
                      onChange={handleEmployeeInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={employeeForm.phone}
                      onChange={handleEmployeeInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={employeeForm.address}
                      onChange={handleEmployeeInputChange}
                      className="input-field"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <select
                      name="position"
                      value={employeeForm.position}
                      onChange={handleEmployeeInputChange}
                      className="input-field"
                    >
                      <option value="">Select Position</option>
                      <option value="driver">Driver</option>
                      <option value="conductor">Conductor</option>
                      <option value="mechanic">Mechanic</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      {editingEmployee ? 'Update' : 'Add'} Employee
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmployeeManagement
