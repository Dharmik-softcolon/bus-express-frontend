import { useState } from 'react'
import { MapPin, Clock, Users, DollarSign, Plus, Camera, FileText, CheckCircle } from 'lucide-react'

const BusEmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('trips')
  const [showExpenseModal, setShowExpenseModal] = useState(false)

  const [currentTrip, setCurrentTrip] = useState({
    id: 1,
    tripNumber: 'TR-001',
    route: 'New York → Boston',
    busNumber: 'BE-001',
    departureTime: '08:00 AM',
    arrivalTime: '12:30 PM',
    departureDate: '2024-01-20',
    status: 'in-progress',
    pickupPoints: [
      { name: 'Times Square', time: '08:00 AM', address: 'Times Square, New York' },
      { name: 'Central Station', time: '08:30 AM', address: 'Central Station, New York' }
    ],
    dropPoints: [
      { name: 'South Station', time: '12:00 PM', address: 'South Station, Boston' },
      { name: 'Logan Airport', time: '12:30 PM', address: 'Logan Airport, Boston' }
    ],
    customers: [
      { id: 1, name: 'John Doe', seat: '12A', phone: '+1-555-1001', status: 'confirmed' },
      { id: 2, name: 'Jane Smith', seat: '8B', phone: '+1-555-1002', status: 'confirmed' },
      { id: 3, name: 'Mike Johnson', seat: '15C', phone: '+1-555-1003', status: 'confirmed' }
    ]
  })

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      type: 'Fuel',
      amount: 150.00,
      date: '2024-01-20',
      description: 'Diesel refill at gas station',
      evidence: 'fuel_receipt_001.jpg',
      status: 'pending'
    },
    {
      id: 2,
      type: 'Toll',
      amount: 25.00,
      date: '2024-01-20',
      description: 'Highway toll payment',
      evidence: 'toll_receipt_001.jpg',
      status: 'approved'
    }
  ])

  const [expenseForm, setExpenseForm] = useState({
    type: '',
    amount: '',
    description: '',
    evidence: ''
  })

  const employeeInfo = {
    name: 'John Smith',
    role: 'Driver',
    license: 'DL123456',
    phone: '+1-555-0101',
    totalTrips: 120,
    rating: 4.8,
    monthlyEarnings: 2800
  }

  const handleExpenseInputChange = (e) => {
    const { name, value } = e.target
    setExpenseForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleExpenseSubmit = (e) => {
    e.preventDefault()
    const newExpense = {
      id: expenses.length + 1,
      ...expenseForm,
      amount: parseFloat(expenseForm.amount),
      date: new Date().toISOString().split('T')[0],
      evidence: expenseForm.evidence || 'No evidence provided',
      status: 'pending'
    }
    setExpenses(prev => [...prev, newExpense])
    setShowExpenseModal(false)
    setExpenseForm({
      type: '',
      amount: '',
      description: '',
      evidence: ''
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderCurrentTrip = () => (
    <div className="space-y-6">
      {/* Trip Information */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Current Trip: {currentTrip.tripNumber}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Trip Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                <span>{currentTrip.route}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span>{currentTrip.departureTime} - {currentTrip.arrivalTime}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-gray-400 mr-2" />
                <span>Bus: {currentTrip.busNumber}</span>
              </div>
              <div className="flex items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentTrip.status)}`}>
                  {currentTrip.status}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Pickup Points</h4>
            <div className="space-y-2">
              {currentTrip.pickupPoints.map((point, index) => (
                <div key={index} className="p-2 bg-blue-50 rounded text-sm">
                  <div className="font-medium">{point.name}</div>
                  <div className="text-gray-600">{point.time}</div>
                  <div className="text-gray-500">{point.address}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Passenger List</h3>
        <div className="space-y-3">
          {currentTrip.customers.map((customer) => (
            <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium">{customer.name}</span>
                <p className="text-sm text-gray-600">Seat: {customer.seat}</p>
                <p className="text-sm text-gray-600">{customer.phone}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                {customer.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Drop Points */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Drop Points</h3>
        <div className="space-y-2">
          {currentTrip.dropPoints.map((point, index) => (
            <div key={index} className="p-2 bg-green-50 rounded text-sm">
              <div className="font-medium">{point.name}</div>
              <div className="text-gray-600">{point.time}</div>
              <div className="text-gray-500">{point.address}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderExpenses = () => (
    <div className="space-y-6">
      {/* Add Expense Button */}
      <div className="card">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Trip Expenses</h3>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Expenses List */}
      <div className="space-y-4">
        {expenses.map((expense) => (
          <div key={expense.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-medium text-gray-900">{expense.type}</h4>
                <p className="text-gray-600">{expense.description}</p>
                <p className="text-sm text-gray-500">{expense.date}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-gray-900">${expense.amount}</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                  {expense.status}
                </span>
              </div>
            </div>
            
            {expense.evidence && (
              <div className="flex items-center text-sm text-gray-600">
                <Camera className="h-4 w-4 mr-1" />
                <span>Evidence: {expense.evidence}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="space-y-6">
      {/* Employee Information */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Employee Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Personal Details</h4>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Name:</span> {employeeInfo.name}</div>
              <div><span className="font-medium">Role:</span> {employeeInfo.role}</div>
              <div><span className="font-medium">License:</span> {employeeInfo.license}</div>
              <div><span className="font-medium">Phone:</span> {employeeInfo.phone}</div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Performance</h4>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Total Trips:</span> {employeeInfo.totalTrips}</div>
              <div><span className="font-medium">Rating:</span> {employeeInfo.rating}/5.0</div>
              <div><span className="font-medium">Monthly Earnings:</span> ${employeeInfo.monthlyEarnings}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Trips</h3>
        <div className="space-y-3">
          {[
            { trip: 'TR-001', route: 'New York → Boston', date: '2024-01-20', status: 'completed' },
            { trip: 'TR-002', route: 'Boston → New York', date: '2024-01-19', status: 'completed' },
            { trip: 'TR-003', route: 'New York → Philadelphia', date: '2024-01-18', status: 'completed' }
          ].map((trip, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium">{trip.trip}</span>
                <p className="text-sm text-gray-600">{trip.route}</p>
                <p className="text-sm text-gray-500">{trip.date}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                {trip.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bus Employee Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome, {employeeInfo.name} ({employeeInfo.role})
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {[
              { id: 'trips', name: 'Current Trip' },
              { id: 'expenses', name: 'Expenses' },
              { id: 'profile', name: 'Profile' }
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

        {/* Content */}
        {activeTab === 'trips' && renderCurrentTrip()}
        {activeTab === 'expenses' && renderExpenses()}
        {activeTab === 'profile' && renderProfile()}

        {/* Add Expense Modal */}
        {showExpenseModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add Trip Expense</h3>
                
                <form onSubmit={handleExpenseSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expense Type
                    </label>
                    <select
                      name="type"
                      value={expenseForm.type}
                      onChange={handleExpenseInputChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select Type</option>
                      <option value="Fuel">Fuel</option>
                      <option value="Toll">Toll</option>
                      <option value="Parking">Parking</option>
                      <option value="Food">Food</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={expenseForm.amount}
                      onChange={handleExpenseInputChange}
                      className="input-field"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={expenseForm.description}
                      onChange={handleExpenseInputChange}
                      className="input-field"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Evidence (Receipt/Photo)
                    </label>
                    <input
                      type="text"
                      name="evidence"
                      value={expenseForm.evidence}
                      onChange={handleExpenseInputChange}
                      className="input-field"
                      placeholder="e.g., receipt_001.jpg"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowExpenseModal(false)
                        setExpenseForm({
                          type: '',
                          amount: '',
                          description: '',
                          evidence: ''
                        })
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Add Expense
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

export default BusEmployeeDashboard

