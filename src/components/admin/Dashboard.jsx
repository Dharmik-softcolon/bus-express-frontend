import { useState } from 'react'
import { Users, Bus, Calendar, DollarSign, TrendingUp, TrendingDown, Clock, MapPin, Route, Plus, Edit, Trash2, UserCheck, UserX, Settings, BarChart3 } from 'lucide-react'

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d')
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [showTripDetails, setShowTripDetails] = useState(false)
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [showSalarySlip, setShowSalarySlip] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false)
  const [showBookingManDetails, setShowBookingManDetails] = useState(false)
  const [selectedBookingMan, setSelectedBookingMan] = useState(null)

  // Mock data for comprehensive management
  const [buses, setBuses] = useState([
    { id: 1, number: 'MH-01-AB-1234', route: 'Mumbai-Pune', status: 'active', capacity: 50, driver: 'Mike Johnson', conductor: 'Sarah Wilson', fuelLevel: 85, kmRun: 1250 },
    { id: 2, number: 'MH-02-CD-5678', route: 'Mumbai-Pune', status: 'active', capacity: 45, driver: 'John Smith', conductor: 'Alice Brown', fuelLevel: 70, kmRun: 980 },
    { id: 3, number: 'MH-03-EF-9012', route: 'Mumbai-Nashik', status: 'active', capacity: 40, driver: 'David Lee', conductor: 'Emma Davis', fuelLevel: 90, kmRun: 1100 },
    { id: 4, number: 'MH-04-GH-3456', route: 'Pune-Nashik', status: 'maintenance', capacity: 35, driver: 'Robert Wilson', conductor: 'Lisa Garcia', fuelLevel: 45, kmRun: 800 },
    { id: 5, number: 'MH-05-IJ-7890', route: 'Mumbai-Goa', status: 'active', capacity: 55, driver: 'Michael Brown', conductor: 'Jennifer Taylor', fuelLevel: 95, kmRun: 1500 }
  ])

  const [routes, setRoutes] = useState([
    { id: 1, name: 'Mumbai-Pune', distance: '150 km', duration: '3 hours', buses: ['MH-01-AB-1234', 'MH-02-CD-5678'], totalTrips: 24, fare: 450 },
    { id: 2, name: 'Mumbai-Nashik', distance: '180 km', duration: '4 hours', buses: ['MH-03-EF-9012'], totalTrips: 18, fare: 380 },
    { id: 3, name: 'Pune-Nashik', distance: '120 km', duration: '2.5 hours', buses: ['MH-04-GH-3456'], totalTrips: 12, fare: 320 },
    { id: 4, name: 'Mumbai-Goa', distance: '600 km', duration: '12 hours', buses: ['MH-05-IJ-7890'], totalTrips: 6, fare: 1200 }
  ])

  const [employees, setEmployees] = useState([
    { id: 1, name: 'Mike Johnson', role: 'Driver', license: 'DL123456', phone: '+91 9876543214', status: 'active', assignedBus: 'MH-01-AB-1234', totalTrips: 120, rating: 4.8, salary: 25000 },
    { id: 2, name: 'John Smith', role: 'Driver', license: 'DL789012', phone: '+91 9876543215', status: 'active', assignedBus: 'MH-02-CD-5678', totalTrips: 95, rating: 4.6, salary: 24000 },
    { id: 3, name: 'David Lee', role: 'Driver', license: 'DL345678', phone: '+91 9876543216', status: 'active', assignedBus: 'MH-03-EF-9012', totalTrips: 88, rating: 4.9, salary: 26000 },
    { id: 4, name: 'Sarah Wilson', role: 'Conductor', phone: '+91 9876543217', status: 'active', assignedBus: 'MH-01-AB-1234', totalTrips: 120, rating: 4.7, salary: 18000 },
    { id: 5, name: 'Alice Brown', role: 'Conductor', phone: '+91 9876543218', status: 'active', assignedBus: 'MH-02-CD-5678', totalTrips: 95, rating: 4.5, salary: 17000 },
    { id: 6, name: 'Emma Davis', role: 'Conductor', phone: '+91 9876543219', status: 'active', assignedBus: 'MH-03-EF-9012', totalTrips: 88, rating: 4.8, salary: 19000 }
  ])

  const [bookingMen, setBookingMen] = useState([
    { id: 1, name: 'Bob Wilson', email: 'bob@abctransport.com', phone: '+91 9876543213', status: 'active', totalBookings: 320, monthlyEarnings: 2400, commission: 5 },
    { id: 2, name: 'Carol Brown', email: 'carol@abctransport.com', phone: '+91 9876543220', status: 'active', totalBookings: 280, monthlyEarnings: 2100, commission: 5 }
  ])

  const [trips, setTrips] = useState([
    { id: 1, route: 'Mumbai-Pune', bus: 'MH-01-AB-1234', date: '2024-01-16', time: '08:00', driver: 'Mike Johnson', conductor: 'Sarah Wilson', status: 'scheduled', bookings: 45, revenue: 20250 },
    { id: 2, route: 'Mumbai-Nashik', bus: 'MH-03-EF-9012', date: '2024-01-16', time: '10:30', driver: 'David Lee', conductor: 'Emma Davis', status: 'in-progress', bookings: 38, revenue: 14440 },
    { id: 3, route: 'Pune-Nashik', bus: 'MH-04-GH-3456', date: '2024-01-16', time: '14:00', driver: 'Robert Wilson', conductor: 'Lisa Garcia', status: 'completed', bookings: 32, revenue: 10240 }
  ])

  const [expenses, setExpenses] = useState([
    { id: 1, bus: 'MH-01-AB-1234', category: 'fuel', amount: 2500, date: '2024-01-15', description: 'Diesel refill', status: 'paid', addedBy: 'Mike Johnson', employeeId: 1 },
    { id: 2, bus: 'MH-02-CD-5678', category: 'maintenance', amount: 3500, date: '2024-01-14', description: 'Engine service', status: 'paid', addedBy: 'John Smith', employeeId: 2 },
    { id: 3, bus: 'MH-03-EF-9012', category: 'fastag', amount: 800, date: '2024-01-13', description: 'Toll charges', status: 'paid', addedBy: 'David Lee', employeeId: 3 },
    { id: 4, bus: 'MH-04-GH-3456', category: 'tyres', amount: 12000, date: '2024-01-12', description: 'New tyres', status: 'pending', addedBy: 'Robert Wilson', employeeId: 4 },
    { id: 5, bus: 'MH-05-IJ-7890', category: 'parking', amount: 500, date: '2024-01-11', description: 'Parking charges', status: 'paid', addedBy: 'Michael Brown', employeeId: 5 },
    { id: 6, bus: 'MH-01-AB-1234', category: 'other', amount: 1200, date: '2024-01-10', description: 'Cleaning supplies', status: 'paid', addedBy: 'Sarah Wilson', employeeId: 4 }
  ])

  const [earnings, setEarnings] = useState([
    { id: 1, route: 'Mumbai-Pune', date: '2024-01-15', revenue: 20250, bookings: 45, avgFare: 450 },
    { id: 2, route: 'Mumbai-Nashik', date: '2024-01-15', revenue: 14440, bookings: 38, avgFare: 380 },
    { id: 3, route: 'Pune-Nashik', date: '2024-01-15', revenue: 10240, bookings: 32, avgFare: 320 },
    { id: 4, route: 'Mumbai-Goa', date: '2024-01-15', revenue: 24000, bookings: 20, avgFare: 1200 },
    { id: 5, route: 'Mumbai-Pune', date: '2024-01-14', revenue: 18900, bookings: 42, avgFare: 450 },
    { id: 6, route: 'Mumbai-Nashik', date: '2024-01-14', revenue: 13680, bookings: 36, avgFare: 380 }
  ])

  const [tripDetails, setTripDetails] = useState([
    {
      id: 1,
      route: 'Mumbai-Pune',
      bus: 'MH-01-AB-1234',
      date: '2024-01-16',
      time: '08:00',
      driver: 'Mike Johnson',
      conductor: 'Sarah Wilson',
      status: 'completed',
      totalEarnings: 20250,
      totalExpenses: 3200,
      netProfit: 17050,
      passengers: [
        { id: 1, name: 'John Doe', seat: 'A1', fare: 450, status: 'confirmed', phone: '+91 9876543210' },
        { id: 2, name: 'Jane Smith', seat: 'A2', fare: 450, status: 'confirmed', phone: '+91 9876543211' },
        { id: 3, name: 'Mike Johnson', seat: 'B1', fare: 450, status: 'confirmed', phone: '+91 9876543212' },
        { id: 4, name: 'Sarah Wilson', seat: 'B2', fare: 450, status: 'confirmed', phone: '+91 9876543213' },
        { id: 5, name: 'David Lee', seat: 'C1', fare: 450, status: 'confirmed', phone: '+91 9876543214' }
      ],
      expenses: [
        { category: 'fuel', amount: 2500, description: 'Diesel refill', addedBy: 'Mike Johnson' },
        { category: 'fastag', amount: 400, description: 'Toll charges', addedBy: 'Mike Johnson' },
        { category: 'parking', amount: 300, description: 'Parking charges', addedBy: 'Sarah Wilson' }
      ]
    },
    {
      id: 2,
      route: 'Mumbai-Nashik',
      bus: 'MH-03-EF-9012',
      date: '2024-01-16',
      time: '10:30',
      driver: 'David Lee',
      conductor: 'Emma Davis',
      status: 'in-progress',
      totalEarnings: 14440,
      totalExpenses: 1800,
      netProfit: 12640,
      passengers: [
        { id: 6, name: 'Alice Brown', seat: 'A1', fare: 380, status: 'confirmed', phone: '+91 9876543215' },
        { id: 7, name: 'Bob Wilson', seat: 'A2', fare: 380, status: 'confirmed', phone: '+91 9876543216' },
        { id: 8, name: 'Carol Garcia', seat: 'B1', fare: 380, status: 'confirmed', phone: '+91 9876543217' }
      ],
      expenses: [
        { category: 'fuel', amount: 1200, description: 'Diesel refill', addedBy: 'David Lee' },
        { category: 'fastag', amount: 600, description: 'Toll charges', addedBy: 'David Lee' }
      ]
    },
    {
      id: 3,
      route: 'Pune-Nashik',
      bus: 'MH-04-GH-3456',
      date: '2024-01-16',
      time: '14:00',
      driver: 'Robert Wilson',
      conductor: 'Lisa Garcia',
      status: 'completed',
      totalEarnings: 10240,
      totalExpenses: 2500,
      netProfit: 7740,
      passengers: [
        { id: 9, name: 'Emma Davis', seat: 'A1', fare: 320, status: 'confirmed', phone: '+91 9876543218' },
        { id: 10, name: 'Frank Miller', seat: 'A2', fare: 320, status: 'confirmed', phone: '+91 9876543219' },
        { id: 11, name: 'Grace Taylor', seat: 'B1', fare: 320, status: 'confirmed', phone: '+91 9876543220' }
      ],
      expenses: [
        { category: 'maintenance', amount: 2000, description: 'Engine service', addedBy: 'Robert Wilson' },
        { category: 'fuel', amount: 500, description: 'Diesel refill', addedBy: 'Robert Wilson' }
      ]
    }
  ])

  const [salaryPayments, setSalaryPayments] = useState([
    { id: 1, employeeId: 1, employeeName: 'Mike Johnson', month: '2024-01', basicSalary: 25000, allowances: 2000, deductions: 1500, netSalary: 25500, status: 'paid', paidDate: '2024-01-31', paymentMethod: 'Bank Transfer' },
    { id: 2, employeeId: 2, employeeName: 'John Smith', month: '2024-01', basicSalary: 24000, allowances: 1500, deductions: 1200, netSalary: 24300, status: 'paid', paidDate: '2024-01-31', paymentMethod: 'Bank Transfer' },
    { id: 3, employeeId: 3, employeeName: 'David Lee', month: '2024-01', basicSalary: 26000, allowances: 2500, deductions: 1800, netSalary: 26700, status: 'paid', paidDate: '2024-01-31', paymentMethod: 'Bank Transfer' },
    { id: 4, employeeId: 4, employeeName: 'Sarah Wilson', month: '2024-01', basicSalary: 18000, allowances: 1000, deductions: 900, netSalary: 18100, status: 'paid', paidDate: '2024-01-31', paymentMethod: 'Bank Transfer' },
    { id: 5, employeeId: 5, employeeName: 'Alice Brown', month: '2024-01', basicSalary: 17000, allowances: 800, deductions: 850, netSalary: 16950, status: 'paid', paidDate: '2024-01-31', paymentMethod: 'Bank Transfer' },
    { id: 6, employeeId: 6, employeeName: 'Emma Davis', month: '2024-01', basicSalary: 19000, allowances: 1200, deductions: 950, netSalary: 19250, status: 'paid', paidDate: '2024-01-31', paymentMethod: 'Bank Transfer' }
  ])

  const [commissionPayments, setCommissionPayments] = useState([
    { id: 1, bookingManId: 1, bookingManName: 'Bob Wilson', month: '2024-01', totalBookings: 320, totalRevenue: 144000, commissionRate: 5, commissionAmount: 7200, status: 'paid', paidDate: '2024-01-31', paymentMethod: 'Bank Transfer' },
    { id: 2, bookingManId: 2, bookingManName: 'Carol Brown', month: '2024-01', totalBookings: 280, totalRevenue: 126000, commissionRate: 5, commissionAmount: 6300, status: 'paid', paidDate: '2024-01-31', paymentMethod: 'Bank Transfer' }
  ])

  const [employeeTripHistory, setEmployeeTripHistory] = useState([
    { id: 1, employeeId: 1, employeeName: 'Mike Johnson', tripId: 1, route: 'Mumbai-Pune', bus: 'MH-01-AB-1234', date: '2024-01-16', time: '08:00', status: 'completed', role: 'Driver', passengers: 45, revenue: 20250 },
    { id: 2, employeeId: 1, employeeName: 'Mike Johnson', tripId: 2, route: 'Mumbai-Pune', bus: 'MH-01-AB-1234', date: '2024-01-15', time: '08:00', status: 'completed', role: 'Driver', passengers: 42, revenue: 18900 },
    { id: 3, employeeId: 1, employeeName: 'Mike Johnson', tripId: 3, route: 'Mumbai-Pune', bus: 'MH-01-AB-1234', date: '2024-01-14', time: '08:00', status: 'completed', role: 'Driver', passengers: 38, revenue: 17100 },
    { id: 4, employeeId: 2, employeeName: 'John Smith', tripId: 4, route: 'Mumbai-Pune', bus: 'MH-02-CD-5678', date: '2024-01-16', time: '14:00', status: 'completed', role: 'Driver', passengers: 40, revenue: 18000 },
    { id: 5, employeeId: 2, employeeName: 'John Smith', tripId: 5, route: 'Mumbai-Pune', bus: 'MH-02-CD-5678', date: '2024-01-15', time: '14:00', status: 'completed', role: 'Driver', passengers: 35, revenue: 15750 },
    { id: 6, employeeId: 3, employeeName: 'David Lee', tripId: 6, route: 'Mumbai-Nashik', bus: 'MH-03-EF-9012', date: '2024-01-16', time: '10:30', status: 'in-progress', role: 'Driver', passengers: 38, revenue: 14440 },
    { id: 7, employeeId: 4, employeeName: 'Sarah Wilson', tripId: 1, route: 'Mumbai-Pune', bus: 'MH-01-AB-1234', date: '2024-01-16', time: '08:00', status: 'completed', role: 'Conductor', passengers: 45, revenue: 20250 },
    { id: 8, employeeId: 4, employeeName: 'Sarah Wilson', tripId: 2, route: 'Mumbai-Pune', bus: 'MH-01-AB-1234', date: '2024-01-15', time: '08:00', status: 'completed', role: 'Conductor', passengers: 42, revenue: 18900 }
  ])

  const [bookingManTicketHistory, setBookingManTicketHistory] = useState([
    { id: 1, bookingManId: 1, bookingManName: 'Bob Wilson', ticketId: 'BE001', passengerName: 'John Doe', pickup: 'Mumbai Central', drop: 'Pune Station', route: 'Mumbai-Pune', date: '2024-01-16', time: '08:00', fare: 450, status: 'confirmed', seat: 'A1', phone: '+91 9876543210' },
    { id: 2, bookingManId: 1, bookingManName: 'Bob Wilson', ticketId: 'BE002', passengerName: 'Jane Smith', pickup: 'Mumbai Airport', drop: 'Pune Station', route: 'Mumbai-Pune', date: '2024-01-16', time: '08:00', fare: 450, status: 'confirmed', seat: 'A2', phone: '+91 9876543211' },
    { id: 3, bookingManId: 1, bookingManName: 'Bob Wilson', ticketId: 'BE003', passengerName: 'Mike Johnson', pickup: 'Mumbai Central', drop: 'Nashik City', route: 'Mumbai-Nashik', date: '2024-01-16', time: '10:30', fare: 380, status: 'confirmed', seat: 'B1', phone: '+91 9876543212' },
    { id: 4, bookingManId: 1, bookingManName: 'Bob Wilson', ticketId: 'BE004', passengerName: 'Sarah Wilson', pickup: 'Mumbai Central', drop: 'Goa Beach', route: 'Mumbai-Goa', date: '2024-01-16', time: '20:00', fare: 1200, status: 'confirmed', seat: 'C1', phone: '+91 9876543213' },
    { id: 5, bookingManId: 2, bookingManName: 'Carol Brown', ticketId: 'BE005', passengerName: 'Alice Brown', pickup: 'Pune Station', drop: 'Nashik City', route: 'Pune-Nashik', date: '2024-01-16', time: '14:00', fare: 320, status: 'confirmed', seat: 'A1', phone: '+91 9876543214' },
    { id: 6, bookingManId: 2, bookingManName: 'Carol Brown', ticketId: 'BE006', passengerName: 'Bob Wilson', pickup: 'Pune Station', drop: 'Nashik City', route: 'Pune-Nashik', date: '2024-01-16', time: '14:00', fare: 320, status: 'confirmed', seat: 'A2', phone: '+91 9876543215' },
    { id: 7, bookingManId: 2, bookingManName: 'Carol Brown', ticketId: 'BE007', passengerName: 'Carol Garcia', pickup: 'Mumbai Central', drop: 'Nashik City', route: 'Mumbai-Nashik', date: '2024-01-16', time: '10:30', fare: 380, status: 'pending', seat: 'B2', phone: '+91 9876543216' },
    { id: 8, bookingManId: 2, bookingManName: 'Carol Brown', ticketId: 'BE008', passengerName: 'Emma Davis', pickup: 'Mumbai Central', drop: 'Goa Beach', route: 'Mumbai-Goa', date: '2024-01-16', time: '20:00', fare: 1200, status: 'cancelled', seat: 'C2', phone: '+91 9876543217' }
  ])

  const stats = [
    {
      title: 'Total Bookings',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      icon: Calendar,
      color: 'blue'
    },
    {
      title: 'Revenue',
      value: '₹45,230',
      change: '+8.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Active Buses',
      value: buses.filter(bus => bus.status === 'active').length.toString(),
      change: '+2',
      trend: 'up',
      icon: Bus,
      color: 'purple'
    },
    {
      title: 'Total Employees',
      value: employees.length.toString(),
      change: '+1',
      trend: 'up',
      icon: Users,
      color: 'orange'
    }
  ]

  const recentBookings = [
    {
      id: 'BE123456789',
      passenger: 'John Doe',
      route: 'Mumbai-Pune',
      date: '2024-01-15',
      time: '08:00 AM',
      amount: '₹450',
      status: 'confirmed'
    },
    {
      id: 'BE123456790',
      passenger: 'Jane Smith',
      route: 'Mumbai-Nashik',
      date: '2024-01-15',
      time: '10:30 AM',
      amount: '₹380',
      status: 'confirmed'
    },
    {
      id: 'BE123456791',
      passenger: 'Mike Johnson',
      route: 'Pune-Nashik',
      date: '2024-01-15',
      time: '02:15 PM',
      amount: '₹320',
      status: 'pending'
    },
    {
      id: 'BE123456792',
      passenger: 'Sarah Wilson',
      route: 'Mumbai-Goa',
      date: '2024-01-15',
      time: '06:00 PM',
      amount: '₹1200',
      status: 'cancelled'
    }
  ]

  const popularRoutes = [
    { route: 'Mumbai-Pune', bookings: 156, revenue: '₹70,200' },
    { route: 'Mumbai-Nashik', bookings: 134, revenue: '₹50,920' },
    { route: 'Pune-Nashik', bookings: 98, revenue: '₹31,360' },
    { route: 'Mumbai-Goa', bookings: 87, revenue: '₹104,400' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'maintenance': return 'bg-orange-100 text-orange-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getIconColor = (color) => {
    switch (color) {
      case 'blue': return 'text-blue-600 bg-blue-100'
      case 'green': return 'text-green-600 bg-green-100'
      case 'purple': return 'text-purple-600 bg-purple-100'
      case 'orange': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  // Management functions
  const handleDelete = (type, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      switch (type) {
        case 'bus':
          setBuses(prev => prev.filter(bus => bus.id !== id))
          break
        case 'route':
          setRoutes(prev => prev.filter(route => route.id !== id))
          break
        case 'employee':
          setEmployees(prev => prev.filter(emp => emp.id !== id))
          break
        case 'bookingMan':
          setBookingMen(prev => prev.filter(bm => bm.id !== id))
          break
        case 'trip':
          setTrips(prev => prev.filter(trip => trip.id !== id))
          break
        case 'expense':
          setExpenses(prev => prev.filter(exp => exp.id !== id))
          break
        case 'earning':
          setEarnings(prev => prev.filter(earn => earn.id !== id))
          break
      }
    }
  }

  const toggleStatus = (type, id) => {
    switch (type) {
      case 'bus':
        setBuses(prev => prev.map(bus => 
          bus.id === id ? { ...bus, status: bus.status === 'active' ? 'maintenance' : 'active' } : bus
        ))
        break
      case 'employee':
        setEmployees(prev => prev.map(emp => 
          emp.id === id ? { ...emp, status: emp.status === 'active' ? 'inactive' : 'active' } : emp
        ))
        break
      case 'bookingMan':
        setBookingMen(prev => prev.map(bm => 
          bm.id === id ? { ...bm, status: bm.status === 'active' ? 'inactive' : 'active' } : bm
        ))
        break
      case 'expense':
        setExpenses(prev => prev.map(exp => 
          exp.id === id ? { ...exp, status: exp.status === 'paid' ? 'pending' : 'paid' } : exp
        ))
        break
    }
  }

  const handleFareChange = (routeId, newFare) => {
    setRoutes(prev => prev.map(route => 
      route.id === routeId ? { ...route, fare: newFare } : route
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bus Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage buses, routes, employees, and analyze operations
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'buses', name: 'Bus Management' },
              { id: 'routes', name: 'Route Management' },
              { id: 'employees', name: 'Employee Management' },
              { id: 'booking-men', name: 'Booking Men' },
              { id: 'trips', name: 'Trip Management' },
              { id: 'expenses', name: 'Expense Management' },
              { id: 'earnings', name: 'Earnings Analytics' },
              { id: 'trip-analytics', name: 'Trip Analytics' },
              { id: 'payroll', name: 'Payroll Management' }
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Time Range Selector */}
            <div className="mb-6">
              <div className="flex space-x-2">
                {['7d', '30d', '90d', '1y'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      timeRange === range
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <div className="flex items-center mt-2">
                        {stat.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">vs last period</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-full ${getIconColor(stat.color)}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Bookings */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Recent Bookings</h2>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </button>
                </div>
                
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{booking.passenger}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{booking.route}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{booking.date} at {booking.time}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{booking.amount}</div>
                        <div className="text-xs text-gray-500">{booking.id}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Routes */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-6">Popular Routes</h2>
                
                <div className="space-y-4">
                  {popularRoutes.map((route, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">{route.route}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <span>{route.bookings} bookings</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{route.revenue}</div>
                        <div className="text-xs text-gray-500">revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bus Management Tab */}
        {activeTab === 'buses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Bus Management</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Bus
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {buses.map((bus) => (
                <div key={bus.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{bus.number}</h3>
                      <p className="text-gray-600">Route: {bus.route}</p>
                      <p className="text-gray-600">Capacity: {bus.capacity} seats</p>
                      <p className="text-gray-600">Driver: {bus.driver}</p>
                      <p className="text-gray-600">Conductor: {bus.conductor}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bus.status)}`}>
                      {bus.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{bus.fuelLevel}%</div>
                      <div className="text-sm text-gray-600">Fuel Level</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{bus.kmRun}</div>
                      <div className="text-sm text-gray-600">KM Run</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => toggleStatus('bus', bus.id)}
                      className={`flex-1 px-3 py-2 rounded text-sm ${
                        bus.status === 'active' 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {bus.status === 'active' ? 'Maintenance' : 'Activate'}
                    </button>
                    <button
                      onClick={() => setEditingItem(bus)}
                      className="px-3 py-2 text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('bus', bus.id)}
                      className="px-3 py-2 text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Route Management Tab */}
        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Route Management</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Route
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {routes.map((route) => (
                <div key={route.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{route.name}</h3>
                      <p className="text-gray-600">{route.distance} • {route.duration}</p>
                      <p className="text-gray-600">Fare: ₹{route.fare}</p>
                      <p className="text-gray-600">Daily Trips: {route.totalTrips}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Assigned Buses:</h4>
                    <div className="space-y-1">
                      {route.buses.map((busNumber, index) => (
                        <div key={index} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                          {busNumber}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingItem(route)}
                      className="flex-1 px-3 py-2 text-blue-600 hover:text-blue-900 border border-blue-600 rounded"
                    >
                      <Edit className="h-4 w-4 inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => setEditingItem({...route, action: 'fare'})}
                      className="px-3 py-2 text-green-600 hover:text-green-900 border border-green-600 rounded"
                      title="Change Fare"
                    >
                      ₹
                    </button>
                    <button
                      onClick={() => handleDelete('route', route.id)}
                      className="px-3 py-2 text-red-600 hover:text-red-900 border border-red-600 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Employee Management Tab */}
        {activeTab === 'employees' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.map((employee) => (
                <div key={employee.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                      <p className="text-gray-600">{employee.role}</p>
                      <p className="text-gray-600">Phone: {employee.phone}</p>
                      {employee.license && <p className="text-gray-600">License: {employee.license}</p>}
                      <p className="text-gray-600">Bus: {employee.assignedBus}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{employee.totalTrips}</div>
                      <div className="text-sm text-gray-600">Total Trips</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{employee.rating}⭐</div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedEmployee(employee)
                        setShowEmployeeDetails(true)
                      }}
                      className="flex-1 px-3 py-2 text-purple-600 hover:text-purple-900 border border-purple-600 rounded text-sm"
                      title="View Trip History"
                    >
                      <Users className="h-4 w-4 inline mr-1" />
                      Trips
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEmployee(employee)
                        setShowSalarySlip(true)
                      }}
                      className="px-3 py-2 text-green-600 hover:text-green-900"
                      title="Generate Salary Slip"
                    >
                      ₹
                    </button>
                    <button
                      onClick={() => setEditingItem(employee)}
                      className="px-3 py-2 text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('employee', employee.id)}
                      className="px-3 py-2 text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Men Tab */}
        {activeTab === 'booking-men' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Booking Men Management</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Booking Man
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookingMen.map((bm) => (
                <div key={bm.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{bm.name}</h3>
                      <p className="text-gray-600">{bm.email}</p>
                      <p className="text-gray-600">Phone: {bm.phone}</p>
                      <p className="text-gray-600">Commission: {bm.commission}%</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bm.status)}`}>
                      {bm.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{bm.totalBookings}</div>
                      <div className="text-sm text-gray-600">Total Bookings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">₹{bm.monthlyEarnings}</div>
                      <div className="text-sm text-gray-600">Monthly Earnings</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedBookingMan(bm)
                        setShowBookingManDetails(true)
                      }}
                      className="flex-1 px-3 py-2 text-purple-600 hover:text-purple-900 border border-purple-600 rounded text-sm"
                      title="View Ticket History"
                    >
                      <Users className="h-4 w-4 inline mr-1" />
                      Tickets
                    </button>
                    <button
                      onClick={() => toggleStatus('bookingMan', bm.id)}
                      className={`px-3 py-2 rounded text-sm ${
                        bm.status === 'active' 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {bm.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => setEditingItem(bm)}
                      className="px-3 py-2 text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete('bookingMan', bm.id)}
                      className="px-3 py-2 text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trip Management Tab */}
        {activeTab === 'trips' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Trip Management</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Trip
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <div key={trip.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{trip.route}</h3>
                      <p className="text-gray-600">Bus: {trip.bus}</p>
                      <p className="text-gray-600">Date: {trip.date}</p>
                      <p className="text-gray-600">Time: {trip.time}</p>
                      <p className="text-gray-600">Driver: {trip.driver}</p>
                      <p className="text-gray-600">Conductor: {trip.conductor}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                      {trip.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{trip.bookings}</div>
                      <div className="text-sm text-gray-600">Bookings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">₹{trip.revenue}</div>
                      <div className="text-sm text-gray-600">Revenue</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingItem(trip)}
                      className="flex-1 px-3 py-2 text-blue-600 hover:text-blue-900 border border-blue-600 rounded"
                    >
                      <Edit className="h-4 w-4 inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete('trip', trip.id)}
                      className="px-3 py-2 text-red-600 hover:text-red-900 border border-red-600 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expense Management Tab */}
        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Expense Management</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </button>
            </div>

            {/* Expense Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">₹{expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Expenses</div>
                </div>
              </div>
              <div className="card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">₹{expenses.filter(exp => exp.category === 'fuel').reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Fuel Expenses</div>
                </div>
              </div>
              <div className="card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">₹{expenses.filter(exp => exp.category === 'maintenance').reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Maintenance</div>
                </div>
              </div>
              <div className="card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{expenses.filter(exp => exp.status === 'paid').length}</div>
                  <div className="text-sm text-gray-600">Paid Expenses</div>
                </div>
              </div>
            </div>

            {/* Expense Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {['fuel', 'maintenance', 'fastag', 'tyres', 'parking', 'other'].map((category) => {
                const categoryExpenses = expenses.filter(exp => exp.category === category)
                const totalAmount = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0)
                return (
                  <div key={category} className="card">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">{category}</h3>
                      <div className="text-2xl font-bold text-blue-600">₹{totalAmount.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{categoryExpenses.length} entries</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Employee Expense Tracking */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold mb-4">Expenses by Employee</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {employees.map((employee) => {
                  const employeeExpenses = expenses.filter(exp => exp.employeeId === employee.id)
                  const totalAmount = employeeExpenses.reduce((sum, exp) => sum + exp.amount, 0)
                  return (
                    <div key={employee.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{employee.name}</h4>
                          <p className="text-sm text-gray-600">{employee.role}</p>
                          <p className="text-sm text-gray-600">Bus: {employee.assignedBus}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-600">₹{totalAmount.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">{employeeExpenses.length} expenses</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {employeeExpenses.map((exp, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="capitalize">{exp.category}</span>
                            <span>₹{exp.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Expense List */}
            <div className="grid grid-cols-1 gap-6">
              {expenses.map((expense) => (
                <div key={expense.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{expense.bus}</h3>
                      <p className="text-gray-600 capitalize">{expense.category}</p>
                      <p className="text-gray-600">{expense.description}</p>
                      <p className="text-gray-600">Date: {expense.date}</p>
                      <p className="text-gray-600">Added by: {expense.addedBy}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-red-600">₹{expense.amount.toLocaleString()}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                        {expense.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingItem(expense)}
                      className="flex-1 px-3 py-2 text-blue-600 hover:text-blue-900 border border-blue-600 rounded"
                    >
                      <Edit className="h-4 w-4 inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete('expense', expense.id)}
                      className="px-3 py-2 text-red-600 hover:text-red-900 border border-red-600 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Earnings Analytics Tab */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Earnings Analytics</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Earnings
              </button>
            </div>

            {/* Earnings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₹{earnings.reduce((sum, earn) => sum + earn.revenue, 0).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
              </div>
              <div className="card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{earnings.reduce((sum, earn) => sum + earn.bookings, 0)}</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
              </div>
              <div className="card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">₹{Math.round(earnings.reduce((sum, earn) => sum + earn.revenue, 0) / earnings.reduce((sum, earn) => sum + earn.bookings, 0))}</div>
                  <div className="text-sm text-gray-600">Avg Fare</div>
                </div>
              </div>
              <div className="card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{new Set(earnings.map(earn => earn.route)).size}</div>
                  <div className="text-sm text-gray-600">Active Routes</div>
                </div>
              </div>
            </div>

            {/* Route-wise Earnings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {routes.map((route) => {
                const routeEarnings = earnings.filter(earn => earn.route === route.name)
                const totalRevenue = routeEarnings.reduce((sum, earn) => sum + earn.revenue, 0)
                const totalBookings = routeEarnings.reduce((sum, earn) => sum + earn.bookings, 0)
                const avgFare = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0
                
                return (
                  <div key={route.id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{route.name}</h3>
                        <p className="text-gray-600">Current Fare: ₹{route.fare}</p>
                        <p className="text-gray-600">Total Bookings: {totalBookings}</p>
                        <p className="text-gray-600">Avg Fare: ₹{avgFare}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Total Revenue</div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingItem({...route, action: 'fare'})}
                        className="flex-1 px-3 py-2 text-green-600 hover:text-green-900 border border-green-600 rounded"
                      >
                        <DollarSign className="h-4 w-4 inline mr-1" />
                        Change Fare
                      </button>
                      <button
                        onClick={() => setEditingItem(route)}
                        className="px-3 py-2 text-blue-600 hover:text-blue-900 border border-blue-600 rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Daily Earnings */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Daily Earnings</h3>
              <div className="space-y-3">
                {earnings.map((earning) => (
                  <div key={earning.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{earning.route}</span>
                      <p className="text-sm text-gray-600">{earning.date} • {earning.bookings} bookings</p>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-green-600">₹{earning.revenue.toLocaleString()}</span>
                      <p className="text-sm text-gray-500">Avg: ₹{earning.avgFare}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trip Analytics Tab */}
        {activeTab === 'trip-analytics' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Trip Analytics</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Trip
              </button>
            </div>

            {/* Trip Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{tripDetails.length}</div>
                  <div className="text-sm text-gray-600">Total Trips</div>
                </div>
              </div>
              <div className="card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₹{tripDetails.reduce((sum, trip) => sum + trip.totalEarnings, 0).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Earnings</div>
                </div>
              </div>
              <div className="card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">₹{tripDetails.reduce((sum, trip) => sum + trip.totalExpenses, 0).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Expenses</div>
                </div>
              </div>
              <div className="card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">₹{tripDetails.reduce((sum, trip) => sum + trip.netProfit, 0).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Net Profit</div>
                </div>
              </div>
            </div>

            {/* Trip List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tripDetails.map((trip) => (
                <div key={trip.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{trip.route}</h3>
                      <p className="text-gray-600">Bus: {trip.bus}</p>
                      <p className="text-gray-600">Date: {trip.date}</p>
                      <p className="text-gray-600">Time: {trip.time}</p>
                      <p className="text-gray-600">Driver: {trip.driver}</p>
                      <p className="text-gray-600">Conductor: {trip.conductor}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                      {trip.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">₹{trip.totalEarnings.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Earnings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">₹{trip.totalExpenses.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Expenses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">₹{trip.netProfit.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Profit</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedTrip(trip)
                        setShowTripDetails(true)
                      }}
                      className="flex-1 px-3 py-2 text-blue-600 hover:text-blue-900 border border-blue-600 rounded"
                    >
                      <Users className="h-4 w-4 inline mr-1" />
                      View Details
                    </button>
                    <button
                      onClick={() => setEditingItem(trip)}
                      className="px-3 py-2 text-green-600 hover:text-green-900 border border-green-600 rounded"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trip Details Modal */}
        {showTripDetails && selectedTrip && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Trip Details - {selectedTrip.route}</h3>
                <button
                  onClick={() => setShowTripDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Trip Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">₹{selectedTrip.totalEarnings.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Earnings</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">₹{selectedTrip.totalExpenses.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Expenses</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">₹{selectedTrip.netProfit.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Net Profit</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedTrip.passengers.length}</div>
                  <div className="text-sm text-gray-600">Passengers</div>
                </div>
              </div>

              {/* Trip Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="card">
                  <h4 className="text-lg font-semibold mb-4">Trip Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Route:</span>
                      <span className="font-medium">{selectedTrip.route}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bus:</span>
                      <span className="font-medium">{selectedTrip.bus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{selectedTrip.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{selectedTrip.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTrip.status)}`}>
                        {selectedTrip.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h4 className="text-lg font-semibold mb-4">Crew Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Driver:</span>
                      <span className="font-medium">{selectedTrip.driver}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Conductor:</span>
                      <span className="font-medium">{selectedTrip.conductor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passengers List */}
              <div className="card mb-6">
                <h4 className="text-lg font-semibold mb-4">Passengers ({selectedTrip.passengers.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedTrip.passengers.map((passenger) => (
                    <div key={passenger.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-medium text-gray-900">{passenger.name}</h5>
                          <p className="text-sm text-gray-600">Seat: {passenger.seat}</p>
                          <p className="text-sm text-gray-600">Phone: {passenger.phone}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">₹{passenger.fare}</div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(passenger.status)}`}>
                            {passenger.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expenses List */}
              <div className="card">
                <h4 className="text-lg font-semibold mb-4">Trip Expenses ({selectedTrip.expenses.length})</h4>
                <div className="space-y-3">
                  {selectedTrip.expenses.map((expense, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium capitalize">{expense.category}</span>
                        <p className="text-sm text-gray-600">{expense.description}</p>
                        <p className="text-sm text-gray-600">Added by: {expense.addedBy}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-red-600">₹{expense.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payroll Management Tab */}
        {activeTab === 'payroll' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Payroll Management</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Process Payroll
              </button>
            </div>

            {/* Payroll Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{salaryPayments.length}</div>
                  <div className="text-sm text-gray-600">Total Employees</div>
                </div>
              </div>
              <div className="card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₹{salaryPayments.reduce((sum, payment) => sum + payment.netSalary, 0).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Salaries</div>
                </div>
              </div>
              <div className="card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">₹{commissionPayments.reduce((sum, payment) => sum + payment.commissionAmount, 0).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Commissions</div>
                </div>
              </div>
              <div className="card">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">₹{(salaryPayments.reduce((sum, payment) => sum + payment.netSalary, 0) + commissionPayments.reduce((sum, payment) => sum + payment.commissionAmount, 0)).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Payroll</div>
                </div>
              </div>
            </div>

            {/* Salary Payments */}
            <div className="card mb-6">
              <h3 className="text-lg font-semibold mb-4">Employee Salary Payments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {salaryPayments.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{payment.employeeName}</h4>
                        <p className="text-sm text-gray-600">Month: {payment.month}</p>
                        <p className="text-sm text-gray-600">Basic: ₹{payment.basicSalary.toLocaleString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span>Allowances:</span>
                        <span className="text-green-600">+₹{payment.allowances.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Deductions:</span>
                        <span className="text-red-600">-₹{payment.deductions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>Net Salary:</span>
                        <span className="text-blue-600">₹{payment.netSalary.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          const employee = employees.find(emp => emp.id === payment.employeeId)
                          setSelectedEmployee(employee)
                          setShowSalarySlip(true)
                        }}
                        className="flex-1 px-3 py-2 text-green-600 hover:text-green-900 border border-green-600 rounded text-sm"
                      >
                        <DollarSign className="h-4 w-4 inline mr-1" />
                        Salary Slip
                      </button>
                      <button
                        onClick={() => setEditingItem(payment)}
                        className="px-3 py-2 text-blue-600 hover:text-blue-900 border border-blue-600 rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Commission Payments */}
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Booking Men Commission Payments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commissionPayments.map((payment) => (
                  <div key={payment.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{payment.bookingManName}</h4>
                        <p className="text-sm text-gray-600">Month: {payment.month}</p>
                        <p className="text-sm text-gray-600">Bookings: {payment.totalBookings}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span>Total Revenue:</span>
                        <span>₹{payment.totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Commission Rate:</span>
                        <span>{payment.commissionRate}%</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>Commission:</span>
                        <span className="text-purple-600">₹{payment.commissionAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingItem(payment)}
                        className="flex-1 px-3 py-2 text-blue-600 hover:text-blue-900 border border-blue-600 rounded text-sm"
                      >
                        <Edit className="h-4 w-4 inline mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete('commission', payment.id)}
                        className="px-3 py-2 text-red-600 hover:text-red-900 border border-red-600 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Salary Slip Modal */}
        {showSalarySlip && selectedEmployee && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Salary Slip - {selectedEmployee.name}</h3>
                <button
                  onClick={() => setShowSalarySlip(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Company Header */}
              <div className="text-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-blue-600">ABC Transport Company</h2>
                <p className="text-gray-600">Salary Slip for January 2024</p>
              </div>

              {/* Employee Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-2">Employee Information</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedEmployee.name}</div>
                    <div><span className="font-medium">Role:</span> {selectedEmployee.role}</div>
                    <div><span className="font-medium">Employee ID:</span> EMP{selectedEmployee.id.toString().padStart(3, '0')}</div>
                    <div><span className="font-medium">Assigned Bus:</span> {selectedEmployee.assignedBus}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Payment Details</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Payment Date:</span> 31-Jan-2024</div>
                    <div><span className="font-medium">Payment Method:</span> Bank Transfer</div>
                    <div><span className="font-medium">Account:</span> ****1234</div>
                  </div>
                </div>
              </div>

              {/* Salary Breakdown */}
              <div className="border rounded-lg p-4 mb-6">
                <h4 className="font-semibold mb-4">Salary Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Basic Salary</span>
                    <span>₹{selectedEmployee.salary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Allowances</span>
                    <span>+₹2,000</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Deductions (Tax, PF)</span>
                    <span>-₹1,500</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-3">
                    <span>Net Salary</span>
                    <span>₹{(selectedEmployee.salary + 2000 - 1500).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedEmployee.totalTrips}</div>
                  <div className="text-sm text-gray-600">Total Trips</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedEmployee.rating}⭐</div>
                  <div className="text-sm text-gray-600">Performance Rating</div>
                </div>
              </div>

              {/* Print Button */}
              <div className="text-center">
                <button
                  onClick={() => window.print()}
                  className="btn-primary"
                >
                  Print Salary Slip
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Employee Details Modal */}
        {showEmployeeDetails && selectedEmployee && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Employee Details - {selectedEmployee.name}</h3>
                <button
                  onClick={() => setShowEmployeeDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Employee Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="card">
                  <h4 className="text-lg font-semibold mb-4">Employee Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedEmployee.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Role:</span>
                      <span className="font-medium">{selectedEmployee.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedEmployee.phone}</span>
                    </div>
                    {selectedEmployee.license && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">License:</span>
                        <span className="font-medium">{selectedEmployee.license}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assigned Bus:</span>
                      <span className="font-medium">{selectedEmployee.assignedBus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEmployee.status)}`}>
                        {selectedEmployee.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h4 className="text-lg font-semibold mb-4">Performance Summary</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedEmployee.totalTrips}</div>
                      <div className="text-sm text-gray-600">Total Trips</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedEmployee.rating}⭐</div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip History */}
              <div className="card">
                <h4 className="text-lg font-semibold mb-4">Trip History ({employeeTripHistory.filter(trip => trip.employeeId === selectedEmployee.id).length} trips)</h4>
                <div className="space-y-3">
                  {employeeTripHistory
                    .filter(trip => trip.employeeId === selectedEmployee.id)
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-gray-900 text-lg">{trip.route}</h5>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trip.status)}`}>
                              {trip.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center">
                              <Bus className="h-4 w-4 mr-1 text-blue-500" />
                              <span className="font-medium">Bus:</span> {trip.bus}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-green-500" />
                              <span className="font-medium">Date:</span> {trip.date}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-orange-500" />
                              <span className="font-medium">Time:</span> {trip.time}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-purple-500" />
                              <span className="font-medium">Role:</span> {trip.role}
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="font-medium">Trip ID:</span> TR-{trip.tripId.toString().padStart(3, '0')}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-xl font-bold text-green-600">₹{trip.revenue.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{trip.passengers} passengers</div>
                          <div className="text-xs text-gray-400 mt-1">Revenue</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Man Details Modal */}
        {showBookingManDetails && selectedBookingMan && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Booking Man Details - {selectedBookingMan.name}</h3>
                <button
                  onClick={() => setShowBookingManDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Booking Man Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="card">
                  <h4 className="text-lg font-semibold mb-4">Booking Man Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedBookingMan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedBookingMan.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedBookingMan.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commission:</span>
                      <span className="font-medium">{selectedBookingMan.commission}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBookingMan.status)}`}>
                        {selectedBookingMan.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h4 className="text-lg font-semibold mb-4">Performance Summary</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedBookingMan.totalBookings}</div>
                      <div className="text-sm text-gray-600">Total Bookings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">₹{selectedBookingMan.monthlyEarnings}</div>
                      <div className="text-sm text-gray-600">Monthly Earnings</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket History */}
              <div className="card">
                <h4 className="text-lg font-semibold mb-4">Ticket History ({bookingManTicketHistory.filter(ticket => ticket.bookingManId === selectedBookingMan.id).length} tickets)</h4>
                <div className="space-y-4">
                  {bookingManTicketHistory
                    .filter(ticket => ticket.bookingManId === selectedBookingMan.id)
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-gray-900 text-lg">{ticket.passengerName}</h5>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                          </div>
                          
                          {/* Route and Location Information */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                              <span className="font-medium">Route:</span> {ticket.route}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-green-500" />
                              <span className="font-medium">Pickup:</span> {ticket.pickup}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-red-500" />
                              <span className="font-medium">Drop:</span> {ticket.drop}
                            </div>
                          </div>
                          
                          {/* Trip Details */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-purple-500" />
                              <span className="font-medium">Date:</span> {ticket.date}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-orange-500" />
                              <span className="font-medium">Time:</span> {ticket.time}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-indigo-500" />
                              <span className="font-medium">Seat:</span> {ticket.seat}
                            </div>
                            <div className="flex items-center">
                              <span className="font-medium">Phone:</span> {ticket.phone}
                            </div>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="font-medium">Ticket ID:</span> {ticket.ticketId}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-xl font-bold text-green-600">₹{ticket.fare}</div>
                          <div className="text-sm text-gray-500">Fare</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
