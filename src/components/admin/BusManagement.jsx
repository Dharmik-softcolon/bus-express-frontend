import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, MapPin, Users, Fuel, CreditCard, Route, Calendar, DollarSign } from 'lucide-react'
import { busAPI, employeeAPI } from '../../services/api'

const BusManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBus, setEditingBus] = useState(null)
  const [activeTab, setActiveTab] = useState('buses')
  const [error, setError] = useState(null)
  
  const [buses, setBuses] = useState([])
  
  // Load buses on component mount
  useEffect(() => {
    loadBuses()
  }, [])
  
  const loadBuses = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await busAPI.getAllBuses()
      if (response.success) {
        setBuses(response.data.buses || [])
          } else {
            setError('Failed to load buses')
            setBuses([])
          }
    } catch (error) {
      console.error('Error loading buses:', error)
      setError('Failed to load buses')
      setBuses([])
    } finally {
      setLoading(false)
    }
  }

  const [employees, setEmployees] = useState([])
  const [employeesLoading, setEmployeesLoading] = useState(true)

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setEmployeesLoading(true)
      const response = await employeeAPI.getAllEmployees()
      if (response.success) {
        const formattedEmployees = (response.data.employees || []).map(emp => ({
          ...emp,
          id: emp._id || emp.id,
          role: emp.subrole || 'Employee',
          license: emp.license || '',
          phone: emp.phone || ''
        }))
        setEmployees(formattedEmployees)
      } else {
        setEmployees([])
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
      setEmployees([])
    } finally {
      setEmployeesLoading(false)
    }
  }
  
  // Bus CRUD operations
  const handleAddBus = async (busData) => {
    try {
      const response = await busAPI.createBus(busData)
      if (response.success) {
        await loadBuses() // Reload buses
        setShowAddModal(false)
        return { success: true }
      } else {
        return { success: false, error: response.message || 'Failed to add bus' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to add bus' }
    }
  }
  
  const handleUpdateBus = async (busId, busData) => {
    try {
      const response = await busAPI.updateBus(busId, busData)
      if (response.success) {
        await loadBuses() // Reload buses
        setEditingBus(null)
        return { success: true }
      } else {
        return { success: false, error: response.message || 'Failed to update bus' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to update bus' }
    }
  }
  
  const handleDeleteBus = async (busId) => {
    try {
      const response = await busAPI.deleteBus(busId)
      if (response.success) {
        await loadBuses() // Reload buses
        return { success: true }
      } else {
        return { success: false, error: response.message || 'Failed to delete bus' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to delete bus' }
    }
  }
  
  const handleUpdateBusStatus = async (busId, status) => {
    try {
      const response = await busAPI.updateBusStatus(busId, status)
      if (response.success) {
        await loadBuses() // Reload buses
        return { success: true }
      } else {
        return { success: false, error: response.message || 'Failed to update bus status' }
      }
    } catch (error) {
      return { success: false, error: error.message || 'Failed to update bus status' }
    }
  }

  const [routes, setRoutes] = useState([
    { id: 1, name: 'New York → Boston', distance: 215, duration: '4h 30m' },
    { id: 2, name: 'Los Angeles → San Francisco', distance: 383, duration: '6h 15m' },
    { id: 3, name: 'Chicago → Detroit', distance: 282, duration: '4h 45m' }
  ])

  const [formData, setFormData] = useState({
    busNumber: '',
    busName: '',
    busType: 'AC Sleeper',
    capacity: '',
    assignedRoute: '',
    driver: '',
    helper: '',
    fuelCapacity: '',
    fastTagNumber: '',
    status: 'active'
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
    if (editingBus) {
      setBuses(prev => prev.map(bus => 
        bus.id === editingBus.id ? { ...bus, ...formData } : bus
      ))
    } else {
      const newBus = {
        ...formData,
        id: buses.length + 1,
        currentFuel: 0,
        totalKm: 0,
        lastServiceKm: 0,
        fastTagBalance: 0,
        expenses: []
      }
      setBuses(prev => [...prev, newBus])
    }
    setShowAddModal(false)
    setEditingBus(null)
    setFormData({
      busNumber: '',
      busName: '',
      busType: 'AC Sleeper',
      capacity: '',
      assignedRoute: '',
      driver: '',
      helper: '',
      fuelCapacity: '',
      fastTagNumber: '',
      status: 'active'
    })
  }

  const handleEdit = (bus) => {
    setEditingBus(bus)
    setFormData(bus)
    setShowAddModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      setBuses(prev => prev.filter(bus => bus.id !== id))
    }
  }

  const addExpense = (busId, expense) => {
    setBuses(prev => prev.map(bus => 
      bus.id === busId 
        ? { ...bus, expenses: [...bus.expenses, { ...expense, id: Date.now() }] }
        : bus
    ))
  }

  const updateFuel = (busId, amount) => {
    setBuses(prev => prev.map(bus => 
      bus.id === busId 
        ? { ...bus, currentFuel: Math.min(bus.currentFuel + amount, bus.fuelCapacity) }
        : bus
    ))
  }

  const updateFastTagBalance = (busId, amount) => {
    setBuses(prev => prev.map(bus => 
      bus.id === busId 
        ? { ...bus, fastTagBalance: bus.fastTagBalance + amount }
        : bus
    ))
  }

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  const renderBusList = () => (
    <div className="space-y-4">
      {buses.map((bus) => (
        <div key={bus.id} className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{bus.busName}</h3>
              <p className="text-gray-600">Bus Number: {bus.busNumber}</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bus.status)}`}>
                {bus.status}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(bus)}
                className="text-primary hover:text-blue-900"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(bus.id)}
                className="text-red-600 hover:text-red-900"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Route & Employees */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Route & Staff</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Route className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{bus.assignedRoute}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <span>Driver: {bus.driver}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <span>Helper: {bus.helper}</span>
                </div>
              </div>
            </div>

            {/* Fuel & Distance */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Fuel & Distance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Fuel className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{bus.currentFuel}/{bus.fuelCapacity} L</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{bus.totalKm} km</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span>Last Service: {bus.lastServiceKm} km</span>
                </div>
              </div>
            </div>

            {/* FastTag & Expenses */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">FastTag & Expenses</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                  <span>{bus.fastTagNumber}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                  <span>Balance: ${bus.fastTagBalance}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                  <span>Total Expenses: ${bus.expenses.reduce((sum, exp) => sum + exp.amount, 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderExpenseManagement = () => (
    <div className="space-y-6">
      {buses.map((bus) => (
        <div key={bus.id} className="card">
          <h3 className="text-lg font-semibold mb-4">{bus.busName} - Expense Management</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add Expense */}
            <div>
              <h4 className="font-medium mb-3">Add Expense</h4>
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                addExpense(bus.id, {
                  type: formData.get('type'),
                  amount: parseFloat(formData.get('amount')),
                  date: formData.get('date'),
                  description: formData.get('description')
                })
                e.target.reset()
              }} className="space-y-3">
                <select name="type" className="input-field" required>
                  <option value="">Select Expense Type</option>
                  <option value="Fuel">Fuel</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Toll">Toll</option>
                  <option value="Repair">Repair</option>
                  <option value="Other">Other</option>
                </select>
                <input type="number" name="amount" placeholder="Amount" className="input-field" step="0.01" required />
                <input type="date" name="date" className="input-field" required />
                <input type="text" name="description" placeholder="Description" className="input-field" required />
                <button type="submit" className="btn-primary w-full">Add Expense</button>
              </form>
            </div>

            {/* Expense History */}
            <div>
              <h4 className="font-medium mb-3">Expense History</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {bus.expenses.map((expense) => (
                  <div key={expense.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{expense.type}</span>
                      <p className="text-sm text-gray-600">{expense.description}</p>
                      <p className="text-xs text-gray-500">{expense.date}</p>
                    </div>
                    <span className="font-semibold">${expense.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Add Fuel (Liters)</label>
              <div className="flex">
                <input type="number" className="input-field rounded-r-none" placeholder="Amount" />
                <button 
                  onClick={() => updateFuel(bus.id, 50)}
                  className="btn-primary rounded-l-none"
                >
                  Add 50L
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Update KM</label>
              <div className="flex">
                <input type="number" className="input-field rounded-r-none" placeholder="KM" />
                <button className="btn-primary rounded-l-none">Update</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Recharge FastTag</label>
              <div className="flex">
                <input type="number" className="input-field rounded-r-none" placeholder="Amount" />
                <button 
                  onClick={() => updateFastTagBalance(bus.id, 100)}
                  className="btn-primary rounded-l-none"
                >
                  +$100
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold" style={{color: "#B99750"}}>Bus Management</h1>
              <p className="text-gray-600 mt-1">Manage buses, routes, employees, fuel, and expenses</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Bus
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {[
              { id: 'buses', name: 'Bus List' },
              { id: 'expenses', name: 'Expense Management' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'buses' && renderBusList()}
        {activeTab === 'expenses' && renderExpenseManagement()}

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {editingBus ? 'Edit Bus' : 'Add New Bus'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bus Number
                      </label>
                      <input
                        type="text"
                        name="busNumber"
                        value={formData.busNumber}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bus Name
                      </label>
                      <input
                        type="text"
                        name="busName"
                        value={formData.busName}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bus Type
                      </label>
                      <select
                        name="busType"
                        value={formData.busType}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="AC Sleeper">AC Sleeper</option>
                        <option value="Non-AC">Non-AC</option>
                        <option value="AC Seater">AC Seater</option>
                        <option value="Luxury">Luxury</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Capacity
                      </label>
                      <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned Route
                    </label>
                    <select
                      name="assignedRoute"
                      value={formData.assignedRoute}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="">Select Route</option>
                      {routes.map(route => (
                        <option key={route.id} value={route.name}>{route.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Driver
                      </label>
                      <select
                        name="driver"
                        value={formData.driver}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="">Select Driver</option>
                        {employees.filter(emp => emp.role === 'Driver').map(emp => (
                          <option key={emp.id} value={emp.name}>{emp.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Helper
                      </label>
                      <select
                        name="helper"
                        value={formData.helper}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="">Select Helper</option>
                        {employees.filter(emp => emp.role === 'Helper').map(emp => (
                          <option key={emp.id} value={emp.name}>{emp.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fuel Capacity (L)
                      </label>
                      <input
                        type="number"
                        name="fuelCapacity"
                        value={formData.fuelCapacity}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        FastTag Number
                      </label>
                      <input
                        type="text"
                        name="fastTagNumber"
                        value={formData.fastTagNumber}
                        onChange={handleInputChange}
                        className="input-field"
                        required
                      />
                    </div>
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
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false)
                        setEditingBus(null)
                      }}
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

