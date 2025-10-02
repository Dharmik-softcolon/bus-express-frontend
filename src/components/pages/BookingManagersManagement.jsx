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
  CreditCard
} from 'lucide-react'

const BookingManagersManagement = () => {
  const { user } = useUser()
  const navigationItems = getNavigationMenu(user?.role)
  const [activeTab, setActiveTab] = useState('booking-men')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBookingMan, setEditingBookingMan] = useState(null)
  
  const [bookingManagers, setBookingManagers] = useState([])
  const [loading, setLoading] = useState(true)
  const [ongoingRequests, setOngoingRequests] = useState(new Set())

  const [bookingManForm, setBookingManForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    location: '',
    status: 'active',
    commissionRate: '',
    description: ''
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

  // Fetch booking managers data
  const fetchBookingManagersData = async () => {
    try {
      setLoading(true)
      const response = await preventDuplicateRequest('booking-managers', () => bookingManagerAPI.getBookingManagers({ limit: 50 }))
      if (response && response.success) {
        setBookingManagers(response.data.bookingManagers || [])
      }
    } catch (error) {
      console.error('Error fetching booking managers data:', error)
      showToast('Failed to load booking managers data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookingManagersData()
  }, [])

  const handleBookingManInputChange = (e) => {
    const { name, value } = e.target
    setBookingManForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCreateBookingManager = async (e) => {
    e.preventDefault()
    try {
      const response = await preventDuplicateRequest('create-booking-manager', () => bookingManagerAPI.createBookingManager(bookingManForm))
      if (response.success) {
        showToast('Booking Manager created successfully', 'success')
        setShowAddModal(false)
        setBookingManForm({
          name: '',
          email: '',
          phone: '',
          address: '',
          location: '',
          status: 'active',
          commissionRate: '',
          description: ''
        })
        fetchBookingManagersData()
      }
    } catch (error) {
      console.error('Error creating booking manager:', error)
      showToast('Failed to create booking manager', 'error')
    }
  }

  const handleUpdateBookingManager = async (e) => {
    e.preventDefault()
    try {
      const response = await preventDuplicateRequest('update-booking-manager', () => bookingManagerAPI.updateBookingManager(editingBookingMan.id, bookingManForm))
      if (response.success) {
        showToast('Booking Manager updated successfully', 'success')
        setEditingBookingMan(null)
        setBookingManForm({
          name: '',
          email: '',
          phone: '',
          address: '',
          location: '',
          status: 'active',
          commissionRate: '',
          description: ''
        })
        fetchBookingManagersData()
      }
    } catch (error) {
      console.error('Error updating booking manager:', error)
      showToast('Failed to update booking manager', 'error')
    }
  }

  const handleDeleteBookingManager = async (bookingManagerId) => {
    if (window.confirm('Are you sure you want to delete this booking manager?')) {
      try {
        const response = await bookingManagerAPI.removeBookingManager(bookingManagerId)
        if (response.success) {
          showToast('Booking Manager deleted successfully', 'success')
          fetchBookingManagersData()
        }
      } catch (error) {
        console.error('Error deleting booking manager:', error)
        showToast('Failed to delete booking manager', 'error')
      }
    }
  }

  const openEditBookingManager = (bookingManager) => {
    setEditingBookingMan(bookingManager)
    setBookingManForm({
      name: bookingManager.name || '',
      email: bookingManager.email || '',
      phone: bookingManager.phone || '',
      address: bookingManager.address || '',
      location: bookingManager.location || '',
      status: bookingManager.status || 'active',
      commissionRate: bookingManager.commissionRate || '',
      description: bookingManager.description || ''
    })
    setShowAddModal(true)
  }

  const closeModals = () => {
    setShowAddModal(false)
    setEditingBookingMan(null)
    setBookingManForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      location: '',
      status: 'active',
      commissionRate: '',
      description: ''
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Booking Managers Management</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage booking managers and their details
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Booking Managers</h3>
            <button
              onClick={() => {
                setEditingBookingMan(null)
                setShowAddModal(true)
              }}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Booking Manager
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-3 text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading booking managers...</p>
              </div>
            ) : bookingManagers.length === 0 ? (
              <div className="col-span-3 text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No booking managers found</p>
                <p className="text-sm text-gray-500 mt-2">Add booking managers to handle customer bookings</p>
              </div>
            ) : (
              bookingManagers.map((bookingManager) => (
                <div key={bookingManager._id || bookingManager.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{bookingManager.name}</h4>
                      <p className="text-sm text-gray-600">{bookingManager.email}</p>
                      <p className="text-sm text-gray-600">{bookingManager.phone}</p>
                      <p className="text-sm text-gray-600">{bookingManager.location || bookingManager.address}</p>
                      {bookingManager.commissionRate && (
                        <p className="text-sm text-gray-600">Commission: {bookingManager.commissionRate}%</p>
                      )}
                      {bookingManager.description && (
                        <p className="text-sm text-gray-500 italic">{bookingManager.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditBookingManager(bookingManager)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBookingManager(bookingManager._id || bookingManager.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bookingManager.status || 'active')}`}>
                      {bookingManager.status || 'Active'}
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
                  {editingBookingMan ? 'Edit Booking Manager' : 'Add Booking Manager'}
                </h3>
                
                <form onSubmit={editingBookingMan ? handleUpdateBookingManager : handleCreateBookingManager} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={bookingManForm.name}
                      onChange={handleBookingManInputChange}
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
                      value={bookingManForm.email}
                      onChange={handleBookingManInputChange}
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
                      value={bookingManForm.phone}
                      onChange={handleBookingManInputChange}
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
                      value={bookingManForm.address}
                      onChange={handleBookingManInputChange}
                      className="input-field"
                      rows="2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={bookingManForm.location}
                      onChange={handleBookingManInputChange}
                      className="input-field"
                      placeholder="e.g., Mumbai Central"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Commission Rate (%)
                    </label>
                    <input
                      type="number"
                      name="commissionRate"
                      value={bookingManForm.commissionRate}
                      onChange={handleBookingManInputChange}
                      className="input-field"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="e.g., 5.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={bookingManForm.status}
                      onChange={handleBookingManInputChange}
                      className="input-field"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      name="description"
                      value={bookingManForm.description}
                      onChange={handleBookingManInputChange}
                      className="input-field"
                      rows="2"
                      placeholder="Additional details..."
                    />
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
                      {editingBookingMan ? 'Update' : 'Add'} Booking Manager
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

export default BookingManagersManagement
