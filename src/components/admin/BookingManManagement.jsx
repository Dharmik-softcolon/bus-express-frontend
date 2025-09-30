import { useState } from 'react'
import { Plus, Edit, Trash2, Users, Calendar, Clock, MapPin, DollarSign, CheckCircle, XCircle, Search, Bus, Star, ArrowRight, Filter, User } from 'lucide-react'

const BookingManManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBookingMan, setEditingBookingMan] = useState(null)
  const [activeTab, setActiveTab] = useState('booking')
  const [showSeatModal, setShowSeatModal] = useState(false)
  const [selectedBus, setSelectedBus] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    gender: ''
  })

  const [bookingMen, setBookingMen] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice.johnson@busexpress.com',
      phone: '+1-555-0201',
      commission: 5.0,
      totalBookings: 45,
      totalEarnings: 225.00,
      status: 'active',
      bookings: [
        {
          id: 'BK001',
          customerName: 'John Doe',
          customerPhone: '+1-555-1001',
          route: 'New York → Boston',
          seatNumber: '12A',
          bookingDate: '2024-01-15',
          travelDate: '2024-01-20',
          amount: 45.00,
          status: 'confirmed',
          bookingTime: '10:30 AM'
        },
        {
          id: 'BK002',
          customerName: 'Jane Smith',
          customerPhone: '+1-555-1002',
          route: 'Los Angeles → San Francisco',
          seatNumber: '8B',
          bookingDate: '2024-01-15',
          travelDate: '2024-01-22',
          amount: 65.00,
          status: 'cancelled',
          bookingTime: '02:15 PM'
        }
      ]
    },
    {
      id: 2,
      name: 'Bob Wilson',
      email: 'bob.wilson@busexpress.com',
      phone: '+1-555-0202',
      commission: 4.5,
      totalBookings: 32,
      totalEarnings: 144.00,
      status: 'active',
      bookings: [
        {
          id: 'BK003',
          customerName: 'Mike Brown',
          customerPhone: '+1-555-1003',
          route: 'Chicago → Detroit',
          seatNumber: '15C',
          bookingDate: '2024-01-14',
          travelDate: '2024-01-18',
          amount: 35.00,
          status: 'confirmed',
          bookingTime: '09:45 AM'
        }
      ]
    }
  ])

  const [searchFilters, setSearchFilters] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1
  })

  const [availableBuses, setAvailableBuses] = useState([
    {
      id: 1,
      busNumber: 'BE-001',
      operator: 'Express Bus Lines',
      route: 'New York → Boston',
      from: 'New York',
      to: 'Boston',
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
      route: 'New York → Boston',
      from: 'New York',
      to: 'Boston',
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
      route: 'Los Angeles → San Francisco',
      from: 'Los Angeles',
      to: 'San Francisco',
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
  ])

  // Generate seat layout for buses (36 seats: 2 sections, 18 seats each)
  function generateSeatLayout(totalSeats = 36) {
    console.log('Generating new seat layout...')
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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    commission: '',
    status: 'active'
  })

  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerPhone: '',
    route: '',
    seatNumber: '',
    travelDate: '',
    amount: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCustomerInputChange = (e) => {
    const { name, value } = e.target
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const searchBuses = () => {
    // Filter buses based on search criteria
    return availableBuses.filter(bus => {
      if (searchFilters.from && !bus.from.toLowerCase().includes(searchFilters.from.toLowerCase())) return false
      if (searchFilters.to && !bus.to.toLowerCase().includes(searchFilters.to.toLowerCase())) return false
      return true
    })
  }

  const handleSeatSelection = (bus) => {
    console.log('Opening seat modal for bus:', bus.busNumber)
    setSelectedBus(bus)
    setSelectedSeats([])
    setShowSeatModal(true)
  }

  const handleSeatClick = (seatNumber) => {
    console.log('handleSeatClick called with:', seatNumber)

    if (!selectedBus) {
      console.log('No selectedBus, returning')
      return
    }

    // Find the seat object - flatten the nested array structure
    const allSeats = selectedBus.seatLayout.flat(2)
    console.log('Looking for seat number:', seatNumber)

    const seat = allSeats.find(s => s.number === seatNumber)
    console.log('Found seat:', seat)

    if (!seat) {
      console.log('Seat not found, returning')
      return
    }

    if (seat.occupied) {
      console.log('Seat is occupied, returning')
      return
    }

    // Calculate bus occupancy percentage
    const totalSeats = allSeats.length
    const occupiedSeats = allSeats.filter(s => s.occupied).length
    const occupancyPercentage = (occupiedSeats / totalSeats) * 100

    console.log('Occupancy percentage:', occupancyPercentage)

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
            alert('Both seats in this pair must be available to book together when bus occupancy is below 70%')
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

  const confirmBooking = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat')
      return
    }

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
      amount: selectedBus.price * selectedSeats.length,
      status: 'confirmed',
      bookingTime: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      bookedByWomen: customerDetails.gender === 'female'
    }

    // Add booking to the first booking man (for demo)
    const bookingManId = 1
    setBookingMen(prev => prev.map(bm =>
        bm.id === bookingManId
            ? {
              ...bm,
              bookings: [...bm.bookings, newBooking],
              totalBookings: bm.totalBookings + 1,
              totalEarnings: bm.totalEarnings + (newBooking.amount * bm.commission / 100)
            }
            : bm
    ))

    // Update bus seat availability
    setAvailableBuses(prev => prev.map(bus =>
        bus.id === selectedBus.id
            ? {
              ...bus,
              availableSeats: bus.availableSeats - selectedSeats.length,
              seatLayout: bus.seatLayout.map(section =>
                  section.map(position =>
                      position.map(seat =>
                          selectedSeats.includes(seat.number)
                              ? { ...seat, occupied: true, bookedByWomen: customerDetails.gender === 'female' }
                              : seat
                      )
                  )
              )
            }
            : bus
    ))

    // Reset form
    setShowSeatModal(false)
    setSelectedBus(null)
    setSelectedSeats([])
    setCustomerDetails({
      name: '',
      phone: '',
      email: '',
      age: '',
      gender: ''
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingBookingMan) {
      setBookingMen(prev => prev.map(bm =>
          bm.id === editingBookingMan.id ? { ...bm, ...formData } : bm
      ))
    } else {
      const newBookingMan = {
        ...formData,
        id: bookingMen.length + 1,
        totalBookings: 0,
        totalEarnings: 0,
        bookings: []
      }
      setBookingMen(prev => [...prev, newBookingMan])
    }
    setShowAddModal(false)
    setEditingBookingMan(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      commission: '',
      status: 'active'
    })
  }

  const handleEdit = (bookingMan) => {
    setEditingBookingMan(bookingMan)
    setFormData(bookingMan)
    setShowAddModal(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this booking man?')) {
      setBookingMen(prev => prev.filter(bm => bm.id !== id))
    }
  }

  const createBooking = (bookingManId) => {
    const newBooking = {
      id: `BK${Date.now()}`,
      ...bookingForm,
      bookingDate: new Date().toISOString().split('T')[0],
      bookingTime: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      status: 'confirmed'
    }

    setBookingMen(prev => prev.map(bm =>
        bm.id === bookingManId
            ? {
              ...bm,
              bookings: [...bm.bookings, newBooking],
              totalBookings: bm.totalBookings + 1,
              totalEarnings: bm.totalEarnings + (parseFloat(bookingForm.amount) * bm.commission / 100)
            }
            : bm
    ))

    setBookingForm({
      customerName: '',
      customerPhone: '',
      route: '',
      seatNumber: '',
      travelDate: '',
      amount: ''
    })
  }

  const cancelBooking = (bookingManId, bookingId) => {
    setBookingMen(prev => prev.map(bm =>
        bm.id === bookingManId
            ? {
              ...bm,
              bookings: bm.bookings.map(booking =>
                  booking.id === bookingId
                      ? { ...booking, status: 'cancelled' }
                      : booking
              )
            }
            : bm
    ))
  }

  const updateBooking = (bookingManId, bookingId, updates) => {
    setBookingMen(prev => prev.map(bm =>
        bm.id === bookingManId
            ? {
              ...bm,
              bookings: bm.bookings.map(booking =>
                  booking.id === bookingId
                      ? { ...booking, ...updates }
                      : booking
              )
            }
            : bm
    ))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderBookingInterface = () => (
      <div className="space-y-6">
        {/* Search Section */}
        <div className="card">
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
                  className="input-field"
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
                  className="input-field"
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
                  className="input-field"
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
                  className="input-field"
              />
            </div>
          </div>
          <button
              onClick={searchBuses}
              className="btn-primary mt-4 flex items-center"
          >
            <Search className="h-4 w-4 mr-2" />
            Search Buses
          </button>
        </div>

        {/* Available Buses */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Available Buses</h3>
          {searchBuses().map((bus) => (
              <div key={bus.id} className="card hover:shadow-lg transition-shadow">
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
                        <div className="text-2xl font-bold text-blue-600">
                          ${bus.price}
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
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
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
                        className="btn-primary w-full flex items-center justify-center"
                        disabled={bus.availableSeats === 0}
                    >
                      {bus.availableSeats === 0 ? 'Sold Out' : 'Book Seats'}
                      {bus.availableSeats > 0 && <ArrowRight className="h-4 w-4 ml-2" />}
                    </button>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
  )

  const renderBookingMenList = () => (
      <div className="space-y-4">
        {bookingMen.map((bookingMan) => (
            <div key={bookingMan.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{bookingMan.name}</h3>
                  <p className="text-gray-600">{bookingMan.email}</p>
                  <p className="text-gray-600">{bookingMan.phone}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      bookingMan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                {bookingMan.status}
              </span>
                </div>
                <div className="flex space-x-2">
                  <button
                      onClick={() => handleEdit(bookingMan)}
                      className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                      onClick={() => handleDelete(bookingMan.id)}
                      className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{bookingMan.commission}%</div>
                  <div className="text-sm text-gray-600">Commission</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{bookingMan.totalBookings}</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">${bookingMan.totalEarnings}</div>
                  <div className="text-sm text-gray-600">Total Earnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {bookingMan.bookings.filter(b => b.status === 'confirmed').length}
                  </div>
                  <div className="text-sm text-gray-600">Active Bookings</div>
                </div>
              </div>
            </div>
        ))}
      </div>
  )

  const renderBookingManagement = () => {
    const currentBookingMan = bookingMen[0] // For demo, using first booking man

    return (
        <div className="space-y-6">
          {/* Booking Man Info */}
          <div className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{currentBookingMan.name}</h3>
                <p className="text-gray-600">{currentBookingMan.email}</p>
                <p className="text-gray-600">{currentBookingMan.phone}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    currentBookingMan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                {currentBookingMan.status}
              </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{currentBookingMan.commission}%</div>
                <div className="text-sm text-gray-600">Commission Rate</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{currentBookingMan.totalBookings}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {currentBookingMan.bookings.filter(b => b.status === 'confirmed').length}
                </div>
                <div className="text-sm text-gray-600">Confirmed</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {currentBookingMan.bookings.filter(b => b.status === 'cancelled').length}
                </div>
                <div className="text-sm text-gray-600">Cancelled</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">${currentBookingMan.totalEarnings.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Total Earnings</div>
              </div>
            </div>
          </div>

          {/* Booking Management */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">My Bookings</h3>

            {/* Filter Options */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <select className="input-field">
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Pending</option>
              </select>
              <select className="input-field">
                <option value="all">All Routes</option>
                <option value="New York → Boston">New York → Boston</option>
                <option value="Los Angeles → San Francisco">Los Angeles → San Francisco</option>
                <option value="Chicago → Detroit">Chicago → Detroit</option>
              </select>
              <input type="date" className="input-field" placeholder="From Date" />
              <input type="date" className="input-field" placeholder="To Date" />
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
              {currentBookingMan.bookings.map((booking) => (
                  <div key={booking.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-lg">{booking.customerName}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        </div>
                        <p className="text-sm text-gray-600">Booking ID: {booking.id}</p>
                      </div>
                      <div className="flex space-x-2">
                        {booking.status === 'confirmed' && (
                            <>
                              <button
                                  onClick={() => {
                                    // Edit booking functionality
                                    alert('Edit booking functionality would be implemented here')
                                  }}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Edit Booking"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                  onClick={() => cancelBooking(currentBookingMan.id, booking.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Cancel Booking"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium">{booking.route}</div>
                          <div className="text-gray-600">Bus: {booking.busNumber}</div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium">
                            {Array.isArray(booking.seatNumbers) ? booking.seatNumbers.join(', ') : booking.seatNumber}
                          </div>
                          <div className="text-gray-600">Seat{Array.isArray(booking.seatNumbers) && booking.seatNumbers.length > 1 ? 's' : ''}</div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium">{booking.travelDate}</div>
                          <div className="text-gray-600">Travel Date</div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium">${booking.amount}</div>
                          <div className="text-gray-600">
                            Commission: ${(booking.amount * currentBookingMan.commission / 100).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Booked on {booking.bookingDate} at {booking.bookingTime}</span>
                        {booking.customerPhone && (
                            <>
                              <span className="mx-2">•</span>
                              <span>Phone: {booking.customerPhone}</span>
                            </>
                        )}
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
    )
  }

  const renderReports = () => {
    const currentBookingMan = bookingMen[0] // For demo, using first booking man
    const confirmedBookings = currentBookingMan.bookings.filter(b => b.status === 'confirmed')
    const cancelledBookings = currentBookingMan.bookings.filter(b => b.status === 'cancelled')
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + parseFloat(b.amount), 0)
    const totalCommission = currentBookingMan.totalEarnings

    // Calculate monthly earnings (mock data)
    const monthlyEarnings = [
      { month: 'Jan', earnings: 180.50, bookings: 12 },
      { month: 'Feb', earnings: 225.75, bookings: 15 },
      { month: 'Mar', earnings: 195.25, bookings: 13 },
      { month: 'Apr', earnings: 240.00, bookings: 16 },
      { month: 'May', earnings: 210.30, bookings: 14 },
      { month: 'Jun', earnings: 275.80, bookings: 18 }
    ]

    // Calculate route-wise performance
    const routePerformance = confirmedBookings.reduce((acc, booking) => {
      const route = booking.route
      if (!acc[route]) {
        acc[route] = { bookings: 0, revenue: 0, commission: 0 }
      }
      acc[route].bookings += 1
      acc[route].revenue += parseFloat(booking.amount)
      acc[route].commission += (parseFloat(booking.amount) * currentBookingMan.commission / 100)
      return acc
    }, {})

    return (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{currentBookingMan.totalBookings}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
              <div className="text-xs text-gray-500 mt-1">
                {confirmedBookings.length} confirmed, {cancelledBookings.length} cancelled
              </div>
            </div>

            <div className="card text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">${totalRevenue.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-xs text-gray-500 mt-1">
                From {confirmedBookings.length} confirmed bookings
              </div>
            </div>

            <div className="card text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">${totalCommission.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Total Commission</div>
              <div className="text-xs text-gray-500 mt-1">
                {currentBookingMan.commission}% commission rate
              </div>
            </div>

            <div className="card text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {totalRevenue > 0 ? ((totalCommission / totalRevenue) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-gray-600">Commission Rate</div>
              <div className="text-xs text-gray-500 mt-1">
                Effective rate
              </div>
            </div>
          </div>

          {/* Monthly Earnings Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Monthly Earnings Trend</h3>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {monthlyEarnings.map((month) => (
                  <div key={month.month} className="text-center">
                    <div className="text-sm text-gray-600 mb-1">{month.month}</div>
                    <div className="text-lg font-semibold text-green-600">${month.earnings}</div>
                    <div className="text-xs text-gray-500">{month.bookings} bookings</div>
                  </div>
              ))}
            </div>
          </div>

          {/* Route Performance */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Route Performance</h3>
            <div className="space-y-4">
              {Object.entries(routePerformance).map(([route, data]) => (
                  <div key={route} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{route}</h4>
                        <p className="text-sm text-gray-600">{data.bookings} bookings</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">${data.revenue.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">Commission: ${data.commission.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(data.revenue / totalRevenue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Recent Booking Activity</h3>
            <div className="space-y-3">
              {currentBookingMan.bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <div className="font-medium">{booking.customerName}</div>
                        <div className="text-sm text-gray-600">{booking.route}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${booking.amount}</div>
                      <div className="text-sm text-gray-600">
                        Commission: ${(booking.amount * currentBookingMan.commission / 100).toFixed(2)}
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Booking Value:</span>
                  <span className="font-medium">
                  ${confirmedBookings.length > 0 ? (totalRevenue / confirmedBookings.length).toFixed(2) : 0}
                </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-medium">
                  {currentBookingMan.totalBookings > 0 ?
                      ((confirmedBookings.length / currentBookingMan.totalBookings) * 100).toFixed(1) : 0}%
                </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancellation Rate:</span>
                  <span className="font-medium">
                  {currentBookingMan.totalBookings > 0 ?
                      ((cancelledBookings.length / currentBookingMan.totalBookings) * 100).toFixed(1) : 0}%
                </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Commission Rate:</span>
                  <span className="font-medium">{currentBookingMan.commission}%</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="btn-primary w-full">
                  Export Earnings Report
                </button>
                <button className="btn-secondary w-full">
                  View Detailed Analytics
                </button>
                <button className="btn-outline w-full">
                  Download Commission Statement
                </button>
              </div>
            </div>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <p className="text-gray-600 text-sm sm:text-base">
                  Book seats for customers, manage bookings, and track earnings
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-600">Welcome, {bookingMen[0]?.name}</div>
                  <div className="text-xs text-gray-500">Commission: {bookingMen[0]?.commission}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'booking', name: 'Book Seats' },
                { id: 'bookings', name: 'My Bookings' },
                { id: 'reports', name: 'Earnings Analytics' }
              ].map((tab) => (
                  <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                          activeTab === tab.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <span className="hidden sm:inline">{tab.name}</span>
                    <span className="sm:hidden">
                      {tab.id === 'booking' ? 'Book' :
                       tab.id === 'bookings' ? 'Bookings' :
                       tab.id === 'reports' ? 'Reports' : tab.name}
                    </span>
                  </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {activeTab === 'booking' && renderBookingInterface()}
          {activeTab === 'bookings' && renderBookingManagement()}
          {activeTab === 'reports' && renderReports()}

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
                        <div className="card">
                          <h4 className="text-lg font-semibold mb-4">Choose Your Seats</h4>

                          {/* Seat Legend */}
                          <div className="flex justify-center mb-6">
                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded border-2 border-green-300 bg-green-100 mr-2"></div>
                                <span>Available</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded border-2 border-blue-500 bg-blue-200 mr-2 flex items-center justify-center">
                                  <User className="h-3 w-3 text-blue-800" />
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

                          {/* Test Buttons */}
                          <div className="text-center mb-4 space-x-2">
                            <button
                                onClick={() => {
                                  setSelectedSeats([1, 2]) // Test with seats 1 and 2
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded text-sm"
                            >
                              Test: Select Seats 1,2
                            </button>
                            <button
                                onClick={() => {
                                  setSelectedSeats([]) // Clear selection
                                }}
                                className="px-4 py-2 bg-gray-500 text-white rounded text-sm"
                            >
                              Clear Selection
                            </button>
                            <button
                                onClick={() => {
                                  setSelectedSeats([1, 2, 3, 4, 5, 6]) // Test with more seats
                                }}
                                className="px-4 py-2 bg-purple-500 text-white rounded text-sm"
                            >
                              Test: Select 1-6
                            </button>
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

                                      {/* Driver Cabin */}
                                      <div className="text-center mb-4">
                                        <div className="w-16 h-8 bg-gray-400 rounded mx-auto mb-2 flex items-center justify-center">
                                          <span className="text-xs text-white">Driver Cabin</span>
                                        </div>
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
                                                                ? 'border-blue-500 bg-blue-200 text-blue-800 shadow-md'
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
                                                                ? 'border-blue-500 bg-blue-200 text-blue-800 shadow-md'
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
                                                                ? 'border-blue-500 bg-blue-200 text-blue-800 shadow-md'
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
                        <div className="card mb-6">
                          <h4 className="text-lg font-semibold mb-4">Customer Details</h4>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                              </label>
                              <input
                                  type="text"
                                  name="name"
                                  value={customerDetails.name}
                                  onChange={handleCustomerInputChange}
                                  className="input-field"
                                  placeholder="Enter full name"
                                  required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                              </label>
                              <input
                                  type="tel"
                                  name="phone"
                                  value={customerDetails.phone}
                                  onChange={handleCustomerInputChange}
                                  className="input-field"
                                  placeholder="Enter phone number"
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
                                  value={customerDetails.email}
                                  onChange={handleCustomerInputChange}
                                  className="input-field"
                                  placeholder="Enter email"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Age
                                </label>
                                <input
                                    type="number"
                                    name="age"
                                    value={customerDetails.age}
                                    onChange={handleCustomerInputChange}
                                    className="input-field"
                                    placeholder="Age"
                                    min="1"
                                    max="120"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Gender
                                </label>
                                <select
                                    name="gender"
                                    value={customerDetails.gender}
                                    onChange={handleCustomerInputChange}
                                    className="input-field"
                                >
                                  <option value="">Select</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Booking Summary */}
                        <div className="card">
                          <h4 className="text-lg font-semibold mb-4">Booking Summary</h4>

                          <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                              <span>Route:</span>
                              <span className="text-sm">{selectedBus.route}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Bus:</span>
                              <span className="text-sm">{selectedBus.busNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Date:</span>
                              <span className="text-sm">{searchFilters.date}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Seats ({selectedSeats.length}):</span>
                              <span className="text-sm">{selectedSeats.join(', ')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Base Fare ({selectedSeats.length} × ${selectedBus.price})</span>
                              <span>${selectedBus.price * selectedSeats.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Service Fee</span>
                              <span>$2.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Taxes</span>
                              <span>$3.50</span>
                            </div>
                            <div className="border-t pt-3">
                              <div className="flex justify-between font-semibold text-lg">
                                <span>Total</span>
                                <span>${(selectedBus.price * selectedSeats.length + 5.5).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <button
                                onClick={confirmBooking}
                                className="btn-primary w-full"
                                disabled={selectedSeats.length === 0 || !customerDetails.name || !customerDetails.phone}
                            >
                              Confirm Booking
                            </button>
                            <button
                                onClick={() => {
                                  setShowSeatModal(false)
                                  setSelectedBus(null)
                                  setSelectedSeats([])
                                }}
                                className="btn-secondary w-full"
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

          {/* Add/Edit Modal */}
          {showAddModal && (
              <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                  <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {editingBookingMan ? 'Edit Booking Man' : 'Add New Booking Man'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
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
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                              setShowAddModal(false)
                              setEditingBookingMan(null)
                            }}
                            className="btn-secondary"
                        >
                          Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                        >
                          {editingBookingMan ? 'Update' : 'Add'} Booking Man
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

export default BookingManManagement