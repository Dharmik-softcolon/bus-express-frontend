import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, MapPin, Users, Wifi, Coffee, ArrowRight, Star } from 'lucide-react'
import { searchAPI } from '../../services/api'

const SearchResults = ({ searchData, onSeatSelection }) => {
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState('price')
  const [filterBy, setFilterBy] = useState('all')
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load search results when component mounts or searchData changes
  useEffect(() => {
    const loadSearchResults = async () => {
      if (!searchData) return
      
      setLoading(true)
      setError(null)
      
      try {
        let searchResults = []
        
        // If search results are already provided from HomePage
        if (searchData.searchResults) {
          searchResults = searchData.searchResults
        } else {
          // Otherwise, perform new search
          const response = await searchAPI.searchBuses({
            from: searchData.from,
            to: searchData.to,
            departureDate: searchData.departureDate,
            passengers: searchData.passengers
          })
          
          if (response.success) {
            searchResults = response.data
          }
        }
        
        setBuses(searchResults)
          } catch (error) {
            console.error('Error loading search results:', error)
            setError('Failed to load search results')
            setBuses([])
      } finally {
        setLoading(false)
      }
    }
    
    loadSearchResults()
  }, [searchData])

  const handleSelectBus = (bus) => {
    onSeatSelection(bus)
    navigate('/seats')
  }

  const sortedBuses = [...buses].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price
      case 'departure':
        return a.departureTime.localeCompare(b.departureTime)
      case 'duration':
        return a.duration.localeCompare(b.duration)
      case 'rating':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const filteredBuses = sortedBuses.filter(bus => {
    if (filterBy === 'all') return true
    return bus.busType.toLowerCase() === filterBy.toLowerCase()
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="dashboard-content">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-6">
            Search Results
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 gap-2 sm:gap-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-navy" />
              <span className="text-sm sm:text-base font-medium">{searchData?.from || 'New York'} → {searchData?.to || 'Boston'}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-sm sm:text-base">
              <span className="bg-blue-100 text-navy px-2 py-1 rounded-full">{searchData?.departureDate || 'Today'}</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">{searchData?.passengers || 1} Passenger{(searchData?.passengers || 1) > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="card-elevated mb-6 sm:mb-8">
          <div className="flex-responsive-between">
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <div className="min-w-[140px]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field input-field-sm"
                >
                  <option value="price">Price</option>
                  <option value="departure">Departure Time</option>
                  <option value="duration">Duration</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
              
              <div className="min-w-[140px]">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bus Type:
                </label>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="input-field input-field-sm"
                >
                  <option value="all">All Types</option>
                  <option value="economy">Economy</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
            </div>
            
            <div className="text-sm sm:text-base text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
              <span className="font-semibold text-navy">{filteredBuses.length}</span> bus{filteredBuses.length !== 1 ? 'es' : ''} found
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="card text-center py-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mr-3"></div>
              <span className="text-gray-600">Loading buses...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="card text-center py-12">
            <div className="text-red-600">
              <p className="text-lg font-medium mb-2">Error loading results</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Bus Results */}
        {!loading && !error && (
          <div className="space-y-4 sm:space-y-6">
            {filteredBuses.length > 0 ? (
              filteredBuses.map((bus) => (
                <div key={bus.id} className="card-elevated hover:shadow-xl transition-all duration-300 group">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                    {/* Bus Info */}
                    <div className="lg:col-span-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6 gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 group-hover:text-navy transition-colors">
                            {bus.operator}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm sm:text-base text-gray-600">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current mr-1" />
                              <span className="font-semibold">{bus.rating}</span>
                            </div>
                            <span className="hidden sm:inline">•</span>
                            <span className="capitalize bg-gray-100 px-2 py-1 rounded-full text-xs sm:text-sm">{bus.busType}</span>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-2xl sm:text-3xl font-bold text-navy">
                            ₹{bus.price}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500">
                            per person
                          </div>
                        </div>
                      </div>

                      {/* Schedule */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <div className="text-center bg-gray-50 rounded-lg p-3 sm:p-4">
                          <div className="text-lg sm:text-xl font-bold text-gray-900">
                            {bus.departureTime}
                          </div>
                          <div className="text-sm sm:text-base text-gray-600 mt-1">
                            {bus.from}
                          </div>
                        </div>
                        
                        <div className="text-center flex flex-col justify-center">
                          <div className="flex items-center justify-center mb-2">
                            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mr-2" />
                            <span className="text-sm sm:text-base text-gray-600 font-medium">{bus.duration}</span>
                          </div>
                          <div className="w-full h-px bg-gray-300"></div>
                        </div>
                        
                        <div className="text-center bg-gray-50 rounded-lg p-3 sm:p-4">
                          <div className="text-lg sm:text-xl font-bold text-gray-900">
                            {bus.arrivalTime}
                          </div>
                          <div className="text-sm sm:text-base text-gray-600 mt-1">
                            {bus.to}
                          </div>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                        {bus.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-navy border border-blue-200"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>

                      {/* Seats Info */}
                      <div className="flex items-center text-sm sm:text-base text-gray-600">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-navy" />
                        <span className="font-medium">{bus.availableSeats} of {bus.seats} seats available</span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="lg:col-span-1 flex flex-col justify-between">
                      <div className="text-center mb-4 sm:mb-6">
                        <div className="text-sm sm:text-base text-gray-600 mb-2">
                          Available Seats
                        </div>
                        <div className="text-3xl sm:text-4xl font-bold text-green-600">
                          {bus.availableSeats}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleSelectBus(bus)}
                        className="btn-primary btn-lg w-full flex items-center justify-center group-hover:bg-navy-light transition-all duration-200"
                        disabled={bus.availableSeats === 0}
                      >
                        {bus.availableSeats === 0 ? 'Sold Out' : 'Select Seats'}
                        {bus.availableSeats > 0 && <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card-elevated text-center py-12 sm:py-16">
                <div className="text-gray-500">
                  <MapPin className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-6 text-gray-300" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-700">No buses found</h3>
                  <p className="text-sm sm:text-base max-w-md mx-auto">Try adjusting your search criteria or check back later for more options.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchResults

