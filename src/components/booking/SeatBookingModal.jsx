import { useState, useEffect } from 'react'
import { 
  X, 
  User, 
  Users, 
  Clock, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  Info,
  Wifi,
  Coffee,
  Battery,
  Droplets,
  Star,
  ArrowRight,
  ArrowLeft,
  Bus,
  Calendar,
  DollarSign
} from 'lucide-react'
import { showToast } from '../../utils/toast'

const SeatBookingModal = ({ 
  isOpen, 
  onClose, 
  bus, 
  trip, 
  onConfirmBooking,
  loading = false 
}) => {
  const [selectedSeats, setSelectedSeats] = useState([])
  const [passengerDetails, setPassengerDetails] = useState([])
  const [currentStep, setCurrentStep] = useState(1) // 1: Seat Selection, 2: Passenger Details, 3: Review
  const [seatLayout, setSeatLayout] = useState([])
  const [busOccupancy, setBusOccupancy] = useState(0)

  // Initialize passenger details when seats are selected
  useEffect(() => {
    if (selectedSeats.length > 0) {
      const newPassengerDetails = selectedSeats.map((seatNumber, index) => ({
        seatNumber,
        passengerName: '',
        passengerAge: '',
        passengerGender: '',
        passengerPhone: '',
        passengerEmail: '',
        id: `passenger_${index}`
      }))
      setPassengerDetails(newPassengerDetails)
    }
  }, [selectedSeats])

  // Generate seat layout based on bus type
  useEffect(() => {
    if (bus && trip) {
      generateSeatLayout()
    }
  }, [bus, trip])

  const generateSeatLayout = () => {
    const totalSeats = bus.totalSeats || 36
    const seats = []
    
    // Generate seat layout based on bus type
    if (bus.type === 'Sleeper' || bus.type === 'Semi-Sleeper') {
      // Sleeper bus layout: 2 sections (Lower and Upper berth)
      const seatsPerSection = Math.ceil(totalSeats / 2)
      
      for (let section = 0; section < 2; section++) {
        const sectionSeats = []
        const rowsPerSection = Math.ceil(seatsPerSection / 3) // 3 seats per row
        
        for (let row = 0; row < rowsPerSection; row++) {
          const rowSeats = []
          
          // Left side - single seat
          const leftSeatNumber = section === 0 ? row * 3 + 1 : row * 3 + 2
          if (leftSeatNumber <= totalSeats) {
            rowSeats.push({
              number: leftSeatNumber,
              side: 'left',
              berth: 'single',
              occupied: Math.random() > 0.7, // Mock occupied status
              selected: false,
              isSingle: true,
              bookedByWomen: false,
              section: section === 0 ? 'lower' : 'upper',
              row: row + 1
            })
          }
          
          // Right side - double seat pair
          const rightSeat1Number = section === 0 ? row * 3 + 2 : row * 3 + 3
          const rightSeat2Number = section === 0 ? row * 3 + 3 : row * 3 + 4
          
          if (rightSeat1Number <= totalSeats) {
            rowSeats.push({
              number: rightSeat1Number,
              side: 'right',
              berth: 'double',
              occupied: Math.random() > 0.7,
              selected: false,
              isSingle: false,
              pairSeat: rightSeat2Number,
              bookedByWomen: false,
              section: section === 0 ? 'lower' : 'upper',
              row: row + 1
            })
          }
          
          if (rightSeat2Number <= totalSeats) {
            rowSeats.push({
              number: rightSeat2Number,
              side: 'right',
              berth: 'double',
              occupied: Math.random() > 0.7,
              selected: false,
              isSingle: false,
              pairSeat: rightSeat1Number,
              bookedByWomen: false,
              section: section === 0 ? 'lower' : 'upper',
              row: row + 1
            })
          }
          
          sectionSeats.push(rowSeats)
        }
        
        seats.push(sectionSeats)
      }
    } else {
      // Regular bus layout: 2+2 seating
      const rows = Math.ceil(totalSeats / 4)
      
      for (let row = 0; row < rows; row++) {
        const rowSeats = []
        
        // Left side - 2 seats
        for (let col = 0; col < 2; col++) {
          const seatNumber = row * 4 + col + 1
          if (seatNumber <= totalSeats) {
            rowSeats.push({
              number: seatNumber,
              side: 'left',
              berth: 'regular',
              occupied: Math.random() > 0.7,
              selected: false,
              isSingle: false,
              bookedByWomen: false,
              section: 'regular',
              row: row + 1
            })
          }
        }
        
        // Right side - 2 seats
        for (let col = 0; col < 2; col++) {
          const seatNumber = row * 4 + col + 3
          if (seatNumber <= totalSeats) {
            rowSeats.push({
              number: seatNumber,
              side: 'right',
              berth: 'regular',
              occupied: Math.random() > 0.7,
              selected: false,
              isSingle: false,
              bookedByWomen: false,
              section: 'regular',
              row: row + 1
            })
          }
        }
        
        seats.push(rowSeats)
      }
    }
    
    setSeatLayout(seats)
    
    // Calculate occupancy
    const allSeats = seats.flat(2)
    const occupiedSeats = allSeats.filter(seat => seat.occupied).length
    setBusOccupancy(Math.round((occupiedSeats / allSeats.length) * 100))
  }

  const handleSeatClick = (seatNumber) => {
    const allSeats = seatLayout.flat(2)
    const seat = allSeats.find(s => s.number === seatNumber)
    
    if (!seat || seat.occupied) return
    
    const isAlreadySelected = selectedSeats.includes(seatNumber)
    
    if (isAlreadySelected) {
      setSelectedSeats(prev => prev.filter(num => num !== seatNumber))
    } else {
      // Check if we can select this seat based on bus occupancy and seat type
      if (seat.side === 'right' && !seat.isSingle && busOccupancy < 70) {
        // For right side double seats when bus is less than 70% full, must book both seats
        const pairSeat = allSeats.find(s => s.number === seat.pairSeat)
        if (pairSeat && !pairSeat.occupied) {
          setSelectedSeats(prev => [...prev, seatNumber, seat.pairSeat])
        } else {
          showToast.error('Both seats in this pair must be available to book together when bus occupancy is below 70%')
          return
        }
      } else {
        setSelectedSeats(prev => [...prev, seatNumber])
      }
    }
  }

  const handlePassengerInputChange = (index, field, value) => {
    setPassengerDetails(prev => prev.map((passenger, i) => 
      i === index ? { ...passenger, [field]: value } : passenger
    ))
  }

  const validatePassengerDetails = () => {
    for (const passenger of passengerDetails) {
      if (!passenger.passengerName.trim()) {
        showToast.error('Please enter passenger name for all selected seats')
        return false
      }
      if (!passenger.passengerAge || passenger.passengerAge < 1 || passenger.passengerAge > 120) {
        showToast.error('Please enter valid age for all passengers')
        return false
      }
      if (!passenger.passengerGender) {
        showToast.error('Please select gender for all passengers')
        return false
      }
      if (!passenger.passengerPhone.trim()) {
        showToast.error('Please enter phone number for all passengers')
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (selectedSeats.length === 0) {
        showToast.error('Please select at least one seat')
        return
      }
      setCurrentStep(2)
    } else if (currentStep === 2) {
      if (validatePassengerDetails()) {
        setCurrentStep(3)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleConfirmBooking = () => {
    if (!validatePassengerDetails()) return
    
    const bookingData = {
      trip: trip._id,
      seats: passengerDetails.map(passenger => ({
        seatNumber: passenger.seatNumber,
        passengerName: passenger.passengerName,
        passengerAge: parseInt(passenger.passengerAge),
        passengerGender: passenger.passengerGender,
        passengerPhone: passenger.passengerPhone
      })),
      boardingPoint: trip.pickupPoints?.[0]?.name || 'Main Terminal',
      droppingPoint: trip.dropPoints?.[trip.dropPoints.length - 1]?.name || 'Destination',
      paymentMethod: 'UPI'
    }
    
    onConfirmBooking(bookingData)
  }

  const calculateTotalAmount = () => {
    const baseAmount = (trip.fare || 0) * selectedSeats.length
    const serviceFee = 50
    const taxes = Math.round(baseAmount * 0.12) // 12% GST
    return baseAmount + serviceFee + taxes
  }

  const getSeatStatusColor = (seat) => {
    if (seat.occupied) {
      return seat.bookedByWomen 
        ? 'border-pink-300 bg-pink-100 text-pink-600 cursor-not-allowed'
        : 'border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed'
    }
    if (selectedSeats.includes(seat.number)) {
      return 'border-primary bg-blue-200 text-blue-800 shadow-md'
    }
    return 'border-green-300 bg-green-100 text-green-800 hover:bg-green-200 hover:border-green-400'
  }

  const getSeatIcon = (seat) => {
    if (selectedSeats.includes(seat.number)) {
      return <User className="h-4 w-4" />
    }
    if (seat.occupied) {
      return seat.bookedByWomen ? '♀' : '♂'
    }
    return seat.number
  }

  if (!isOpen || !bus || !trip) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-6 border w-full max-w-7xl shadow-lg rounded-lg bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-600">Book Seats</h3>
            <p className="text-gray-600">{bus.busName} ({bus.busNumber})</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: 'Select Seats', icon: Users },
              { step: 2, title: 'Passenger Details', icon: User },
              { step: 3, title: 'Review & Pay', icon: CreditCard }
            ].map(({ step, title, icon: Icon }) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step 
                    ? 'border-primary bg-primary text-white' 
                    : 'border-gray-300 bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step ? 'text-primary' : 'text-gray-600'
                }`}>
                  {title}
                </span>
                {step < 3 && (
                  <ArrowRight className="h-4 w-4 text-gray-600 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Bus Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <Bus className="h-6 w-6 text-primary" />
                      <div>
                        <h4 className="font-semibold text-gray-600">{bus.busName}</h4>
                        <p className="text-sm text-gray-600">{bus.busNumber} • {bus.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">₹{trip.fare}</div>
                      <div className="text-sm text-gray-600">per seat</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-600 mr-2" />
                      <span>{trip.route?.routeName || 'Route'}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-600 mr-2" />
                      <span>{trip.departureTime} - {trip.arrivalTime}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-600 mr-2" />
                      <span>{new Date(trip.departureDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-600 mr-2" />
                      <span>{busOccupancy}% occupied</span>
                    </div>
                  </div>
                </div>

                {/* Seat Legend */}
                <div className="flex justify-center">
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded border-2 border-green-300 bg-green-100 mr-2"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded border-2 border-primary bg-blue-200 mr-2 flex items-center justify-center">
                        <User className="h-3 w-3 text-blue-800" />
                      </div>
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded border-2 border-gray-300 bg-gray-100 mr-2"></div>
                      <span>Occupied</span>
                    </div>
                  </div>
                </div>

                {/* Seat Layout */}
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="text-center mb-4">
                    <div className="w-16 h-8 bg-gray-400 rounded mx-auto mb-2 flex items-center justify-center">
                      <span className="text-xs text-white font-medium">Driver</span>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <div className="flex space-x-8">
                      {seatLayout.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="flex-1">
                          {bus.type === 'Sleeper' || bus.type === 'Semi-Sleeper' ? (
                            <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
                              <div className="text-center text-sm font-medium text-gray-600 mb-4">
                                {section[0]?.[0]?.section === 'lower' ? 'LOWER BERTH' : 'UPPER BERTH'}
                              </div>
                              <div className="space-y-2">
                                {section.map((row, rowIndex) => (
                                  <div key={rowIndex} className="flex justify-center space-x-8">
                                    {row.map((seat) => (
                                      <button
                                        key={seat.number}
                                        onClick={() => handleSeatClick(seat.number)}
                                        className={`w-8 h-16 rounded border-2 text-xs font-medium flex items-center justify-center transition-colors ${getSeatStatusColor(seat)}`}
                                        disabled={seat.occupied}
                                        title={`Seat ${seat.number}`}
                                      >
                                        {getSeatIcon(seat)}
                                      </button>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
                              <div className="space-y-2">
                                {section.map((row, rowIndex) => (
                                  <div key={rowIndex} className="flex justify-center space-x-4">
                                    {row.map((seat) => (
                                      <button
                                        key={seat.number}
                                        onClick={() => handleSeatClick(seat.number)}
                                        className={`w-8 h-8 rounded border-2 text-xs font-medium flex items-center justify-center transition-colors ${getSeatStatusColor(seat)}`}
                                        disabled={seat.occupied}
                                        title={`Seat ${seat.number}`}
                                      >
                                        {getSeatIcon(seat)}
                                      </button>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {busOccupancy < 70 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Info className="h-5 w-5 text-orange-600 mr-2" />
                      <p className="text-sm text-orange-800">
                        Bus occupancy is below 70%. Right side seats must be booked in pairs.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-600">Passenger Details</h4>
                {passengerDetails.map((passenger, index) => (
                  <div key={passenger.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {index + 1}
                      </div>
                      <h5 className="font-medium text-gray-600">Passenger {index + 1} - Seat {passenger.seatNumber}</h5>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={passenger.passengerName}
                          onChange={(e) => handlePassengerInputChange(index, 'passengerName', e.target.value)}
                          className="w-full px-3 py-2 border border-[#B99750] rounded-md focus:ring-blue-500 focus:border-primary"
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={passenger.passengerPhone}
                          onChange={(e) => handlePassengerInputChange(index, 'passengerPhone', e.target.value)}
                          className="w-full px-3 py-2 border border-[#B99750] rounded-md focus:ring-blue-500 focus:border-primary"
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Age *
                        </label>
                        <input
                          type="number"
                          value={passenger.passengerAge}
                          onChange={(e) => handlePassengerInputChange(index, 'passengerAge', e.target.value)}
                          className="w-full px-3 py-2 border border-[#B99750] rounded-md focus:ring-blue-500 focus:border-primary"
                          placeholder="Age"
                          min="1"
                          max="120"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Gender *
                        </label>
                        <select
                          value={passenger.passengerGender}
                          onChange={(e) => handlePassengerInputChange(index, 'passengerGender', e.target.value)}
                          className="w-full px-3 py-2 border border-[#B99750] rounded-md focus:ring-blue-500 focus:border-primary"
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={passenger.passengerEmail}
                          onChange={(e) => handlePassengerInputChange(index, 'passengerEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-[#B99750] rounded-md focus:ring-blue-500 focus:border-primary"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-600">Review Your Booking</h4>
                
                {/* Trip Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h5 className="font-medium text-gray-600 mb-4">Trip Details</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Route:</span>
                      <span className="ml-2 font-medium">{trip.route?.routeName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Bus:</span>
                      <span className="ml-2 font-medium">{bus.busName} ({bus.busNumber})</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <span className="ml-2 font-medium">{new Date(trip.departureDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Time:</span>
                      <span className="ml-2 font-medium">{trip.departureTime} - {trip.arrivalTime}</span>
                    </div>
                  </div>
                </div>

                {/* Passenger Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h5 className="font-medium text-gray-600 mb-4">Passenger Details</h5>
                  <div className="space-y-3">
                    {passengerDetails.map((passenger, index) => (
                      <div key={passenger.id} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                          <div className="font-medium">{passenger.passengerName}</div>
                          <div className="text-sm text-gray-600">
                            Seat {passenger.seatNumber} • {passenger.passengerAge} years • {passenger.passengerGender}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {passenger.passengerPhone}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
              <h4 className="text-lg font-semibold text-gray-600 mb-4">Booking Summary</h4>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Seats:</span>
                  <span className="font-medium">{selectedSeats.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Fare:</span>
                  <span>₹{(trip.fare || 0) * selectedSeats.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee:</span>
                  <span>₹50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes (12% GST):</span>
                  <span>₹{Math.round((trip.fare || 0) * selectedSeats.length * 0.12)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount:</span>
                    <span>₹{calculateTotalAmount()}</span>
                  </div>
                </div>
              </div>

              {/* Bus Amenities */}
              <div className="mb-6">
                <h5 className="font-medium text-gray-600 mb-3">Bus Amenities</h5>
                <div className="flex flex-wrap gap-2">
                  {bus.features?.wifi && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-blue-800">
                      <Wifi className="h-3 w-3 mr-1" />
                      WiFi
                    </span>
                  )}
                  {bus.features?.charging && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      <Battery className="h-3 w-3 mr-1" />
                      Charging
                    </span>
                  )}
                  {bus.features?.water && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-blue-800">
                      <Droplets className="h-3 w-3 mr-1" />
                      Water
                    </span>
                  )}
                  {bus.features?.snacks && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                      <Coffee className="h-3 w-3 mr-1" />
                      Snacks
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevious}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </button>
                )}
                
                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary transition-colors flex items-center justify-center"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleConfirmBooking}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Booking
                      </>
                    )}
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeatBookingModal
