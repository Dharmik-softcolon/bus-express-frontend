import { useState } from 'react'
import { Users, Bus, Building, Plus, Edit, Trash2, Search, Filter } from 'lucide-react'

const MasterAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('owners')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingOwner, setEditingOwner] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  const [busOwners, setBusOwners] = useState([
    {
      id: 1,
      name: 'ABC Transport Company',
      owner: 'John Smith',
      email: 'john@abctransport.com',
      phone: '+1-555-1001',
      totalBuses: 15,
      activeBuses: 12,
      totalRoutes: 8,
      monthlyRevenue: 45000,
      status: 'active',
      joinDate: '2023-01-15',
      commission: 8.5
    },
    {
      id: 2,
      name: 'City Express Lines',
      owner: 'Sarah Johnson',
      email: 'sarah@cityexpress.com',
      phone: '+1-555-1002',
      totalBuses: 22,
      activeBuses: 18,
      totalRoutes: 12,
      monthlyRevenue: 68000,
      status: 'active',
      joinDate: '2023-03-20',
      commission: 7.5
    },
    {
      id: 3,
      name: 'Metro Bus Services',
      owner: 'Mike Wilson',
      email: 'mike@metrobus.com',
      phone: '+1-555-1003',
      totalBuses: 8,
      activeBuses: 5,
      totalRoutes: 4,
      monthlyRevenue: 22000,
      status: 'suspended',
      joinDate: '2023-06-10',
      commission: 9.0
    }
  ])

  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    email: '',
    phone: '',
    commission: '',
    status: 'active'
  })

  // Filter and sort bus owners
  const filteredBusOwners = busOwners
    .filter(owner => {
      const matchesSearch = owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           owner.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           owner.phone.includes(searchTerm)
      const matchesStatus = statusFilter === 'all' || owner.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'revenue':
          return b.monthlyRevenue - a.monthlyRevenue
        case 'buses':
          return b.totalBuses - a.totalBuses
        case 'status':
          return a.status.localeCompare(b.status)
        case 'joinDate':
          return new Date(b.joinDate) - new Date(a.joinDate)
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingOwner) {
      setBusOwners(prev => prev.map(owner => 
        owner.id === editingOwner.id ? { ...owner, ...formData } : owner
      ))
    } else {
      const newOwner = {
        ...formData,
        id: busOwners.length + 1,
        totalBuses: 0,
        activeBuses: 0,
        totalRoutes: 0,
        monthlyRevenue: 0,
        joinDate: new Date().toISOString().split('T')[0]
      }
      setBusOwners(prev => [...prev, newOwner])
    }
    setShowAddModal(false)
    setEditingOwner(null)
    setFormData({
      name: '',
      owner: '',
      email: '',
      phone: '',
      commission: '',
      status: 'active'
    })
  }

  const handleEdit = (owner) => {
    setEditingOwner(owner)
    setFormData(owner)
    setShowAddModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this bus owner?')) {
      setBusOwners(prev => prev.filter(owner => owner.id !== id))
    }
  }

  const toggleOwnerStatus = (id) => {
    setBusOwners(prev => prev.map(owner => 
      owner.id === id 
        ? { ...owner, status: owner.status === 'active' ? 'suspended' : 'active' }
        : owner
    ))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }


  const renderBusOwners = () => (
    <div className="space-y-4">
      {filteredBusOwners.map((owner) => (
        <div key={owner.id} className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{owner.name}</h3>
              <p className="text-gray-600">Owner: {owner.owner}</p>
              <p className="text-gray-600">{owner.email}</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(owner.status)}`}>
                {owner.status}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleOwnerStatus(owner.id)}
                className={`px-3 py-1 rounded text-sm ${
                  owner.status === 'active' 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {owner.status === 'active' ? 'Suspend' : 'Activate'}
              </button>
              <button
                onClick={() => handleEdit(owner)}
                className="text-blue-600 hover:text-blue-900"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(owner.id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{owner.totalBuses}</div>
              <div className="text-sm text-gray-600">Total Buses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{owner.activeBuses}</div>
              <div className="text-sm text-gray-600">Active Buses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{owner.totalRoutes}</div>
              <div className="text-sm text-gray-600">Routes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">${owner.monthlyRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Monthly Revenue</div>
            </div>
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
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="name">Company Name</option>
                <option value="revenue">Monthly Revenue</option>
                <option value="buses">Total Buses</option>
                <option value="status">Status</option>
                <option value="joinDate">Join Date</option>
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredBusOwners.length} of {busOwners.length} bus owners
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
                      Company Name
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
                      Owner Name
                    </label>
                    <input
                      type="text"
                      name="owner"
                      value={formData.owner}
                      onChange={handleInputChange}
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
                      value={formData.email}
                      onChange={handleInputChange}
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
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Commission (%)
                    </label>
                    <input
                      type="number"
                      name="commission"
                      value={formData.commission}
                      onChange={handleInputChange}
                      className="input-field"
                      step="0.1"
                      min="0"
                      max="100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false)
                        setEditingOwner(null)
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      {editingOwner ? 'Update' : 'Add'} Bus Owner
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
