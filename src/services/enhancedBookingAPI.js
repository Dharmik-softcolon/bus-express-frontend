// Enhanced Booking API functions
export const enhancedBookingAPI = {
  // Create a new booking
  createBooking: async (bookingData) => {
    return apiRequest('/bookings', {
      method: 'POST',
      data: bookingData
    })
  },

  // Get all bookings with enhanced filtering
  getAllBookings: async (params = {}) => {
    return apiRequest('/bookings', {
      method: 'GET',
      params: {
        page: 1,
        limit: 10,
        ...params
      }
    })
  },

  // Get booking by ID
  getBookingById: async (bookingId) => {
    return apiRequest(`/bookings/${bookingId}`, {
      method: 'GET'
    })
  },

  // Get booking by reference
  getBookingByReference: async (reference) => {
    return apiRequest(`/bookings/reference/${reference}`, {
      method: 'GET'
    })
  },

  // Update booking status
  updateBookingStatus: async (bookingId, statusData) => {
    return apiRequest(`/bookings/${bookingId}/status`, {
      method: 'PUT',
      data: statusData
    })
  },

  // Cancel booking
  cancelBooking: async (bookingId, cancelData) => {
    return apiRequest(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      data: cancelData
    })
  },

  // Get booking statistics
  getBookingStatistics: async (params = {}) => {
    return apiRequest('/bookings/statistics', {
      method: 'GET',
      params
    })
  },

  // Get booking analytics
  getBookingAnalytics: async () => {
    return apiRequest('/bookings/analytics', {
      method: 'GET'
    })
  },

  // Get available seats for a trip
  getAvailableSeats: async (tripId) => {
    return apiRequest(`/bookings/available-seats/${tripId}`, {
      method: 'GET'
    })
  },

  // Search trips for booking
  searchTrips: async (searchParams) => {
    return apiRequest('/trips/search', {
      method: 'POST',
      data: searchParams
    })
  },

  // Get trip details for booking
  getTripForBooking: async (tripId) => {
    return apiRequest(`/trips/${tripId}/booking-details`, {
      method: 'GET'
    })
  },

  // Validate seat selection
  validateSeatSelection: async (tripId, seatNumbers) => {
    return apiRequest(`/bookings/validate-seats`, {
      method: 'POST',
      data: {
        tripId,
        seatNumbers
      }
    })
  },

  // Get booking history for user
  getBookingHistory: async (userId, params = {}) => {
    return apiRequest('/bookings', {
      method: 'GET',
      params: {
        userId,
        ...params
      }
    })
  },

  // Get booking man dashboard data
  getBookingManDashboard: async () => {
    return apiRequest('/booking-men/dashboard', {
      method: 'GET'
    })
  },

  // Get booking man bookings
  getBookingManBookings: async (params = {}) => {
    return apiRequest('/booking-men/bookings', {
      method: 'GET',
      params
    })
  },

  // Get booking man customers
  getBookingManCustomers: async (params = {}) => {
    return apiRequest('/booking-men/customers', {
      method: 'GET',
      params
    })
  },

  // Export bookings data
  exportBookings: async (params = {}) => {
    return apiRequest('/bookings/export', {
      method: 'GET',
      params,
      responseType: 'blob'
    })
  },

  // Get booking reports
  getBookingReports: async (reportType, params = {}) => {
    return apiRequest(`/bookings/reports/${reportType}`, {
      method: 'GET',
      params
    })
  },

  // Send booking confirmation
  sendBookingConfirmation: async (bookingId) => {
    return apiRequest(`/bookings/${bookingId}/send-confirmation`, {
      method: 'POST'
    })
  },

  // Generate booking PDF
  generateBookingPDF: async (bookingId) => {
    return apiRequest(`/bookings/${bookingId}/pdf`, {
      method: 'GET',
      responseType: 'blob'
    })
  },

  // Update passenger details
  updatePassengerDetails: async (bookingId, passengerData) => {
    return apiRequest(`/bookings/${bookingId}/passengers`, {
      method: 'PUT',
      data: passengerData
    })
  },

  // Add passenger to existing booking
  addPassenger: async (bookingId, passengerData) => {
    return apiRequest(`/bookings/${bookingId}/passengers`, {
      method: 'POST',
      data: passengerData
    })
  },

  // Remove passenger from booking
  removePassenger: async (bookingId, passengerId) => {
    return apiRequest(`/bookings/${bookingId}/passengers/${passengerId}`, {
      method: 'DELETE'
    })
  },

  // Get booking timeline
  getBookingTimeline: async (bookingId) => {
    return apiRequest(`/bookings/${bookingId}/timeline`, {
      method: 'GET'
    })
  },

  // Add booking note
  addBookingNote: async (bookingId, note) => {
    return apiRequest(`/bookings/${bookingId}/notes`, {
      method: 'POST',
      data: { note }
    })
  },

  // Get booking notes
  getBookingNotes: async (bookingId) => {
    return apiRequest(`/bookings/${bookingId}/notes`, {
      method: 'GET'
    })
  },

  // Update booking payment status
  updatePaymentStatus: async (bookingId, paymentData) => {
    return apiRequest(`/bookings/${bookingId}/payment`, {
      method: 'PUT',
      data: paymentData
    })
  },

  // Process refund
  processRefund: async (bookingId, refundData) => {
    return apiRequest(`/bookings/${bookingId}/refund`, {
      method: 'POST',
      data: refundData
    })
  },

  // Get refund status
  getRefundStatus: async (bookingId) => {
    return apiRequest(`/bookings/${bookingId}/refund-status`, {
      method: 'GET'
    })
  },

  // Bulk operations
  bulkUpdateBookingStatus: async (bookingIds, status) => {
    return apiRequest('/bookings/bulk/status', {
      method: 'PUT',
      data: {
        bookingIds,
        status
      }
    })
  },

  bulkCancelBookings: async (bookingIds, reason) => {
    return apiRequest('/bookings/bulk/cancel', {
      method: 'PUT',
      data: {
        bookingIds,
        reason
      }
    })
  },

  // Get booking insights
  getBookingInsights: async (params = {}) => {
    return apiRequest('/bookings/insights', {
      method: 'GET',
      params
    })
  },

  // Get seat map for trip
  getSeatMap: async (tripId) => {
    return apiRequest(`/trips/${tripId}/seat-map`, {
      method: 'GET'
    })
  },

  // Reserve seats temporarily
  reserveSeats: async (tripId, seatNumbers, duration = 300) => {
    return apiRequest('/bookings/reserve-seats', {
      method: 'POST',
      data: {
        tripId,
        seatNumbers,
        duration
      }
    })
  },

  // Release seat reservation
  releaseSeatReservation: async (reservationId) => {
    return apiRequest(`/bookings/reservations/${reservationId}/release`, {
      method: 'DELETE'
    })
  },

  // Get booking preferences
  getBookingPreferences: async (userId) => {
    return apiRequest(`/users/${userId}/booking-preferences`, {
      method: 'GET'
    })
  },

  // Update booking preferences
  updateBookingPreferences: async (userId, preferences) => {
    return apiRequest(`/users/${userId}/booking-preferences`, {
      method: 'PUT',
      data: preferences
    })
  },

  // Get booking recommendations
  getBookingRecommendations: async (userId, params = {}) => {
    return apiRequest(`/users/${userId}/booking-recommendations`, {
      method: 'GET',
      params
    })
  },

  // Track booking
  trackBooking: async (bookingReference) => {
    return apiRequest(`/bookings/track/${bookingReference}`, {
      method: 'GET'
    })
  },

  // Get booking alerts
  getBookingAlerts: async (userId) => {
    return apiRequest(`/users/${userId}/booking-alerts`, {
      method: 'GET'
    })
  },

  // Create booking alert
  createBookingAlert: async (userId, alertData) => {
    return apiRequest(`/users/${userId}/booking-alerts`, {
      method: 'POST',
      data: alertData
    })
  },

  // Update booking alert
  updateBookingAlert: async (alertId, alertData) => {
    return apiRequest(`/booking-alerts/${alertId}`, {
      method: 'PUT',
      data: alertData
    })
  },

  // Delete booking alert
  deleteBookingAlert: async (alertId) => {
    return apiRequest(`/booking-alerts/${alertId}`, {
      method: 'DELETE'
    })
  }
}
