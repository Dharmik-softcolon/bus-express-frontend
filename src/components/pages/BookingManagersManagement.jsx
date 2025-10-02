import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
import { showToast } from '../../utils/toast'
import { bookingManagerAPI } from '../../services/api'
import { 
  Users, 
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CreditCard,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Star,
  TrendingUp,
  Activity
} from 'lucide-react'

const BookingManagersManagement = () => {
  const { user } = useUser()
  const navigationItems = getNavigationMenu(user?.role)
  
  // State management
  const [activeTab, setActiveTab] = useState('booking-managers')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBookingManager, setEditingBookingManager] = useState(null)
  const [bookingManagers, setBookingManagers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [ongoingRequests, setOngoingRequests] = useState(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('latest')
  
  // Form validation states
  const [formErrors, setFormErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  // Form data
  const [bookingManagerForm, setBookingManagerForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    position: '',
    commission: '',
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
          const result = await apiCall()
        setOngoingRequests(prev => {
          const newSet = new Set(prev)
          newSet.delete(requestKey)
          return newSet
        })
          return result
      }
        } catch (error) {
      if (maxRetries > 1) {
        await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt)))
      }
    } finally {
      setOngoingRequests(prev => {
        const newSet = new Set(prev)
        newSet.delete(requestKey)
        return newSet
      })
    }
  }

  // Load booking managers
  useEffect(() => {
    fetchBookingManagers()
  }, [])

  const fetchBookingManagers = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await preventDuplicateRequest('fetch_booking_managers',
        () => bookingManagerAPI.getAllBookingManagers()
      )

      
      if (response) {
        // Try different possible response structures
        let managerData = []
        
        if (response.data?.users) {
          managerData = response.data.users
        } else if (response.data?.bookingManagers) {
          managerData = response.data.bookingManagers
        } else if (response.data && Array.isArray(response.data)) {
          managerData = response.data
        } else if (response.users) {
          managerData = response.users
        } else if (response.bookingManagers) {
          managerData = response.bookingManagers
        } else if (Array.isArray(response)) {
          managerData = response
        }
        
        setBookingManagers(Array.isArray(managerData) ? managerData : [])
      } else {
        setBookingManagers([])
      }
    } catch (error) {
      console.error('Error fetching booking managers:', error)
      setError('Failed to load booking managers')
      setBookingManagers([]) // Ensure it's always an array
      showToast.error('Failed to load booking managers')
    } finally {
      setLoading(false)
    }
  }

  // Form validation
  const validateForm = () => {
    const errors = {}

    if (!bookingManagerForm.name.trim()) {
      errors.name = 'Name is required'
    } else if (bookingManagerForm.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
    }

    if (!bookingManagerForm.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(bookingManagerForm.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!bookingManagerForm.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(bookingManagerForm.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number'
    }

    if (!bookingManagerForm.position.trim()) {
      errors.position = 'Position is required'
    }

    // Password validation - required only for new managers or when updating password
    if (!editingBookingManager) {
      if (!bookingManagerForm.password.trim()) {
        errors.password = 'Password is required'
      } else if (bookingManagerForm.password.length < 6) {
        errors.password = 'Password must be at least 6 characters'
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(bookingManagerForm.password)) {
        errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }
    } else if (bookingManagerForm.password.trim() && bookingManagerForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    } else if (bookingManagerForm.password.trim() && !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(bookingManagerForm.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }

    if (!bookingManagerForm.commission.trim()) {
      errors.commission = 'Commission is required'
    } else if (isNaN(bookingManagerForm.commission) || parseFloat(bookingManagerForm.commission) < 0 || parseFloat(bookingManagerForm.commission) > 100) {
      errors.commission = 'Commission must be between 0 and 100'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form input changes
  const handleBookingManagerInputChange = (e) => {
    const { name, value } = e.target
    setBookingManagerForm(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear form errors when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Create booking manager
  const handleCreateBookingManager = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showToast.error('Please fix the form errors before submitting')
      return
    }

    setIsSubmitting(true)

    try {
      const managerData = {
        name: bookingManagerForm.name,
        email: bookingManagerForm.email,
        phone: bookingManagerForm.phone,
        password: bookingManagerForm.password || 'Manager123', // Default if not provided
        position: bookingManagerForm.position,
        address: bookingManagerForm.address,
        commission: parseFloat(bookingManagerForm.commission),
        status: bookingManagerForm.status === 'active'
      }

      const response = await preventDuplicateRequest('create_booking_manager',
        () => bookingManagerAPI.createBookingManager(managerData)
      )


      if (response && (response.success || response.data || response.message)) {
        showToast.success('Booking manager created successfully')
        closeModals()
        fetchBookingManagers() // Refresh the list
      } else {
        console.log('Create booking manager failed:', response)
        showToast.error(response?.message || 'Failed to create booking manager')
      }
    } catch (error) {
      console.error('Error creating booking manager:', error)
      showToast.error(error.message || 'Failed to create booking manager')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update booking manager
  const handleUpdateBookingManager = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      showToast.error('Please fix the form errors before submitting')
      return
    }

    if (!editingBookingManager) return

    setIsSubmitting(true)

    try {
      const managerId = editingBookingManager._id || editingBookingManager.id
      const updateData = {
        name: bookingManagerForm.name,
        email: bookingManagerForm.email,
        phone: bookingManagerForm.phone,
        address: bookingManagerForm.address,
        position: bookingManagerForm.position,
        commission: parseFloat(bookingManagerForm.commission),
        isActive: bookingManagerForm.status === 'active'
      }

      // Only include password if provided (for updating)
      if (bookingManagerForm.password.trim()) {
        updateData.password = bookingManagerForm.password
      }

      const response = await preventDuplicateRequest(`update_booking_manager_${managerId}`,
        () => bookingManagerAPI.updateBookingManager(managerId, updateData)
      )


      if (response && (response.success || response.data || response.message)) {
        showToast.success('Booking manager updated successfully')
        closeModals()
        fetchBookingManagers() // Refresh the list
      } else {
        console.log('Update booking manager failed:', response)
        showToast.error(response?.message || 'Failed to update booking manager')
      }
    } catch (error) {
      console.error('Error updating booking manager:', error)
      showToast.error(error.message || 'Failed to update booking manager')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Delete booking manager
  const handleDeleteBookingManager = async (managerId) => {
    if (window.confirm('Are you sure you want to delete this booking manager?')) {
      try {
        const response = await preventDuplicateRequest(`delete_booking_manager_${managerId}`,
          () => bookingManagerAPI.deleteBookingManager(managerId)
        )


        if (response && (response.success || response.data || response.message)) {
          showToast.success('Booking manager deleted successfully')
          fetchBookingManagers() // Refresh the list
        } else {
          console.log('Delete booking manager failed:', response)
          showToast.error(response?.message || 'Failed to delete booking manager')
        }
      } catch (error) {
        console.error('Error deleting booking manager:', error)
        showToast.error(error.message || 'Failed to delete booking manager')
      }
    }
  }

  // Open edit modal
  const openEditBookingManager = (manager) => {
    setEditingBookingManager(manager)
    setBookingManagerForm({
      name: manager.name || '',
      email: manager.email || '',
      phone: manager.phone || '',
      address: manager.address || '',
      position: manager.position || '',
      commission: manager.commission?.toString() || '',
      password: '', // Don't show existing password for security
      status: manager.isActive ? 'active' : 'inactive'
    })
    setShowAddModal(true)
  }

  // Close modals and reset form
  const closeModals = () => {
    setShowAddModal(false)
    setEditingBookingManager(null)
    setBookingManagerForm({
      name: '',
      email: '',
      phone: '',
      password: '',
      address: '',
      position: '',
      commission: '',
      status: 'active'
    })
    setFormErrors({})
    setIsSubmitting(false)
  }

  // Filter and sort booking managers
  const filteredAndSortedBookingManagers = () => {
    if (!Array.isArray(bookingManagers)) {
      return []
    }
    
    let filtered = bookingManagers.filter(manager => {
      const nameMatch = manager.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
      const emailMatch = manager.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false
      const positionMatch = manager.position?.toLowerCase().includes(searchTerm.toLowerCase()) || false
      
      const matchesSearch = searchTerm === '' || nameMatch || emailMatch || positionMatch
      
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'active' && (manager.isActive === true)) ||
                           (filterStatus === 'inactive' && (manager.isActive === false))
      
      return matchesSearch && matchesStatus
    })

    // Sort booking managers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'commission':
          return (b.commission || 0) - (a.commission || 0)
        case 'latest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        default:
          return 0
      }
    })

    return filtered
  }

  // Get status badge styling
  const getStatusBadgeClass = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200'
  }

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="card animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-24"></div>
              </div>
            </div>
            <div className="h-8 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
            <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">
                    Booking Manager Management
                  </h1>
                  <p className="text-gray-600">
                    Manage booking managers, commission rates, and performance
              </p>
            </div>
          </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={fetchBookingManagers}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
            <button
              onClick={() => {
                    setEditingBookingManager(null)
                    setBookingManagerForm({
                      name: '',
                      email: '',
                      phone: '',
                      password: '',
                      address: '',
                      position: '',
                      commission: '',
                      status: 'active'
                    })
                    setFormErrors({})
                setShowAddModal(true)
              }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Booking Manager
            </button>
          </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or position..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="md:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">By Name</option>
                <option value="commission">By Commission</option>
              </select>
            </div>
          </div>
        </div>


        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Managers</p>
                <p className="text-2xl font-bold text-gray-900">{Array.isArray(bookingManagers) ? bookingManagers.length : 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Managers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(bookingManagers) ? bookingManagers.filter(m => m.isActive).length : 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Commission</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(bookingManagers) && bookingManagers.length > 0 
                    ? (bookingManagers.reduce((sum, m) => sum + (m.commission || 0), 0) / bookingManagers.length).toFixed(1)
                    : 0
                  }%
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Performance</p>
                <p className="text-2xl font-bold text-gray-900">4.8/5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Managers List */}
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Booking Managers</h2>
              {(searchTerm || filterStatus !== 'all') && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {filteredAndSortedBookingManagers().length} result{(filteredAndSortedBookingManagers().length !== 1 ? 's' : '')} found
                </span>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="p-6">
              <div className="animate-pulse text-center py-8">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mr-3"></div>
                  <span className="text-gray-600">Loading booking managers...</span>
                </div>
              </div>
            </div>
          ) : filteredAndSortedBookingManagers().length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No booking managers found</h3>
              <p className="text-gray-600 mb-6">{searchTerm || filterStatus !== 'all' ? 'Try adjusting your search or filters.' : 'Get started by adding your first booking manager.'}</p>
              {!searchTerm && filterStatus === 'all' && (
                <button
                  onClick={() => {
                    setEditingBookingManager(null)
                    setBookingManagerForm({
                      name: '',
                      email: '',
                      phone: '',
                      password: '',
                      address: '',
                      position: '',
                      commission: '',
                      status: 'active'
                    })
                    setFormErrors({})
                    setShowAddModal(true)
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Add Booking Manager
                </button>
              )}
              </div>
            ) : (
            <div className="divide-y divide-gray-200">
              {filteredAndSortedBookingManagers().map((manager) => (
                <div key={manager._id || manager.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{manager.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(manager.isActive)}`}>
                            {manager.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            {manager.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {manager.phone}
                          </div>
                          <div className="flex items-center">
                            <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                            {manager.commission || 0}% Commission
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Position:</span> {manager.position || 'Not specified'}
                          {manager.address && (
                            <>
                              <span className="ml-4">
                                <MapPin className="h-4 w-4 inline mr-1 text-gray-400" />
                                {manager.address}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => openEditBookingManager(manager)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Edit booking manager"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBookingManager(manager._id || manager.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete booking manager"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingBookingManager ? 'Edit Booking Manager' : 'Add New Booking Manager'}
                </h2>
              </div>
              
              <form onSubmit={editingBookingManager ? handleUpdateBookingManager : handleCreateBookingManager}>
                <div className="px-6 py-6 space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={bookingManagerForm.name}
                      onChange={handleBookingManagerInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter full name"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={bookingManagerForm.email}
                      onChange={handleBookingManagerInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter email address"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingManagerForm.phone}
                      onChange={handleBookingManagerInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        formErrors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter phone number"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password {!editingBookingManager && <span className="text-red-500">*</span>}
                      {editingBookingManager && <span className="text-gray-500">(Leave blank to keep current password)</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={bookingManagerForm.password}
                        onChange={handleBookingManagerInputChange}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                          formErrors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder={editingBookingManager ? "Enter new password or leave blank" : "Enter password"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                    )}
                    {!editingBookingManager && (
                      <p className="mt-1 text-xs text-gray-500">
                        Password must contain at least 6 characters with uppercase, lowercase, and number
                      </p>
                    )}
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={bookingManagerForm.position}
                      onChange={handleBookingManagerInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        formErrors.position ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter position/designation"
                    />
                    {formErrors.position && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.position}</p>
                    )}
                  </div>

                  {/* Commission */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Rate (%) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="commission"
                      value={bookingManagerForm.commission}
                      onChange={handleBookingManagerInputChange}
                      min="0"
                      max="100"
                      step="0.1"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        formErrors.commission ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter commission percentage (0-100)"
                    />
                    {formErrors.commission && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.commission}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Enter the commission percentage this booking manager will earn on bookings
                    </p>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={bookingManagerForm.address}
                      onChange={handleBookingManagerInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter address"
                    />
                  </div>

                  {/* Status (only show for editing) */}
                  {editingBookingManager && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="status"
                        value={bookingManagerForm.status}
                        onChange={handleBookingManagerInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  )}
                  </div>

                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeModals}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingBookingManager ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editingBookingManager ? 'Update Manager' : 'Create Manager'
                    )}
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

export default BookingManagersManagement