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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{searchData?.from || 'New York'} → {searchData?.to || 'Boston'}</span>
            <span className="mx-2">•</span>
            <span>{searchData?.departureDate || 'Today'}</span>
            <span className="mx-2">•</span>
            <span>{searchData?.passengers || 1} Passenger{(searchData?.passengers || 1) > 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field"
                >
                  <option value="price">Price</option>
                  <option value="departure">Departure Time</option>
                  <option value="duration">Duration</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bus Type:
                </label>
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Types</option>
                  <option value="economy">Economy</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredBuses.length} bus{filteredBuses.length !== 1 ? 'es' : ''} found
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="card text-center py-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
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
          <div className="space-y-4">
            {filteredBuses.length > 0 ? (
              filteredBuses.map((bus) => (
                <div key={bus.id} className="card hover:shadow-lg transition-shadow">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Bus Info */}
                    <div className="lg:col-span-3">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {bus.operator}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span>{bus.rating}</span>
                            <span className="mx-2">•</span>
                            <span className="capitalize">{bus.busType}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
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
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>

                      {/* Seats Info */}
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{bus.availableSeats} of {bus.seats} seats available</span>
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
                        onClick={() => handleSelectBus(bus)}
                        className="btn-primary w-full flex items-center justify-center"
                        disabled={bus.availableSeats === 0}
                      >
                        {bus.availableSeats === 0 ? 'Sold Out' : 'Select Seats'}
                        {bus.availableSeats > 0 && <ArrowRight className="h-4 w-4 ml-2" />}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card text-center py-12">
                <div className="text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No buses found</h3>
                  <p>Try adjusting your search criteria or check back later.</p>
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

