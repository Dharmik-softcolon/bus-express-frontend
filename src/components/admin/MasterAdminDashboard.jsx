import { useState, useEffect, useCallback } from 'react'
import { Users, Bus, Building, Plus, Edit, Trash2, Search, Filter, Loader2 } from 'lucide-react'
import { authAPI } from '../../services/api'

const MasterAdminDashboard = () => {
  console.log('MasterAdminDashboard component rendering...')
  
  const [activeTab, setActiveTab] = useState('owners')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingOwner, setEditingOwner] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  const [busOwners, setBusOwners] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company: '',
    position: '',
    address: '',
    aadhaarCard: ''
  })

  // Load bus owners on component mount and when filters change
  useEffect(() => {
    loadBusOwners()
  }, [loadBusOwners])

  const loadBusOwners = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Prepare query parameters
      const params = {}
      if (searchTerm) params.search = searchTerm
      if (statusFilter !== 'all') params.isActive = statusFilter === 'active'
      
      const response = await authAPI.getAllBusOwners(params)
      setBusOwners(response.data?.busOwners || [])
    } catch (err) {
      setError(err.message || 'Failed to load bus owners')
      console.error('Error loading bus owners:', err)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, statusFilter])

  // Sort bus owners (filtering is now done by API)
  const sortedBusOwners = busOwners
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '')
        case 'company':
          return (a.company || '').localeCompare(b.company || '')
        case 'status':
          return (a.isActive ? 'active' : 'inactive').localeCompare(b.isActive ? 'active' : 'inactive')
        case 'joinDate':
          return new Date(b.createdAt) - new Date(a.createdAt)
        default:
          return 0
      }
    })


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      
      if (editingOwner) {
        await authAPI.updateBusOwner(editingOwner._id, formData)
      } else {
        await authAPI.createBusOwner(formData)
      }
      
      await loadBusOwners() // Reload the list
      setShowAddModal(false)
      setEditingOwner(null)
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        company: '',
        position: '',
        address: '',
        aadhaarCard: ''
      })
    } catch (err) {
      setError(err.message || 'Failed to save bus owner')
      console.error('Error saving bus owner:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (owner) => {
    setEditingOwner(owner)
    setFormData({
      name: owner.name || '',
      email: owner.email || '',
      password: '',
      phone: owner.phone || '',
      company: owner.company || '',
      position: owner.position || '',
      address: owner.address || '',
      aadhaarCard: owner.aadhaarCard || ''
    })
    setShowAddModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bus owner?')) {
      try {
        setLoading(true)
        setError(null)
        await authAPI.deleteBusOwner(id)
        await loadBusOwners() // Reload the list
      } catch (err) {
        setError(err.message || 'Failed to delete bus owner')
        console.error('Error deleting bus owner:', err)
      } finally {
        setLoading(false)
      }
    }
  }

  const toggleOwnerStatus = async (id) => {
    try {
      setLoading(true)
      setError(null)
      await authAPI.toggleBusOwnerStatus(id)
      await loadBusOwners() // Reload the list
    } catch (err) {
      setError(err.message || 'Failed to update bus owner status')
      console.error('Error updating bus owner status:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }


  const renderBusOwners = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading bus owners...</span>
        </div>
      )
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={loadBusOwners}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )
    }

    if (sortedBusOwners.length === 0) {
      return (
        <div className="text-center py-8">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No bus owners found</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {sortedBusOwners.map((owner) => (
          <div key={owner._id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{owner.name}</h3>
                <p className="text-gray-600">Company: {owner.company || 'N/A'}</p>
                <p className="text-gray-600">{owner.email}</p>
                <p className="text-gray-600">{owner.phone}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(owner.isActive)}`}>
                  {owner.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleOwnerStatus(owner._id)}
                  className={`px-3 py-1 rounded text-sm ${
                    owner.isActive 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {owner.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEdit(owner)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(owner._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600">Position</div>
                <div className="font-medium">{owner.position || 'N/A'}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Join Date</div>
                <div className="font-medium">{new Date(owner.createdAt).toLocaleDateString()}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Address</div>
                <div className="font-medium">{owner.address || 'N/A'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Debug Info */}
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p>Debug: MasterAdminDashboard is rendering</p>
          <p>Loading: {loading ? 'true' : 'false'}</p>
          <p>Error: {error || 'none'}</p>
          <p>Bus Owners Count: {busOwners.length}</p>
        </div>
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bus Owner Management
              </h1>
              <p className="text-gray-600">
                Create, update, and manage bus owner accounts
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Bus Owner
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {[
              { id: 'owners', name: 'Bus Owners Management' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>


        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Filter & Search</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Search className="h-4 w-4 inline mr-1" />
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by company, owner, email, or phone..."
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="name">Name</option>
                <option value="company">Company</option>
                <option value="status">Status</option>
                <option value="joinDate">Join Date</option>
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {sortedBusOwners.length} of {busOwners.length} bus owners
          </div>
        </div>

        {/* Content */}
        {activeTab === 'owners' && renderBusOwners()}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingOwner ? 'Edit Bus Owner' : 'Add New Bus Owner'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  {!editingOwner && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="input-field"
                        required={!editingOwner}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aadhaar Card
                    </label>
                    <input
                      type="text"
                      name="aadhaarCard"
                      value={formData.aadhaarCard}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="XXXX-XXXX-XXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="input-field"
                      rows="3"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false)
                        setEditingOwner(null)
                        setFormData({
                          name: '',
                          email: '',
                          password: '',
                          phone: '',
                          company: '',
                          position: '',
                          address: '',
                          aadhaarCard: ''
                        })
                      }}
                      className="btn-secondary"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {editingOwner ? 'Updating...' : 'Adding...'}
                        </>
                      ) : (
                        `${editingOwner ? 'Update' : 'Add'} Bus Owner`
                      )}
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

export default MasterAdminDashboard
