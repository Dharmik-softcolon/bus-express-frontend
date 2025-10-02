import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, User, Clock, MapPin } from 'lucide-react'
import { searchAPI, bookingAPI } from '../../services/api'
import { showToast } from '../../utils/toast'

const SeatSelection = ({ selectedSeats, onBooking }) => {
  const navigate = useNavigate()
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState([])
  const [passengerDetails, setPassengerDetails] = useState([])

  const [bus, setBus] = useState({
    id: 1,
    operator: 'Express Bus Lines',
    from: 'New York',
    to: 'Boston',
    departureTime: '08:00 AM',
    arrivalTime: '12:30 PM',
    duration: '4h 30m',
    price: 45,
    busType: 'Standard',
    totalSeats: 45
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [availableSeats, setAvailableSeats] = useState([])

  // Load bus and seat data on component mount
  useEffect(() => {
    loadBusAndSeatData()
  }, [])

  const loadBusAndSeatData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get bus details from search results or URL params
      const busId = new URLSearchParams(window.location.search).get('busId')
      const tripId = new URLSearchParams(window.location.search).get('tripId')
      const date = new URLSearchParams(window.location.search).get('date')
      
      if (tripId && date) {
        // Get available seats for the trip
        const seatsResponse = await searchAPI.getAvailableSeats(tripId, date)
        setAvailableSeats(seatsResponse.data?.seats || [])
        
        // Get trip details
        const tripResponse = await searchAPI.getTripDetails(tripId)
        if (tripResponse.data?.trip) {
          setBus(tripResponse.data.trip)
        }
      }
      
    } catch (err) {
      setError(err.message || 'Failed to load bus and seat data')
      console.error('Error loading bus and seat data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Generate seat layout (2-2 configuration)
  const generateSeats = () => {
    const seats = []
    const rows = Math.ceil(bus.totalSeats / 4)
    
    for (let row = 1; row <= rows; row++) {
      const rowSeats = []
      for (let col = 1; col <= 4; col++) {
        const seatNumber = (row - 1) * 4 + col
        if (seatNumber <= bus.totalSeats) {
          const isOccupied = Math.random() > 0.7 // Random occupied seats
          rowSeats.push({
            number: seatNumber,
            occupied: isOccupied,
            selected: selectedSeatNumbers.includes(seatNumber)
          })
        }
      }
      seats.push(rowSeats)
    }
    return seats
  }

  const seats = generateSeats()

  const handleSeatClick = (seatNumber) => {
    if (selectedSeatNumbers.includes(seatNumber)) {
      setSelectedSeatNumbers(prev => prev.filter(num => num !== seatNumber))
    } else {
      setSelectedSeatNumbers(prev => [...prev, seatNumber])
    }
  }

  const handlePassengerChange = (index, field, value) => {
    setPassengerDetails(prev => {
      const updated = [...prev]
      if (!updated[index]) {
        updated[index] = { name: '', age: '', gender: '' }
      }
      updated[index][field] = value
      return updated
    })
  }

  const handleProceedToPayment = async () => {
    if (selectedSeatNumbers.length === 0) {
      showToast.error('Please select at least one seat')
      return
    }

    if (passengerDetails.length !== selectedSeatNumbers.length) {
      showToast.error('Please fill in details for all selected seats')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const bookingData = {
        bus: bus.id,
        trip: bus.tripId,
        seats: selectedSeatNumbers.map((seatNumber, index) => ({
          seatNumber,
          passengerName: passengerDetails[index]?.name || '',
          passengerAge: passengerDetails[index]?.age || '',
          passengerGender: passengerDetails[index]?.gender || '',
          passengerPhone: passengerDetails[index]?.phone || ''
        })),
        journeyDate: new URLSearchParams(window.location.search).get('date'),
        totalAmount: bus.price * selectedSeatNumbers.length
      }

      const response = await bookingAPI.createBooking(bookingData)
      
      const finalBookingData = {
        ...bookingData,
        bookingId: response.data?.booking?.id,
        bus,
        selectedSeats: selectedSeatNumbers,
        passengerDetails,
        totalAmount: bus.price * selectedSeatNumbers.length
      }
      
      onBooking(finalBookingData)
      navigate('/confirmation')
      
    } catch (err) {
      setError(err.message || 'Failed to create booking')
      console.error('Error creating booking:', err)
    } finally {
      setLoading(false)
    }
  }

  const getSeatClass = (seat) => {
    if (seat.occupied) return 'seat-occupied'
    if (seat.selected) return 'seat-selected'
    return 'seat-available'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/search')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Search Results
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Select Your Seats
          </h1>
          
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  {bus.from} → {bus.to}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  {bus.departureTime} - {bus.arrivalTime}
                </span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">
                  {bus.operator} • {bus.busType}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Selection */}
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Choose Your Seats</h2>
              
              {/* Seat Legend */}
              <div className="flex justify-center mb-6">
                <div className="flex space-x-6 text-sm">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded border-2 border-green-300 bg-green-100 mr-2"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded border-2 border-blue-300 bg-blue-100 mr-2"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded border-2 border-gray-300 bg-gray-100 mr-2"></div>
                    <span>Occupied</span>
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
                  <div className="space-y-2">
                    {seats.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex justify-center space-x-2">
                        {row.map((seat, seatIndex) => (
                          <button
                            key={seat.number}
                            onClick={() => !seat.occupied && handleSeatClick(seat.number)}
                            className={`w-8 h-8 rounded border-2 text-xs font-medium ${getSeatClass(seat)}`}
                            disabled={seat.occupied}
                          >
                            {seat.number}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-gray-600">
                Selected Seats: {selectedSeatNumbers.length > 0 ? selectedSeatNumbers.join(', ') : 'None'}
              </div>
            </div>
          </div>

          {/* Passenger Details & Summary */}
          <div className="lg:col-span-1">
            <div className="card mb-6">
              <h2 className="text-xl font-semibold mb-4">Passenger Details</h2>
              
              {selectedSeatNumbers.map((seatNumber, index) => (
                <div key={seatNumber} className="mb-4 p-4 border rounded-lg">
                  <h3 className="font-medium mb-3">Passenger {index + 1} (Seat {seatNumber})</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={passengerDetails[index]?.name || ''}
                        onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                        className="input-field"
                        placeholder="Enter full name"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Age
                        </label>
                        <input
                          type="number"
                          value={passengerDetails[index]?.age || ''}
                          onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                          className="input-field"
                          placeholder="Age"
                          min="1"
                          max="120"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender
                        </label>
                        <select
                          value={passengerDetails[index]?.gender || ''}
                          onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                          className="input-field"
                          required
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
              ))}
            </div>

            {/* Booking Summary */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Base Fare ({selectedSeatNumbers.length} × ${bus.price})</span>
                  <span>${bus.price * selectedSeatNumbers.length}</span>
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
                    <span>${(bus.price * selectedSeatNumbers.length + 5.5).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                className="btn-primary w-full flex items-center justify-center"
                disabled={selectedSeatNumbers.length === 0}
              >
                Proceed to Payment
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeatSelection

