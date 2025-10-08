import { Link } from 'react-router-dom'
import { Bus, Users, BarChart3, Shield, Clock, MapPin } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Modern Bus Management
                <span className="text-navy"> System</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto lg:mx-0">
                Streamline your bus operations with our comprehensive management platform. 
                From route planning to booking management, we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/login"
                  className="bg-navy text-white px-8 py-4 rounded-lg hover:bg-navy-light transition-colors font-medium text-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/search"
                  className="border-2 border-navy text-navy px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors font-medium text-lg"
                >
                  Book a Trip
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Modern bus fleet"
                  className="rounded-lg shadow-2xl w-full max-w-md lg:max-w-lg"
                />
                <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Live Tracking</span>
                  </div>
                </div>
              </div>
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
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  alt="Fleet management"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bus className="h-8 w-8 text-navy" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fleet Management</h3>
              <p className="text-gray-600">
                Manage your entire bus fleet with real-time tracking, maintenance schedules, and performance analytics.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  alt="Route planning"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </div>
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
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  alt="Customer management"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </div>
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
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  alt="Analytics dashboard"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </div>
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
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  alt="Security features"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </div>
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
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  alt="Real-time updates"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </div>
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
                  <Bus className="h-6 w-6 text-navy" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bus Owner</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Manage your fleet, routes, and business operations.
                </p>
                <Link
                  to="/login"
                  className="text-navy hover:text-navy-dark font-medium text-sm"
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

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what bus operators are saying about BusExpress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="John Smith"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">John Smith</h4>
                  <p className="text-sm text-gray-600">Bus Owner, City Transport</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "BusExpress has revolutionized our operations. The real-time tracking and analytics have helped us increase efficiency by 40%."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="Sarah Johnson"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Booking Manager, Metro Lines</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The booking management system is incredibly user-friendly. Our customers love the seamless experience."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="Mike Chen"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Mike Chen</h4>
                  <p className="text-sm text-gray-600">Bus Admin, Express Transit</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The role-based access control gives us perfect security while maintaining operational flexibility."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Bus Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of bus operators who trust BusExpress for their daily operations.
          </p>
          <Link
            to="/login"
            className="bg-white text-navy px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg"
          >
            Get Started Today
          </Link>
        </div>
      </section>

    </div>
  )
}

export default LandingPage
