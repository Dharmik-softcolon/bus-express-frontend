import { useState } from 'react'
import { MapPin, Clock, Users, DollarSign, Plus, Camera, FileText, CheckCircle, Calendar, TrendingUp, Upload, Eye, Edit, Trash2, Download, UserCheck, UserX, Clock as ClockIcon, Phone, MessageSquare } from 'lucide-react'

const BusEmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('trips')
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [showEarningsModal, setShowEarningsModal] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState(null)

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
      { 
        id: 1, 
        name: 'John Doe', 
        seat: '12A', 
        phone: '+1-555-1001', 
        status: 'confirmed',
        pickupPoint: 'Times Square',
        dropPoint: 'South Station',
        fare: 45.00,
        boardingTime: '08:00 AM',
        alightingTime: '12:00 PM',
        pickedUp: true,
        pickedUpTime: '08:05 AM'
      },
      { 
        id: 2, 
        name: 'Jane Smith', 
        seat: '8B', 
        phone: '+1-555-1002', 
        status: 'confirmed',
        pickupPoint: 'Central Station',
        dropPoint: 'Logan Airport',
        fare: 55.00,
        boardingTime: '08:30 AM',
        alightingTime: '12:30 PM',
        pickedUp: false,
        pickedUpTime: null
      },
      { 
        id: 3, 
        name: 'Mike Johnson', 
        seat: '15C', 
        phone: '+1-555-1003', 
        status: 'confirmed',
        pickupPoint: 'Times Square',
        dropPoint: 'South Station',
        fare: 45.00,
        boardingTime: '08:00 AM',
        alightingTime: '12:00 PM',
        pickedUp: true,
        pickedUpTime: '08:02 AM'
      }
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
      evidenceFile: null,
      status: 'pending'
    },
    {
      id: 2,
      type: 'Fastag',
      amount: 25.00,
      date: '2024-01-20',
      description: 'Highway toll payment',
      evidence: 'toll_receipt_001.jpg',
      evidenceFile: null,
      status: 'approved'
    },
    {
      id: 3,
      type: 'Tyre Service',
      amount: 80.00,
      date: '2024-01-19',
      description: 'Tyre replacement and alignment',
      evidence: 'tyre_service_001.jpg',
      evidenceFile: null,
      status: 'approved'
    }
  ])

  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: 1,
      startDate: '2024-01-25',
      endDate: '2024-01-27',
      reason: 'Personal emergency',
      status: 'pending',
      appliedDate: '2024-01-20'
    },
    {
      id: 2,
      startDate: '2024-01-15',
      endDate: '2024-01-15',
      reason: 'Medical checkup',
      status: 'approved',
      appliedDate: '2024-01-10'
    }
  ])

  const [earnings, setEarnings] = useState({
    monthly: [
      { month: 'January 2024', trips: 25, earnings: 2800.00, bonus: 200.00 },
      { month: 'December 2023', trips: 28, earnings: 3100.00, bonus: 300.00 },
      { month: 'November 2023', trips: 22, earnings: 2600.00, bonus: 150.00 }
    ],
    tripWise: [
      { tripId: 'TR-001', date: '2024-01-20', route: 'New York → Boston', earnings: 120.00, status: 'completed' },
      { tripId: 'TR-002', date: '2024-01-19', route: 'Boston → New York', earnings: 115.00, status: 'completed' },
      { tripId: 'TR-003', date: '2024-01-18', route: 'New York → Philadelphia', earnings: 95.00, status: 'completed' }
    ]
  })

  const [expenseForm, setExpenseForm] = useState({
    type: '',
    amount: '',
    description: '',
    evidence: '',
    evidenceFile: null
  })

  const [leaveForm, setLeaveForm] = useState({
    startDate: '',
    endDate: '',
    reason: ''
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
    const { name, value, files } = e.target
    setExpenseForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  const handleLeaveInputChange = (e) => {
    const { name, value } = e.target
    setLeaveForm(prev => ({
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
      evidence: expenseForm.evidenceFile ? expenseForm.evidenceFile.name : expenseForm.evidence || 'No evidence provided',
      evidenceFile: expenseForm.evidenceFile,
      status: 'pending'
    }
    setExpenses(prev => [...prev, newExpense])
    setShowExpenseModal(false)
    setExpenseForm({
      type: '',
      amount: '',
      description: '',
      evidence: '',
      evidenceFile: null
    })
  }

  const handleLeaveSubmit = (e) => {
    e.preventDefault()
    const newLeaveRequest = {
      id: leaveRequests.length + 1,
      ...leaveForm,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    }
    setLeaveRequests(prev => [...prev, newLeaveRequest])
    setShowLeaveModal(false)
    setLeaveForm({
      startDate: '',
      endDate: '',
      reason: ''
    })
  }

  const togglePickupStatus = (customerId) => {
    setCurrentTrip(prev => ({
      ...prev,
      customers: prev.customers.map(customer => {
        if (customer.id === customerId) {
          const now = new Date()
          const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })
          return {
            ...customer,
            pickedUp: !customer.pickedUp,
            pickedUpTime: !customer.pickedUp ? timeString : null
          }
        }
        return customer
      })
    }))
  }

  const handleCall = (phoneNumber, customerName) => {
    // Create a phone call link
    const phoneLink = `tel:${phoneNumber}`
    window.open(phoneLink, '_self')
    
    // Optional: Show a notification or log the call
    console.log(`Calling ${customerName} at ${phoneNumber}`)
  }

  const handleSMS = (phoneNumber, customerName) => {
    // Create an SMS link with a default message
    const message = `Hi ${customerName}, this is your bus driver. We're on our way to your pickup point. Please be ready.`
    const smsLink = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`
    window.open(smsLink, '_self')
    
    // Optional: Show a notification or log the SMS
    console.log(`Sending SMS to ${customerName} at ${phoneNumber}`)
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {currentTrip.pickupPoints.map((point, index) => (
                <div key={index} className="p-2 bg-blue-50 rounded text-sm">
                  <div className="font-medium">{point.name}</div>
                  <div className="text-gray-600">{point.time}</div>
                  <div className="text-gray-500">{point.address}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Drop Points</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
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
      </div>

      {/* Customer List */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Passenger Details</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passenger</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drop</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fare</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTrip.customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.seat}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.pickupPoint}</div>
                    <div className="text-sm text-gray-500">{customer.boardingTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.dropPoint}</div>
                    <div className="text-sm text-gray-500">{customer.alightingTime}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${customer.fare}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customer.pickedUp ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.pickedUp ? 'Picked Up' : 'Not Picked Up'}
                      </span>
                      {customer.pickedUp && customer.pickedUpTime && (
                        <span className="text-xs text-gray-500 mt-1">
                          At: {customer.pickedUpTime}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-2">
                      {/* Pickup Status Button and Communication Buttons */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => togglePickupStatus(customer.id)}
                          className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                            customer.pickedUp
                              ? 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg'
                              : 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg'
                          }`}
                        >
                          {customer.pickedUp ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              Mark Not Picked
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Mark Picked Up
                            </>
                          )}
                        </button>
                        
                        {/* Communication Buttons */}
                        <button
                          onClick={() => handleCall(customer.phone, customer.name)}
                          className="inline-flex items-center px-2 py-1 bg-green-500 text-white rounded-md text-xs font-medium hover:bg-green-600 transition-colors duration-200"
                          title={`Call ${customer.name}`}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </button>
                        <button
                          onClick={() => handleSMS(customer.phone, customer.name)}
                          className="inline-flex items-center px-2 py-1 bg-blue-500 text-white rounded-md text-xs font-medium hover:bg-blue-600 transition-colors duration-200"
                          title={`Send SMS to ${customer.name}`}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          SMS
                        </button>
                      </div>
                      
                      {/* Status Indicators */}
                      {customer.pickedUp && customer.pickedUpTime && (
                        <div className="flex items-center text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          Picked at {customer.pickedUpTime}
                        </div>
                      )}
                      
                      {!customer.pickedUp && (
                        <div className="flex items-center text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          Awaiting pickup
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{expense.type}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                      {expense.status}
                    </span>
                    {expense.evidence && (
                      <button
                        onClick={() => setSelectedExpense(expense)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="View Evidence"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 mb-1">{expense.description}</p>
                <p className="text-sm text-gray-500">{expense.date}</p>
                {expense.evidence && (
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <Camera className="h-4 w-4 mr-1" />
                    <span>Evidence: {expense.evidence}</span>
                  </div>
                )}
              </div>
              <div className="text-right ml-4">
                <div className="text-lg font-semibold text-gray-900">${expense.amount}</div>
              </div>
            </div>
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

      {/* Leave Requests */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Leave Requests</h3>
          <button
            onClick={() => setShowLeaveModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Request Leave
          </button>
        </div>
        <div className="space-y-3">
          {leaveRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">{request.startDate} to {request.endDate}</div>
                <p className="text-sm text-gray-600">{request.reason}</p>
                <p className="text-sm text-gray-500">Applied: {request.appliedDate}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Earnings */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Earnings</h3>
          <button
            onClick={() => setShowEarningsModal(true)}
            className="btn-secondary flex items-center"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Details
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">${earnings.monthly[0].earnings}</div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{earnings.monthly[0].trips}</div>
            <div className="text-sm text-gray-600">Trips This Month</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">${earnings.monthly[0].bonus}</div>
            <div className="text-sm text-gray-600">Bonus This Month</div>
          </div>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Trips</h3>
        <div className="space-y-3">
          {earnings.tripWise.slice(0, 3).map((trip, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium">{trip.tripId}</span>
                <p className="text-sm text-gray-600">{trip.route}</p>
                <p className="text-sm text-gray-500">{trip.date}</p>
              </div>
              <div className="text-right">
                <div className="font-medium text-green-600">${trip.earnings}</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                  {trip.status}
                </span>
              </div>
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
                      <option value="Oil">Oil</option>
                      <option value="Tyre Service">Tyre Service</option>
                      <option value="Service">Service</option>
                      <option value="Parking">Parking</option>
                      <option value="Fastag">Fastag</option>
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
                      type="file"
                      name="evidenceFile"
                      onChange={handleExpenseInputChange}
                      className="input-field"
                      accept="image/*,.pdf"
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload receipt or photo as proof</p>
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
                          evidence: '',
                          evidenceFile: null
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

        {/* Leave Request Modal */}
        {showLeaveModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Request Leave</h3>
                
                <form onSubmit={handleLeaveSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={leaveForm.startDate}
                      onChange={handleLeaveInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={leaveForm.endDate}
                      onChange={handleLeaveInputChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason
                    </label>
                    <textarea
                      name="reason"
                      value={leaveForm.reason}
                      onChange={handleLeaveInputChange}
                      className="input-field"
                      rows={3}
                      placeholder="Please provide a reason for your leave request"
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowLeaveModal(false)
                        setLeaveForm({
                          startDate: '',
                          endDate: '',
                          reason: ''
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
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Earnings Details Modal */}
        {showEarningsModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Earnings Details</h3>
                  <button
                    onClick={() => setShowEarningsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Monthly Earnings */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Monthly Earnings</h4>
                    <div className="space-y-3">
                      {earnings.monthly.map((month, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{month.month}</span>
                            <span className="text-green-600 font-semibold">${month.earnings}</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {month.trips} trips • ${month.bonus} bonus
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trip-wise Earnings */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Trip-wise Earnings</h4>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {earnings.tripWise.map((trip, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{trip.tripId}</span>
                            <span className="text-green-600 font-semibold">${trip.earnings}</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {trip.route} • {trip.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Evidence Viewer Modal */}
        {selectedExpense && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Expense Evidence</h3>
                  <button
                    onClick={() => setSelectedExpense(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">{selectedExpense.type}</h4>
                    <p className="text-gray-600">{selectedExpense.description}</p>
                    <p className="text-sm text-gray-500">{selectedExpense.date}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-gray-100 p-8 rounded-lg">
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">{selectedExpense.evidence}</p>
                      <p className="text-sm text-gray-500 mt-2">Evidence file uploaded</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">${selectedExpense.amount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default BusEmployeeDashboard

