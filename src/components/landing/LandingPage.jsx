import { Link } from 'react-router-dom'
import { Bus, Users, BarChart3, Shield, Clock, MapPin } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Bus className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">BusExpress</span>
            </div>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Modern Bus Management
              <span className="text-blue-600"> System</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your bus operations with our comprehensive management platform. 
              From route planning to booking management, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
              >
                Get Started
              </Link>
              <Link
                to="/search"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors font-medium text-lg"
              >
                Book a Trip
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Bus Business
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools necessary for efficient bus operations and customer management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bus className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fleet Management</h3>
              <p className="text-gray-600">
                Manage your entire bus fleet with real-time tracking, maintenance schedules, and performance analytics.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Route Planning</h3>
              <p className="text-gray-600">
                Optimize routes, manage stops, and track real-time location data for better service delivery.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Management</h3>
              <p className="text-gray-600">
                Handle bookings, customer profiles, and provide excellent customer service with our integrated tools.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics & Reports</h3>
              <p className="text-gray-600">
                Get detailed insights into your business performance with comprehensive analytics and reporting.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Role-Based Access</h3>
              <p className="text-gray-600">
                Secure access control with different permission levels for admins, employees, and customers.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Updates</h3>
              <p className="text-gray-600">
                Stay updated with real-time notifications, schedule changes, and instant booking confirmations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Access Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Designed for Every Role
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform adapts to your role, providing the right tools and information for your specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Master Admin */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Master Admin</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Full system control, user management, and global analytics.
                </p>
                <Link
                  to="/login"
                  className="text-red-600 hover:text-red-700 font-medium text-sm"
                >
                  Access Dashboard →
                </Link>
              </div>
            </div>

            {/* Bus Owner */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bus className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bus Owner</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Manage your fleet, routes, and business operations.
                </p>
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Access Dashboard →
                </Link>
              </div>
            </div>

            {/* Bus Admin */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bus Admin</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Daily operations, trip management, and team coordination.
                </p>
                <Link
                  to="/login"
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  Access Dashboard →
                </Link>
              </div>
            </div>

            {/* Booking Manager */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Manager</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Handle reservations, customer service, and booking analytics.
                </p>
                <Link
                  to="/login"
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  Access Dashboard →
                </Link>
              </div>
            </div>

            {/* Bus Employee */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bus Employee</h3>
                <p className="text-gray-600 text-sm mb-4">
                  View schedules, update trip status, and manage daily tasks.
                </p>
                <Link
                  to="/login"
                  className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                >
                  Access Dashboard →
                </Link>
              </div>
            </div>

            {/* Customer */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Book trips, manage reservations, and track your travel history.
                </p>
                <Link
                  to="/search"
                  className="text-gray-600 hover:text-gray-700 font-medium text-sm"
                >
                  Start Booking →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Bus Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of bus operators who trust BusExpress for their daily operations.
          </p>
          <Link
            to="/login"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bus className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">BusExpress</span>
              </div>
              <p className="text-gray-400">
                Modern bus management system for the digital age.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Fleet Management</li>
                <li>Route Planning</li>
                <li>Booking System</li>
                <li>Analytics</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Documentation</li>
                <li>Contact Us</li>
                <li>Status</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Careers</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BusExpress. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
