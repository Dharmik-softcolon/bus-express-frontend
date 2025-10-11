import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import showToast from '../../utils/toast'
import { bookingAPI, tripAPI, searchAPI } from '../../services/api'
import BookingAnalytics from './BookingAnalytics'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Bus, 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Info,
  User as UserIcon,
  Phone,
  Mail,
  CreditCard,
  DollarSign,
  Star,
  User,
  BarChart3
} from 'lucide-react'

const CreateBookingModal = ({ isOpen, onClose }) => {
  const { user } = useUser()
  
  // State management
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Search states
  const [searchFilters, setSearchFilters] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  })
  
  // Available buses
  const [availableBuses, setAvailableBuses] = useState([])
  const [selectedBus, setSelectedBus] = useState(null)
  
  // Seat selection
  const [selectedSeats, setSelectedSeats] = useState([])
  const [showSeatModal, setShowSeatModal] = useState(false)
  
  // Analytics modal
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false)
  
  // Customer details
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    gender: ''
  })

  // Booking manager data
  const [bookingManager, setBookingManager] = useState({
    id: 1,
    name: 'Booking Manager',
    commission: 5.0,
    totalBookings: 0,
    totalEarnings: 0,
    bookings: []
  })

  // Reset modal when opened
  useEffect(() => {
    if (isOpen) {
      setSearchFilters({ from: '', to: '', date: '', passengers: 1 })
      setAvailableBuses([])
      setSelectedBus(null)
      setSelectedSeats([])
      setCustomerDetails({ name: '', phone: '', email: '', age: '', gender: '' })
      setError(null)
    }
  }, [isOpen])

  // Generate seat layout for buses (36 seats: 2 sections, 18 seats each)
  function generateSeatLayout(totalSeats = 36) {
    const seats = []

    // Create 2 sections (Lower and Upper)
    for (let section = 0; section < 2; section++) {
      const sectionSeats = []

      // 6 rows in each section
      for (let row = 0; row < 6; row++) {
        const rowSeats = []

        // Left side - single seat
        const leftSeatNumber = section === 0 ? row + 25 : row + 31
        const leftOccupied = Math.random() > 0.7
        const leftBookedByWomen = leftOccupied && Math.random() > 0.8

        rowSeats.push({
          number: leftSeatNumber,
          side: 'left',
          berth: 'single',
          occupied: leftOccupied,
          selected: false,
          isSingle: true,
          bookedByWomen: leftBookedByWomen,
          section: section === 0 ? 'lower' : 'upper',
          row: row + 1
        })

        // Right side - double seat pair with specific combinations
        let rightSeat1Number, rightSeat2Number

        if (section === 0) { // Lower berth
          const lowerBerthPairs = [
            [1, 2], [5, 6], [9, 10], [13, 14], [17, 18], [21, 22]
          ]
          rightSeat1Number = lowerBerthPairs[row][0]
          rightSeat2Number = lowerBerthPairs[row][1]
        } else { // Upper berth
          const upperBerthPairs = [
            [3, 4], [7, 8], [11, 12], [15, 16], [19, 20], [23, 24]
          ]
          rightSeat1Number = upperBerthPairs[row][0]
          rightSeat2Number = upperBerthPairs[row][1]
        }

        const right1Occupied = Math.random() > 0.7
        const right2Occupied = Math.random() > 0.7
        const right1BookedByWomen = right1Occupied && Math.random() > 0.8
        const right2BookedByWomen = right2Occupied && Math.random() > 0.8

        // First seat of the pair
        rowSeats.push({
          number: rightSeat1Number,
          side: 'right',
          berth: 'double',
          occupied: right1Occupied,
          selected: false,
          isSingle: false,
          pairSeat: rightSeat2Number,
          bookedByWomen: right1BookedByWomen,
          section: section === 0 ? 'lower' : 'upper',
          row: row + 1
        })

        // Second seat of the pair
        rowSeats.push({
          number: rightSeat2Number,
          side: 'right',
          berth: 'double',
          occupied: right2Occupied,
          selected: false,
          isSingle: false,
          pairSeat: rightSeat1Number,
          bookedByWomen: right2BookedByWomen,
          section: section === 0 ? 'lower' : 'upper',
          row: row + 1
        })

        sectionSeats.push(rowSeats)
      }

      seats.push(sectionSeats)
    }

    return seats
  }

  // Search buses
  const handleSearch = async () => {
    if (!searchFilters.from || !searchFilters.to || !searchFilters.date) {
      showToast.error('Please fill all search fields')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Dummy bus data with proper seat layout
      const dummyBuses = [
        {
          id: 1,
          busNumber: 'BE-001',
          operator: 'SafeRun Lines',
          route: `${searchFilters.from} → ${searchFilters.to}`,
          from: searchFilters.from,
          to: searchFilters.to,
          departureTime: '08:00 AM',
          arrivalTime: '12:30 PM',
          duration: '4h 30m',
          price: 45,
          totalSeats: 36,
          availableSeats: 12,
          amenities: ['WiFi', 'AC', 'Reclining Seats', 'USB Charging'],
          rating: 4.5,
          busType: 'Standard',
          seatLayout: generateSeatLayout(36)
        },
        {
          id: 2,
          busNumber: 'BE-002',
          operator: 'Premium Travel',
          route: `${searchFilters.from} → ${searchFilters.to}`,
          from: searchFilters.from,
          to: searchFilters.to,
          departureTime: '10:30 AM',
          arrivalTime: '03:00 PM',
          duration: '4h 30m',
          price: 65,
          totalSeats: 36,
          availableSeats: 8,
          amenities: ['WiFi', 'AC', 'Reclining Seats', 'USB Charging', 'Snacks'],
          rating: 4.8,
          busType: 'Premium',
          seatLayout: generateSeatLayout(36)
        },
        {
          id: 3,
          busNumber: 'BE-003',
          operator: 'City Connect',
          route: `${searchFilters.from} → ${searchFilters.to}`,
          from: searchFilters.from,
          to: searchFilters.to,
          departureTime: '02:15 PM',
          arrivalTime: '06:45 PM',
          duration: '4h 30m',
          price: 35,
          totalSeats: 36,
          availableSeats: 15,
          amenities: ['AC', 'Reclining Seats'],
          rating: 4.2,
          busType: 'Economy',
          seatLayout: generateSeatLayout(36)
        }
      ]
      
      setAvailableBuses(dummyBuses)
      showToast.success('Buses found successfully')
      
    } catch (error) {
      console.error('Search error:', error)
      setError('Failed to search buses')
    } finally {
      setLoading(false)
    }
  }

  // Handle search input change
  const handleSearchInputChange = (e) => {
    const { name, value } = e.target
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle customer input change
  const handleCustomerInputChange = (e) => {
    const { name, value } = e.target
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle seat selection
  const handleSeatSelection = (bus) => {
    setSelectedBus(bus)
    setSelectedSeats([])
    setShowSeatModal(true)
  }

  // Handle seat click
  const handleSeatClick = (seatNumber) => {
    if (!selectedBus) return

    // Find the seat object - flatten the nested array structure
    const allSeats = selectedBus.seatLayout.flat(2)
    const seat = allSeats.find(s => s.number === seatNumber)

    if (!seat || seat.occupied) return

    // Calculate bus occupancy percentage
    const totalSeats = allSeats.length
    const occupiedSeats = allSeats.filter(s => s.occupied).length
    const occupancyPercentage = (occupiedSeats / totalSeats) * 100

    // Check if seat is already selected
    const isAlreadySelected = selectedSeats.includes(seatNumber)

    // For right side double seats
    if (seat.side === 'right' && !seat.isSingle) {
      const pairSeat = allSeats.find(s => s.number === seat.pairSeat)

      if (occupancyPercentage < 70) {
        // Bus is less than 70% full - must book both seats together
        if (isAlreadySelected) {
          // Deselecting: remove both seats from selection
          setSelectedSeats(prev => prev.filter(num =>
              num !== seatNumber && num !== seat.pairSeat
          ))
        } else {
          // Selecting: add both seats to selection
          if (pairSeat && !pairSeat.occupied) {
            setSelectedSeats(prev => [...prev, seatNumber, seat.pairSeat])
          } else {
            showToast.error('Both seats in this pair must be available to book together when bus occupancy is below 70%')
            return
          }
        }
      } else {
        // Bus is 70% or more full - can book individual seats
        if (isAlreadySelected) {
          // Deselecting: remove only this seat
          setSelectedSeats(prev => prev.filter(num => num !== seatNumber))
        } else {
          // Selecting: add only this seat
          setSelectedSeats(prev => [...prev, seatNumber])
        }
      }
    } else {
      // Left side single seats or other seats
      if (isAlreadySelected) {
        // Deselecting: remove seat from selection
        setSelectedSeats(prev => prev.filter(num => num !== seatNumber))
      } else {
        // Selecting: add seat to selection
        setSelectedSeats(prev => [...prev, seatNumber])
      }
    }
  }

  // Confirm booking
  const confirmBooking = () => {
    if (selectedSeats.length === 0) {
      showToast.error('Please select at least one seat')
      return
    }

    if (!customerDetails.name || !customerDetails.phone || !customerDetails.age || !customerDetails.gender) {
      showToast.error('Please fill in all customer details')
      return
    }

    const bookingAmount = selectedBus.price * selectedSeats.length
    const commissionEarned = (bookingAmount * bookingManager.commission / 100)

    const newBooking = {
      id: `BK${Date.now()}`,
      customerName: customerDetails.name,
      customerPhone: customerDetails.phone,
      customerEmail: customerDetails.email,
      customerAge: customerDetails.age,
      customerGender: customerDetails.gender,
      route: selectedBus.route,
      busNumber: selectedBus.busNumber,
      seatNumbers: selectedSeats,
      bookingDate: new Date().toISOString().split('T')[0],
      travelDate: searchFilters.date,
      amount: bookingAmount,
      commission: commissionEarned,
      status: 'confirmed',
      bookingTime: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      bookedByWomen: customerDetails.gender === 'female'
    }

    // Update booking manager stats
    setBookingManager(prev => ({
      ...prev,
      bookings: [...prev.bookings, newBooking],
      totalBookings: prev.totalBookings + 1,
      totalEarnings: prev.totalEarnings + commissionEarned
    }))

    // Simulate booking creation
    console.log('Booking created:', newBooking)
    console.log('Commission earned:', commissionEarned)
    console.log('Total earnings:', bookingManager.totalEarnings + commissionEarned)
    
    showToast.success(`Booking created successfully! Reference: ${newBooking.id}. Commission: ₹${commissionEarned.toFixed(2)}`)
    
    // Reset form
    setShowSeatModal(false)
    setSelectedBus(null)
    setSelectedSeats([])
    setCustomerDetails({ name: '', phone: '', email: '', age: '', gender: '' })
    setAvailableBuses([])
    setSearchFilters({ from: '', to: '', date: '', passengers: 1 })
    onClose()
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Booking</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span>Welcome, {bookingManager.name}</span>
                <span>•</span>
                <span>Commission: {bookingManager.commission}%</span>
                <span>•</span>
                <span>Total Earnings: ₹{bookingManager.totalEarnings.toFixed(2)}</span>
                <span>•</span>
                <span>Bookings: {bookingManager.totalBookings}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAnalyticsModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Search Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Search Available Buses</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From
                </label>
                <input
                  type="text"
                  name="from"
                  value={searchFilters.from}
                  onChange={handleSearchInputChange}
                  placeholder="Pickup location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <input
                  type="text"
                  name="to"
                  value={searchFilters.to}
                  onChange={handleSearchInputChange}
                  placeholder="Drop location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Travel Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={searchFilters.date}
                  onChange={handleSearchInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passengers
                </label>
                <input
                  type="number"
                  name="passengers"
                  value={searchFilters.passengers}
                  onChange={handleSearchInputChange}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search Buses
            </button>
          </div>

          {/* Available Buses */}
          {availableBuses.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Buses</h3>
              {availableBuses.map((bus) => (
                <div key={bus.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Bus Info */}
                    <div className="lg:col-span-3">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-1">
                            {bus.operator}
                          </h4>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span>{bus.rating}</span>
                            <span className="mx-2">•</span>
                            <span className="capitalize">{bus.busType}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            ₹{bus.price}
                          </div>
                          <div className="text-sm text-gray-500">
                            per person
                          </div>
                        </div>
                      </div>

                      {/* Schedule */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">
                            {bus.departureTime}
                          </div>
                          <div className="text-sm text-gray-600">
                            {bus.from}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Clock className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">{bus.duration}</span>
                          </div>
                          <div className="w-full h-px bg-gray-300"></div>
                        </div>

                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">
                            {bus.arrivalTime}
                          </div>
                          <div className="text-sm text-gray-600">
                            {bus.to}
                          </div>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {bus.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-primary"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>

                      {/* Seats Info */}
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{bus.availableSeats} of {bus.totalSeats} seats available</span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="lg:col-span-1 flex flex-col justify-between">
                      <div className="text-center mb-4">
                        <div className="text-sm text-gray-600 mb-2">
                          Available Seats
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {bus.availableSeats}
                        </div>
                      </div>

                      <button
                        onClick={() => handleSeatSelection(bus)}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-light transition-colors flex items-center justify-center gap-2"
                        disabled={bus.availableSeats === 0}
                      >
                        {bus.availableSeats === 0 ? 'Sold Out' : 'Book Seats'}
                        {bus.availableSeats > 0 && <ArrowRight className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Seat Selection Modal */}
        {showSeatModal && selectedBus && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Select Seats - {selectedBus.operator} ({selectedBus.busNumber})
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Seat Layout */}
                  <div className="lg:col-span-2">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-4">Choose Your Seats</h4>

                      {/* Seat Legend */}
                      <div className="flex justify-center mb-6">
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded border-2 border-green-300 bg-green-100 mr-2"></div>
                            <span>Available</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded border-2 border-primary bg-blue-200 mr-2 flex items-center justify-center">
                              <User className="h-3 w-3 text-primary" />
                            </div>
                            <span>Selected</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded border-2 border-gray-300 bg-gray-100 mr-2"></div>
                            <span>Occupied (Men)</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded border-2 border-pink-300 bg-pink-100 mr-2"></div>
                            <span>Occupied (Women)</span>
                          </div>
                        </div>
                      </div>

                      {/* Bus Layout */}
                      <div className="flex justify-center">
                        <div className="bg-gray-100 p-6 rounded-lg">
                          {/* Driver */}
                          <div className="text-center mb-4">
                            <div className="w-8 h-8 bg-gray-400 rounded mx-auto mb-2"></div>
                            <span className="text-xs text-gray-600">Driver</span>
                          </div>

                          {/* Seats */}
                          <div className="flex space-x-8">
                            {selectedBus.seatLayout.map((section, sectionIndex) => (
                              <div key={sectionIndex} className="flex-1 border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                                <div className="text-center text-sm font-medium text-gray-700 mb-4">
                                  {section[0][0].section === 'lower' ? 'LOWER BERTH' : 'UPPER BERTH'}
                                </div>

                                {/* Seat Layout */}
                                <div className="space-y-2">
                                  {section.map((row, rowIndex) => (
                                    <div key={rowIndex} className="flex justify-center space-x-8">
                                      {/* Left side - single seat */}
                                      <div className="flex flex-col">
                                        <button
                                          key={row[0].number}
                                          onClick={() => {
                                            if (!row[0].occupied) {
                                              handleSeatClick(row[0].number)
                                            }
                                          }}
                                          className={`w-8 h-16 rounded border-2 text-xs font-medium flex items-center justify-center transition-colors ${
                                            row[0].occupied
                                              ? row[0].bookedByWomen
                                                ? 'border-pink-300 bg-pink-100 text-pink-600 cursor-not-allowed'
                                                : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                              : selectedSeats.includes(row[0].number)
                                                ? 'border-primary bg-blue-200 text-primary shadow-md'
                                                : 'border-green-300 bg-green-100 text-green-800 hover:bg-green-200 hover:border-green-400'
                                          }`}
                                          disabled={row[0].occupied}
                                          title={`Seat ${row[0].number} - Left Single`}
                                        >
                                          {selectedSeats.includes(row[0].number) ? (
                                            <User className="h-4 w-4" />
                                          ) : (
                                            section[0][0].section === 'lower'
                                              ? ['A', 'C', 'E', 'G', 'I', 'K'][rowIndex]
                                              : ['B', 'D', 'F', 'H', 'J', 'L'][rowIndex]
                                          )}
                                        </button>
                                      </div>

                                      {/* Right side - double seat pair */}
                                      <div className="flex space-x-1">
                                        <button
                                          key={row[1].number}
                                          onClick={() => {
                                            if (!row[1].occupied) {
                                              handleSeatClick(row[1].number)
                                            }
                                          }}
                                          className={`w-8 h-16 rounded border-2 text-xs font-medium flex items-center justify-center transition-colors ${
                                            row[1].occupied
                                              ? row[1].bookedByWomen
                                                ? 'border-pink-300 bg-pink-100 text-pink-600 cursor-not-allowed'
                                                : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                              : selectedSeats.includes(row[1].number)
                                                ? 'border-primary bg-blue-200 text-primary shadow-md'
                                                : 'border-green-300 bg-green-100 text-green-800 hover:bg-green-200 hover:border-green-400'
                                          }`}
                                          disabled={row[1].occupied}
                                          title={`Seat ${row[1].number} - Right Double`}
                                        >
                                          {selectedSeats.includes(row[1].number) ? (
                                            <User className="h-4 w-4" />
                                          ) : (
                                            row[1].number
                                          )}
                                        </button>
                                        <button
                                          key={row[2].number}
                                          onClick={() => {
                                            if (!row[2].occupied) {
                                              handleSeatClick(row[2].number)
                                            }
                                          }}
                                          className={`w-8 h-16 rounded border-2 text-xs font-medium flex items-center justify-center transition-colors ${
                                            row[2].occupied
                                              ? row[2].bookedByWomen
                                                ? 'border-pink-300 bg-pink-100 text-pink-600 cursor-not-allowed'
                                                : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                              : selectedSeats.includes(row[2].number)
                                                ? 'border-primary bg-blue-200 text-primary shadow-md'
                                                : 'border-green-300 bg-green-100 text-green-800 hover:bg-green-200 hover:border-green-400'
                                          }`}
                                          disabled={row[2].occupied}
                                          title={`Seat ${row[2].number} - Right Double`}
                                        >
                                          {selectedSeats.includes(row[2].number) ? (
                                            <User className="h-4 w-4" />
                                          ) : (
                                            row[2].number
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 text-center text-sm text-gray-600">
                        <div>Selected Seats: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</div>
                        <div className="mt-2 text-xs">
                          Bus Occupancy: {selectedBus ? Math.round((selectedBus.seatLayout.flat(2).filter(s => s.occupied).length / selectedBus.seatLayout.flat(2).length) * 100) : 0}%
                          {selectedBus && (selectedBus.seatLayout.flat(2).filter(s => s.occupied).length / selectedBus.seatLayout.flat(2).length) * 100 < 70 && (
                            <span className="text-orange-600 ml-2">• Right side seats must be booked in pairs</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details & Summary */}
                  <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h4 className="text-lg font-semibold mb-4">Customer Details</h4>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={customerDetails.name}
                            onChange={handleCustomerInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-primary"
                            placeholder="Enter full name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={customerDetails.phone}
                            onChange={handleCustomerInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-primary"
                            placeholder="Enter phone number"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={customerDetails.email}
                            onChange={handleCustomerInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-primary"
                            placeholder="Enter email address"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Age *
                          </label>
                          <input
                            type="number"
                            name="age"
                            value={customerDetails.age}
                            onChange={handleCustomerInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-primary"
                            placeholder="Enter age"
                            min="1"
                            max="120"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gender *
                          </label>
                          <select
                            name="gender"
                            value={customerDetails.gender}
                            onChange={handleCustomerInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-primary"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Booking Summary */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-4">Booking Summary</h4>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Route:</span>
                          <span className="font-medium">{selectedBus.route}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Bus:</span>
                          <span className="font-medium">{selectedBus.busNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">{searchFilters.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">{selectedBus.departureTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Selected Seats:</span>
                          <span className="font-medium">{selectedSeats.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price per seat:</span>
                          <span className="font-medium">₹{selectedBus.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Commission ({bookingManager.commission}%):</span>
                          <span className="font-medium text-green-600">₹{((selectedBus.price * selectedSeats.length) * bookingManager.commission / 100).toFixed(2)}</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total Amount:</span>
                            <span className="text-primary">₹{selectedBus.price * selectedSeats.length}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 space-y-3">
                        <button
                          onClick={confirmBooking}
                          className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirm Booking
                        </button>
                        <button
                          onClick={() => setShowSeatModal(false)}
                          className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Modal */}
        <BookingAnalytics
          bookingManager={bookingManager}
          isOpen={showAnalyticsModal}
          onClose={() => setShowAnalyticsModal(false)}
        />
      </div>
    </div>
  )
}

export default CreateBookingModal