import { useNavigate } from 'react-router-dom'
import { CheckCircle, Download, Mail, Calendar, MapPin, Clock, User, CreditCard } from 'lucide-react'
import { bookingAPI } from '../../services/api'

const BookingConfirmation = ({ bookingData }) => {
  const navigate = useNavigate()

  // Mock booking data if not provided
  const booking = bookingData || {
    bus: {
      operator: 'Express Bus Lines',
      from: 'New York',
      to: 'Boston',
      departureTime: '08:00 AM',
      arrivalTime: '12:30 PM',
      duration: '4h 30m',
      price: 45,
      busType: 'Standard'
    },
    selectedSeats: [12, 13],
    passengerDetails: [
      { name: 'John Doe', age: 30, gender: 'male' },
      { name: 'Jane Doe', age: 28, gender: 'female' }
    ],
    totalAmount: 90,
    bookingId: 'BE' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    bookingDate: new Date().toLocaleDateString(),
    departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
  }

  const totalWithFees = booking.totalAmount + 5.5

  const handleDownloadTicket = async () => {
    try {
      // In a real app, this would generate and download a PDF
      // const response = await bookingAPI.downloadTicket(booking.bookingId)
      // const blob = new Blob([response.data], { type: 'application/pdf' })
      // const url = window.URL.createObjectURL(blob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = `ticket-${booking.bookingId}.pdf`
      // a.click()
      // window.URL.revokeObjectURL(url)
      
      alert('Ticket download functionality would be implemented here')
    } catch (error) {
      console.error('Error downloading ticket:', error)
      alert('Failed to download ticket')
    }
  }

  const handleEmailTicket = async () => {
    try {
      // In a real app, this would send an email
      // await bookingAPI.emailTicket(booking.bookingId)
      
      alert('Email ticket functionality would be implemented here')
    } catch (error) {
      console.error('Error emailing ticket:', error)
      alert('Failed to email ticket')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">
            Your bus tickets have been successfully booked. Booking ID: <span className="font-semibold text-blue-600">{booking.bookingId}</span>
          </p>
        </div>

        {/* Booking Details */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-6">Booking Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Journey Information */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Journey Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm">
                    <span className="font-medium">{booking.bus.from}</span> → <span className="font-medium">{booking.bus.to}</span>
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm">Departure Date: {booking.departureDate}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm">
                    {booking.bus.departureTime} - {booking.bus.arrivalTime} ({booking.bus.duration})
                  </span>
                </div>
                
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm">{booking.bus.operator} • {booking.bus.busType}</span>
                </div>
              </div>
            </div>

            {/* Passenger Information */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Passenger Information</h3>
              <div className="space-y-3">
                {booking.passengerDetails.map((passenger, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-sm">
                      {passenger.name} (Seat {booking.selectedSeats[index]})
                    </div>
                    <div className="text-xs text-gray-600">
                      {passenger.age} years old • {passenger.gender}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-6">Payment Summary</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Base Fare ({booking.selectedSeats.length} × ${booking.bus.price})</span>
              <span>${booking.totalAmount}</span>
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
                <span>Total Paid</span>
                <span>${totalWithFees.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-sm text-green-800">Payment completed successfully</span>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Important Information</h2>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>Please arrive at the bus station at least 30 minutes before departure time.</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>Carry a valid photo ID for verification at the time of boarding.</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>Seat numbers are final and cannot be changed after booking.</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>For cancellations, please contact customer support at least 2 hours before departure.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleDownloadTicket}
            className="btn-outline flex items-center justify-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Ticket
          </button>
          
          <button
            onClick={handleEmailTicket}
            className="btn-outline flex items-center justify-center"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Ticket
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex items-center justify-center"
          >
            Book Another Trip
          </button>
        </div>

        {/* Contact Information */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Need help? Contact our customer support at <span className="text-blue-600">+1 (555) 123-4567</span></p>
          <p>or email us at <span className="text-blue-600">support@busexpress.com</span></p>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmation

