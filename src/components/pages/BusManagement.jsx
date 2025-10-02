import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import { getNavigationMenu } from '../../config/routes'
import { showToast } from '../../utils/toast'
import { busAPI } from '../../services/api'
import { 
  Bus, 
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Fuel
} from 'lucide-react'

const BusManagement = () => {
  const { user } = useUser()
  const navigationItems = getNavigationMenu(user?.role)
  const [activeTab, setActiveTab] = useState('buses')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBus, setEditingBus] = useState(null)
  
  const [buses, setBuses] = useState([])
  const [busesLoading, setBusesLoading] = useState(true)
  const [ongoingRequests, setOngoingRequests] = useState(new Set())

  const [busForm, setBusForm] = useState({
    number: '',
    model: '',
    capacity: '',
    type: 'sleeper',
    fuelType: 'diesel',
    status: 'active',
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

  // Fetch buses data
  const fetchBusesData = async () => {
    try {
      setBusesLoading(true)
      const response = await preventDuplicateRequest('buses', () => busAPI.getAllBuses({ limit: 50 }))
      if (response && response.success) {
        setBuses(response.data.buses || [])
      }
    } catch (error) {
      console.error('Error fetching buses data:', error)
      showToast('Failed to load buses data', 'error')
    } finally {
      setBusesLoading(false)
    }
  }

  useEffect(() => {
    fetchBusesData()
  }, [])

  const handleBusInputChange = (e) => {
    const { name, value } = e.target
    setBusForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCreateBus = async (e) => {
    e.preventDefault()
    try {
      const response = await preventDuplicateRequest('create-bus', () => busAPI.createBus(busForm))
      if (response.success) {
        showToast('Bus created successfully', 'success')
        setShowAddModal(false)
        setBusForm({
          number: '',
          model: '',
          capacity: '',
          type: 'sleeper',
          fuelType: 'diesel',
          status: 'active',
          description: ''
        })
        fetchBusesData()
      }
    } catch (error) {
      console.error('Error creating bus:', error)
      showToast('Failed to create bus', 'error')
    }
  }

  const handleUpdateBus = async (e) => {
    e.preventDefault()
    try {
      const response = await preventDuplicateRequest('update-bus', () => busAPI.updateBus(editingBus.id, busForm))
      if (response.success) {
        showToast('Bus updated successfully', 'success')
        setEditingBus(null)
        setBusForm({
          number: '',
          model: '',
          capacity: '',
          type: 'sleeper',
          fuelType: 'diesel',
          status: 'active',
          description: ''
        })
        fetchBusesData()
      }
    } catch (error) {
      console.error('Error updating bus:', error)
      showToast('Failed to update bus', 'error')
    }
  }

  const handleDeleteBus = async (busId) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        const response = await busAPI.deleteBus(busId)
        if (response.success) {
          showToast('Bus deleted successfully', 'success')
          fetchBusesData()
        }
      } catch (error) {
        console.error('Error deleting bus:', error)
        showToast('Failed to delete bus', 'error')
      }
    }
  }

  const openEditBus = (bus) => {
    setEditingBus(bus)
    setBusForm({
      number: bus.number || bus.busNumber || '',
      model: bus.model || '',
      capacity: bus.capacity || bus.seats || '',
      type: bus.type || 'sleeper',
      fuelType: bus.fuelType || 'diesel',
      status: bus.status || 'active',
      description: bus.description || ''
    })
    setShowAddModal(true)
  }

  const closeModals = () => {
    setShowAddModal(false)
    setEditingBus(null)
    setBusForm({
      number: '',
      model: '',
      capacity: '',
      type: 'sleeper',
      fuelType: 'diesel',
      status: 'active',
      description: ''
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bus Management</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage your bus fleet and vehicle details
              </p>
            </div>
            
            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2">
              {navigationItems.map((item) => {
                // Extract the tab ID from the path
                const tabId = item.path.split('/').pop() || 'dashboard'
                return (
                  <button
                    key={item.path}
                    onClick={() => setActiveTab(tabId)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      activeTab === tabId
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Bus Fleet Management</h3>
            <button
              onClick={() => {
                setEditingBus(null)
                setShowAddModal(true)
              }}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Bus
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {busesLoading ? (
              <div className="col-span-3 text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading buses...</p>
              </div>
            ) : buses.length === 0 ? (
              <div className="col-span-3 text-center py-8">
                <Bus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No buses found</p>
                <p className="text-sm text-gray-500 mt-2">Add buses to your fleet</p>
              </div>
            ) : (
              buses.map((bus) => (
                <div key={bus._id || bus.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{bus.number || bus.busNumber}</h4>
                      <p className="text-sm text-gray-600">{bus.model || 'Model not specified'}</p>
                      <p className="text-sm text-gray-600">{bus.capacity || bus.seats || 'Capacity not specified'} seats</p>
                      <p className="text-sm text-gray-600">{bus.type || 'Type not specified'}</p>
                      <p className="text-sm text-gray-600">{bus.fuelType || 'Fuel type not specified'}</p>
                      {bus.description && (
                        <p className="text-sm text-gray-500 italic">{bus.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditBus(bus)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBus(bus._id || bus.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bus.status || 'active')}`}>
                      {bus.status || 'Active'}
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
                  {editingBus ? 'Edit Bus' : 'Add New Bus'}
                </h3>
                
                <form onSubmit={editingBus ? handleUpdateBus : handleCreateBus} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bus Number
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={busForm.number}
                      onChange={handleBusInputChange}
                      className="input-field"
                      required
                      placeholder="e.g., KA-01-AB-1234"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={busForm.model}
                      onChange={handleBusInputChange}
                      className="input-field"
                      required
                      placeholder="e.g., Volvo B9R"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity (Seats)
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={busForm.capacity}
                      onChange={handleBusInputChange}
                      className="input-field"
                      min="1"
                      required
                      placeholder="e.g., 40"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      name="type"
                      value={busForm.type}
                      onChange={handleBusInputChange}
                      className="input-field"
                    >
                      <option value="sleeper">Sleeper</option>
                      <option value="semi-sleeper">Semi Sleeper</option>
                      <option value="seater">Seater</option>
                      <option value="ac">AC</option>
                      <option value="non-ac">Non AC</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fuel Type
                    </label>
                    <select
                      name="fuelType"
                      value={busForm.fuelType}
                      onChange={handleBusInputChange}
                      className="input-field"
                    >
                      <option value="diesel">Diesel</option>
                      <option value="petrol">Petrol</option>
                      <option value="cng">CNG</option>
                      <option value="electric">Electric</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={busForm.status}
                      onChange={handleBusInputChange}
                      className="input-field"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <textarea
                      name="description"
                      value={busForm.description}
                      onChange={handleBusInputChange}
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
                      {editingBus ? 'Update' : 'Add'} Bus
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

export default BusManagement
