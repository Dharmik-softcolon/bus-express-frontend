import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Users, Clock, Star, Shield, Wifi, Coffee } from 'lucide-react'

const HomePage = ({ onSearch }) => {
  const navigate = useNavigate()
  const [searchForm, setSearchForm] = useState({
    from: '',
    to: '',
    departureDate: '',
    passengers: 1
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchForm.from && searchForm.to && searchForm.departureDate) {
      onSearch(searchForm)
      navigate('/search')
    }
  }

  const popularRoutes = [
    { from: 'New York', to: 'Boston', price: '$45', duration: '4h 30m' },
    { from: 'Los Angeles', to: 'San Francisco', price: '$65', duration: '6h 15m' },
    { from: 'Chicago', to: 'Detroit', price: '$35', duration: '4h 45m' },
    { from: 'Miami', to: 'Orlando', price: '$25', duration: '3h 30m' }
  ]

  const features = [
    { icon: Shield, title: 'Safe & Secure', description: 'Your safety is our priority' },
    { icon: Wifi, title: 'Free WiFi', description: 'Stay connected on your journey' },
    { icon: Coffee, title: 'Comfortable Seats', description: 'Relax in our premium seats' },
    { icon: Clock, title: 'On-Time Service', description: 'Reliable departure and arrival times' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Book Your Bus Journey
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Travel comfortably and affordably with BusExpress. 
              Find the perfect bus for your next adventure.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="from"
                      value={searchForm.from}
                      onChange={handleInputChange}
                      placeholder="Departure city"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="to"
                      value={searchForm.to}
                      onChange={handleInputChange}
                      placeholder="Destination city"
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      name="departureDate"
                      value={searchForm.departureDate}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passengers
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      name="passengers"
                      value={searchForm.passengers}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                    >
                      {[1,2,3,4,5,6,7,8].map(num => (
                        <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="md:col-span-4 flex justify-center">
                  <button
                    type="submit"
                    className="btn-primary px-8 py-3 text-lg"
                  >
                    Search Buses
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Routes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular bus routes and book your next journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRoutes.map((route, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow cursor-pointer">
                <div className="text-center">
                  <h3 className="font-semibold text-lg mb-2">
                    {route.from} → {route.to}
                  </h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-blue-600">{route.price}</span>
                    <span className="text-gray-500">{route.duration}</span>
                  </div>
                  <button className="btn-outline w-full">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose BusExpress?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the best in bus transportation with our premium services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1,2,3].map((_, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Excellent service! The buses are clean, comfortable, and always on time. 
                  I highly recommend BusExpress for your travel needs."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">John Doe</p>
                    <p className="text-gray-500 text-sm">Regular Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

