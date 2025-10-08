import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Calendar, CreditCard, Car, Edit, Save, X, Plus, Trash2 } from 'lucide-react'
import { authAPI } from '../../services/api'
import { formatAadhaarCard } from '../../utils/formatters'

const UserProfileManagement = () => {
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)
  
  // Load users on component mount
  useEffect(() => {
    loadUsers()
  }, [])
  
  const loadUsers = async () => {
    setError(null)
    
    try {
      const response = await authAPI.getAllUsers()
      if (response.success) {
        setUsers(response.data.users || [])
          } else {
            setError('Failed to load users')
            setUsers([])
          }
    } catch (error) {
      console.error('Error loading users:', error)
      setError('Failed to load users')
      setUsers([])
    }
  }
  
  // User CRUD operations
  const handleUpdateUser = async (userId, userData) => {
    try {
      const response = await authAPI.updateUserById(userId, userData)
      if (response.success) {
        await loadUsers() // Reload users
        return { success: true }
      } else {
        return { success: false, error: response.message || 'Failed to update user' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to update user' }
    }
  }
  
  const handleDeleteUser = async (userId) => {
    try {
      const response = await authAPI.deleteUser(userId)
      if (response.success) {
        await loadUsers() // Reload users
        return { success: true }
      } else {
        return { success: false, error: response.message || 'Failed to delete user' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to delete user' }
    }
  }

  const [editingUser, setEditingUser] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  const roles = [
    { value: 'MASTER_ADMIN', label: 'Master Admin' },
    { value: 'BUS_OWNER', label: 'Bus Owner' },
    { value: 'BUS_ADMIN', label: 'Bus Admin' },
    { value: 'BOOKING_MAN', label: 'Booking Man' },
    { value: 'BUS_EMPLOYEE', label: 'Bus Employee' },
    { value: 'customer', label: 'Customer' }
  ]

  const positions = [
    'Master Administrator',
    'Owner',
    'Bus Administrator',
    'Booking Manager',
    'Driver',
    'Conductor',
    'Helper',
    'Mechanic',
    'Customer'
  ]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm) ||
                         user.aadhaarCard.includes(searchTerm)
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleEdit = (user) => {
    setEditingUser({ ...user })
  }

  const handleSave = () => {
    setUsers(users.map(user => 
      user.id === editingUser.id ? editingUser : user
    ))
    setEditingUser(null)
  }

  const handleCancel = () => {
    setEditingUser(null)
  }

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const handleAddUser = (newUser) => {
    const user = {
      ...newUser,
      id: Math.max(...users.map(u => u.id)) + 1
    }
    setUsers([...users, user])
    setShowAddForm(false)
  }

  const getRoleColor = (role) => {
    const colors = {
      'MASTER_ADMIN': 'bg-red-100 text-red-800',
      'BUS_OWNER': 'bg-blue-100 text-blue-800',
      'BUS_ADMIN': 'bg-green-100 text-green-800',
      'BOOKING_MAN': 'bg-purple-100 text-purple-800',
      'BUS_EMPLOYEE': 'bg-orange-100 text-orange-800',
      'customer': 'bg-gray-100 text-gray-800'
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Profile Management</h1>
          <p className="text-gray-600">Manage user profiles with Aadhaar and driving license details</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone, or Aadhaar..."
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role Filter</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aadhaar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driving License</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.position}</div>
                        <div className="text-sm text-gray-500">{user.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                    <div className="text-sm text-gray-500">{user.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {roles.find(r => r.value === user.role)?.label || user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{user.aadhaarCard}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.drivingLicense ? (
                      <div>
                        <div className="flex items-center">
                          <Car className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">{user.drivingLicense}</span>
                        </div>
                        {user.licenseExpiry && (
                          <div className="text-sm text-gray-500">Expires: {user.licenseExpiry}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Not applicable</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
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
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Edit User Profile</h2>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                    className="input-field"
                  >
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <select
                    value={editingUser.position}
                    onChange={(e) => setEditingUser({...editingUser, position: e.target.value})}
                    className="input-field"
                  >
                    {positions.map(position => (
                      <option key={position} value={position}>{position}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={editingUser.company || ''}
                    onChange={(e) => setEditingUser({...editingUser, company: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Card</label>
                  <input
                    type="text"
                    value={editingUser.aadhaarCard}
                    onChange={(e) => setEditingUser({...editingUser, aadhaarCard: formatAadhaarCard(e.target.value)})}
                    className="input-field"
                    placeholder="1234-5678-9012"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Driving License</label>
                  <input
                    type="text"
                    value={editingUser.drivingLicense || ''}
                    onChange={(e) => setEditingUser({...editingUser, drivingLicense: e.target.value})}
                    className="input-field"
                    placeholder="DL-1234567890123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry</label>
                  <input
                    type="date"
                    value={editingUser.licenseExpiry || ''}
                    onChange={(e) => setEditingUser({...editingUser, licenseExpiry: e.target.value})}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <input
                    type="text"
                    value={editingUser.experience || ''}
                    onChange={(e) => setEditingUser({...editingUser, experience: e.target.value})}
                    className="input-field"
                    placeholder="e.g., 5 years"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={editingUser.address}
                    onChange={(e) => setEditingUser({...editingUser, address: e.target.value})}
                    className="input-field"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSave} className="btn-primary">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add New User</h2>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <AddUserForm onAdd={handleAddUser} onCancel={() => setShowAddForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

const AddUserForm = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    position: 'Customer',
    company: '',
    aadhaarCard: '',
    drivingLicense: '',
    licenseExpiry: '',
    experience: '',
    address: '',
    joinDate: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd(formData)
  }

  const roles = [
    { value: 'MASTER_ADMIN', label: 'Master Admin' },
    { value: 'BUS_OWNER', label: 'Bus Owner' },
    { value: 'BUS_ADMIN', label: 'Bus Admin' },
    { value: 'BOOKING_MAN', label: 'Booking Man' },
    { value: 'BUS_EMPLOYEE', label: 'Bus Employee' },
    { value: 'customer', label: 'Customer' }
  ]

  const positions = [
    'Master Administrator',
    'Owner',
    'Bus Administrator',
    'Booking Manager',
    'Driver',
    'Conductor',
    'Helper',
    'Mechanic',
    'Customer'
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
          <select
            required
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="input-field"
          >
            {roles.map(role => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
          <select
            required
            value={formData.position}
            onChange={(e) => setFormData({...formData, position: e.target.value})}
            className="input-field"
          >
            {positions.map(position => (
              <option key={position} value={position}>{position}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Card *</label>
          <input
            type="text"
            required
            value={formData.aadhaarCard}
            onChange={(e) => setFormData({...formData, aadhaarCard: formatAadhaarCard(e.target.value)})}
            className="input-field"
            placeholder="1234-5678-9012"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Driving License</label>
          <input
            type="text"
            value={formData.drivingLicense}
            onChange={(e) => setFormData({...formData, drivingLicense: e.target.value})}
            className="input-field"
            placeholder="DL-1234567890123"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">License Expiry</label>
          <input
            type="date"
            value={formData.licenseExpiry}
            onChange={(e) => setFormData({...formData, licenseExpiry: e.target.value})}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
          <input
            type="text"
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
            className="input-field"
            placeholder="e.g., 5 years"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
          <textarea
            required
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="input-field"
            rows={3}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>
    </form>
  )
}

export default UserProfileManagement

