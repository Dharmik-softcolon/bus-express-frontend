import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Users, Clock, Star, Shield, Wifi, Coffee } from 'lucide-react'
import { searchAPI } from '../../services/api'

const HomePage = ({ onSearch }) => {
  const navigate = useNavigate()
  const [searchForm, setSearchForm] = useState({
    from: '',
    to: '',
    departureDate: '',
    passengers: 1
  })
  const [popularRoutes, setPopularRoutes] = useState([])
  const [loading, setLoading] = useState(false)

  // Load popular routes on component mount
  useEffect(() => {
    const loadPopularRoutes = async () => {
      try {
        const response = await searchAPI.getPopularRoutes({ limit: 4 })
        if (response.success) {
          setPopularRoutes(response.data.routes || [])
        }
      } catch (error) {
        console.error('Error loading popular routes:', error)
      }
    }
    
    loadPopularRoutes()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (searchForm.from && searchForm.to && searchForm.departureDate) {
      setLoading(true)
      try {
        // Search for buses using the API
        const searchParams = {
          from: searchForm.from,
          to: searchForm.to,
          departureDate: searchForm.departureDate,
          passengers: searchForm.passengers
        }
        
        const response = await searchAPI.searchBuses(searchParams)
        
        if (response.success) {
          onSearch({
            ...searchForm,
            searchResults: response.data
          })
          navigate('/search')
        } else {
          // Still navigate to search page even if no results
          onSearch(searchForm)
          navigate('/search')
        }
      } catch (error) {
        console.error('Search error:', error)
        // Still navigate to search page
        onSearch(searchForm)
        navigate('/search')
      } finally {
        setLoading(false)
      }
    }
  }


  const features = [
    { icon: Shield, title: 'Safe & Secure', description: 'Your safety is our priority' },
    { icon: Wifi, title: 'Free WiFi', description: 'Stay connected on your journey' },
    { icon: Coffee, title: 'Comfortable Seats', description: 'Relax in our premium seats' },
    { icon: Clock, title: 'On-Time Service', description: 'Reliable departure and arrival times' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy-light to-navy-dark text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        </div>
        
        <div className="container-responsive section-padding relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-responsive-2xl font-bold mb-4 sm:mb-6 lg:mb-8 text-balance">
              Book Your Perfect Bus Journey
            </h1>
            <p className="text-responsive-lg text-blue-100 max-w-4xl mx-auto px-4 leading-relaxed text-balance">
              Travel comfortably and affordably with BusExpress. 
              Find the perfect bus for your next adventure with our premium services.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-5xl mx-auto">
            <div className="card-elevated bg-white/95 backdrop-blur-sm">
              <form onSubmit={handleSearch} className="form-responsive">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      From
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <input
                        type="text"
                        name="from"
                        value={searchForm.from}
                        onChange={handleInputChange}
                        placeholder="Departure city"
                        className="input-field pl-10 sm:pl-12 input-field-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      To
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <input
                        type="text"
                        name="to"
                        value={searchForm.to}
                        onChange={handleInputChange}
                        placeholder="Destination city"
                        className="input-field pl-10 sm:pl-12 input-field-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Departure Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <input
                        type="date"
                        name="departureDate"
                        value={searchForm.departureDate}
                        onChange={handleInputChange}
                        className="input-field pl-10 sm:pl-12 input-field-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Passengers
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      <select
                        name="passengers"
                        value={searchForm.passengers}
                        onChange={handleInputChange}
                        className="input-field pl-10 sm:pl-12 input-field-lg"
                      >
                        {[1,2,3,4,5,6,7,8].map(num => (
                          <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-4 sm:pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary btn-xl px-8 sm:px-12 py-3 sm:py-4 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner h-5 w-5 sm:h-6 sm:w-6 mr-3"></div>
                        <span className="text-base sm:text-lg">Searching Buses...</span>
                      </div>
                    ) : (
                      <span className="text-base sm:text-lg font-semibold">Search Buses</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
        <div className="container-responsive">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-6">
              Popular Routes
            </h2>
            <p className="text-responsive-base text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
              Discover our most popular bus routes and book your next journey with confidence
            </p>
          </div>

          <div className="grid-responsive-4">
            {popularRoutes.map((route, index) => (
              <div key={index} className="card-elevated hover:shadow-xl transition-all duration-300 cursor-pointer group">
                <div className="text-center p-4 sm:p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg sm:text-xl mb-2 text-gray-900 group-hover:text-navy transition-colors">
                      {route.from} → {route.to}
                    </h3>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl sm:text-3xl font-bold text-navy">{route.price || '₹450'}</span>
                      <span className="text-sm sm:text-base text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{route.duration || '3h 30m'}</span>
                    </div>
                  </div>
                  <button 
                    className="btn-outline w-full group-hover:bg-navy group-hover:text-white transition-all duration-200"
                    onClick={() => {
                      setSearchForm({
                        from: route.from,
                        to: route.to,
                        departureDate: new Date().toISOString().split('T')[0],
                        passengers: 1
                      })
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-white">
        <div className="container-responsive">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-6">
              Why Choose BusExpress?
            </h2>
            <p className="text-responsive-base text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
              Experience the best in bus transportation with our premium services and unmatched comfort
            </p>
          </div>

          <div className="grid-responsive-4">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <feature.icon className="h-8 w-8 sm:h-10 sm:w-10 text-navy" />
                </div>
                <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container-responsive">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-6">
              What Our Customers Say
            </h2>
            <p className="text-responsive-base text-gray-600 max-w-2xl mx-auto px-4">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid-responsive-3">
            {[
              {
                name: "John Doe",
                role: "Regular Customer",
                rating: 5,
                text: "Excellent service! The buses are clean, comfortable, and always on time. I highly recommend BusExpress for your travel needs."
              },
              {
                name: "Sarah Johnson",
                role: "Business Traveler",
                rating: 5,
                text: "The WiFi and comfortable seats make my business trips so much more productive. Great value for money!"
              },
              {
                name: "Mike Chen",
                role: "Frequent Traveler",
                rating: 5,
                text: "Outstanding customer service and reliable schedules. BusExpress has become my go-to choice for intercity travel."
              }
            ].map((testimonial, index) => (
              <div key={index} className="card-elevated hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4 sm:mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed italic">
                  "{testimonial.text}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-navy rounded-full mr-3 sm:mr-4 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm sm:text-base">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</p>
                    <p className="text-gray-500 text-xs sm:text-sm">{testimonial.role}</p>
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

