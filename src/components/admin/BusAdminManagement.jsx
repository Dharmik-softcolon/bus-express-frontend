import { useState, useEffect } from 'react'
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserCheck,
  UserX,
  AlertCircle
} from 'lucide-react'
import { busOwnerAPI } from '../../services/api'
import { toast } from 'react-toastify'

const BusAdminManagement = () => {
  const [busAdmins, setBusAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    position: '',
    address: ''
  })
  const [errors, setErrors] = useState({})
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    fetchBusAdmins()
  }, [pagination.page, searchTerm, statusFilter])

  const fetchBusAdmins = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        isActive: statusFilter === 'all' ? undefined : statusFilter === 'active'
      }
      
      const response = await busOwnerAPI.getBusAdmins(params)
      if (response.success) {
        setBusAdmins(response.data.busAdmins)
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages
        }))
      } else {
        toast.error('Failed to fetch bus admins')
      }
    } catch (error) {
      console.error('Error fetching bus admins:', error)
      toast.error('Failed to fetch bus admins')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!editingAdmin && !formData.password.trim()) newErrors.password = 'Password is required'
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    // Phone validation
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    
    // Password validation (only for new admins)
    if (!editingAdmin && formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting')
      return
    }
    
    try {
      setLoading(true)
      let response
      
      if (editingAdmin) {
        // Update existing bus admin
        response = await busOwnerAPI.updateBusAdmin(editingAdmin.id, formData)
      } else {
        // Create new bus admin
        response = await busOwnerAPI.createBusAdmin(formData)
      }
      
      if (response.success) {
        setShowModal(false)
        setEditingAdmin(null)
        resetForm()
        fetchBusAdmins()
        toast.success(editingAdmin ? 'Bus admin updated successfully!' : 'Bus admin created successfully!')
      } else {
        toast.error(response.message || 'Failed to save bus admin')
      }
    } catch (error) {
      console.error('Error saving bus admin:', error)
      toast.error('Failed to save bus admin')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (admin) => {
    setEditingAdmin(admin)
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '',
      phone: admin.phone,
      position: admin.position || '',
      address: admin.address || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this bus admin? This action cannot be undone.')) {
      return
    }
    
    try {
      setLoading(true)
      const response = await busOwnerAPI.deleteBusAdmin(adminId)
      
      if (response.success) {
        fetchBusAdmins()
        toast.success('Bus admin deleted successfully!')
      } else {
        toast.error(response.message || 'Failed to delete bus admin')
      }
    } catch (error) {
      console.error('Error deleting bus admin:', error)
      toast.error('Failed to delete bus admin')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      position: '',
      address: ''
    })
    setErrors({})
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingAdmin(null)
    resetForm()
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  return (
    <div className="min-h-screen bg-hover-light">
      {/* Header */}
      <div className="bg-background shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <h1 className="text-heading-1">Bus Admin Management</h1>
              <p className="text-body-small mt-2">Manage bus administrators for your company</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Bus Admin</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="dashboard-card mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
                <input
                  type="text"
                  placeholder="Search bus admins..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="form-input pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleStatusFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'all' 
                    ? 'bg-primary text-white' 
                    : 'bg-hover-light text-secondary hover:bg-border'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleStatusFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'active' 
                    ? 'bg-primary text-white' 
                    : 'bg-hover-light text-secondary hover:bg-border'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => handleStatusFilter('inactive')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'inactive' 
                    ? 'bg-primary text-white' 
                    : 'bg-hover-light text-secondary hover:bg-border'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* Bus Admins List */}
        <div className="dashboard-card">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : busAdmins.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-secondary mx-auto mb-4" />
              <h3 className="text-heading-3 mb-2">No Bus Admins Found</h3>
              <p className="text-body-small text-secondary mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No bus admins match your current filters.' 
                  : 'You haven\'t created any bus admins yet.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-primary flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Bus Admin</span>
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-secondary">Name</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary">Phone</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary">Position</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-secondary">Created</th>
                      <th className="text-right py-3 px-4 font-medium text-secondary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {busAdmins.map((admin) => (
                      <tr key={admin._id} className="border-b border-border hover:bg-hover-light">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-primary/10 rounded-full p-2">
                              <Users className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-body-small">{admin.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-secondary" />
                            <span className="text-body-small">{admin.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-secondary" />
                            <span className="text-body-small">{admin.phone}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-body-small">{admin.position || 'N/A'}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            {admin.isActive ? (
                              <>
                                <UserCheck className="w-4 h-4 text-success" />
                                <span className="text-success text-sm font-medium">Active</span>
                              </>
                            ) : (
                              <>
                                <UserX className="w-4 h-4 text-error" />
                                <span className="text-error text-sm font-medium">Inactive</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-secondary" />
                            <span className="text-body-small">
                              {new Date(admin.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(admin)}
                              className="p-2 text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(admin._id)}
                              className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                  <div className="text-body-small text-secondary">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-3 py-2 text-sm font-medium text-secondary bg-hover-light rounded-lg hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                          page === pagination.page
                            ? 'bg-primary text-white'
                            : 'text-secondary bg-hover-light hover:bg-border'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="px-3 py-2 text-sm font-medium text-secondary bg-hover-light rounded-lg hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-heading-3">
                  {editingAdmin ? 'Edit Bus Admin' : 'Add Bus Admin'}
                </h2>
                <button
                  onClick={handleModalClose}
                  className="p-2 text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-input ${errors.name ? 'border-error' : ''}`}
                    placeholder="Enter full name"
                  />
                  {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'border-error' : ''}`}
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="form-label">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`form-input ${errors.phone ? 'border-error' : ''}`}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && <p className="text-error text-sm mt-1">{errors.phone}</p>}
                </div>

                {!editingAdmin && (
                  <div>
                    <label className="form-label">Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-input ${errors.password ? 'border-error' : ''}`}
                      placeholder="Enter password"
                    />
                    {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
                  </div>
                )}

                <div>
                  <label className="form-label">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter position/title"
                  />
                </div>

                <div>
                  <label className="form-label">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter address"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Saving...' : (editingAdmin ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BusAdminManagement
