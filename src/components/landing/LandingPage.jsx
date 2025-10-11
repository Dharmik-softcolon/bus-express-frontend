import { Link } from 'react-router-dom'
import { Bus, Users, BarChart3, Shield, Clock, MapPin } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-hover-light to-background">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-display mb-6">
                Modern Bus Management
                <span className="text-text-dark"> System</span>
              </h1>
              <p className="text-body-large mb-8 max-w-3xl mx-auto lg:mx-0">
                Streamline your bus operations with our comprehensive management platform. 
                From route planning to booking management, we've got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/login"
                  className="btn-primary btn-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/search"
                  className="btn-secondary btn-lg"
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
                <div className="absolute -bottom-4 -right-4 bg-background rounded-lg shadow-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-body-small font-semibold text-text-dark">Live Tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-heading-2 mb-4">
              Everything You Need to Manage Your Bus Business
            </h2>
            <p className="text-body-large max-w-2xl mx-auto">
              Our platform provides all the tools necessary for efficient bus operations and customer management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-interactive text-center">
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  alt="Fleet management"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </div>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-heading-4 mb-2">Fleet Management</h3>
              <p className="text-body">
                Manage your entire bus fleet with real-time tracking, maintenance schedules, and performance analytics.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-interactive text-center">
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  alt="Route planning"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </div>
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-heading-4 mb-2">Route Planning</h3>
              <p className="text-body">
                Optimize routes, manage stops, and track real-time location data for better service delivery.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-interactive text-center">
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  alt="Customer management"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </div>
              <div className="w-16 h-16 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-info" />
              </div>
              <h3 className="text-heading-4 mb-2">Customer Management</h3>
              <p className="text-body">
                Handle bookings, customer profiles, and provide excellent customer service with our integrated tools.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card-interactive text-center">
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  alt="Analytics dashboard"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </div>
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-warning" />
              </div>
              <h3 className="text-heading-4 mb-2">Analytics & Reports</h3>
              <p className="text-body">
                Get detailed insights into your business performance with comprehensive analytics and reporting.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card-interactive text-center">
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  alt="Security features"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </div>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-heading-4 mb-2">Role-Based Access</h3>
              <p className="text-body">
                Secure access control with different permission levels for admins, employees, and customers.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card-interactive text-center">
              <div className="mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80"
                  alt="Real-time updates"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              </div>
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-error" />
              </div>
              <h3 className="text-heading-4 mb-2">Real-Time Updates</h3>
              <p className="text-body">
                Stay updated with real-time notifications, schedule changes, and instant booking confirmations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Access Section */}
      <section className="py-20 bg-hover-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-heading-2 mb-4">
              Designed for Every Role
            </h2>
            <p className="text-body-large max-w-2xl mx-auto">
              Our platform adapts to your role, providing the right tools and information for your specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Master Admin */}
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-heading-4 mb-2">Master Admin</h3>
              <p className="text-body-small mb-4">
                Full system control, user management, and global analytics.
              </p>
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-semibold text-body-small transition-colors duration-200"
              >
                Access Dashboard →
              </Link>
            </div>

            {/* Bus Owner */}
            <div className="card text-center">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bus className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-heading-4 mb-2">Bus Owner</h3>
              <p className="text-body-small mb-4">
                Manage your fleet, routes, and business operations.
              </p>
              <Link
                to="/login"
                className="text-success hover:text-success/80 font-semibold text-body-small transition-colors duration-200"
              >
                Access Dashboard →
              </Link>
            </div>

            {/* Bus Admin */}
            <div className="card text-center">
              <div className="w-12 h-12 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-info" />
              </div>
              <h3 className="text-heading-4 mb-2">Bus Admin</h3>
              <p className="text-body-small mb-4">
                Daily operations, trip management, and team coordination.
              </p>
              <Link
                to="/login"
                className="text-info hover:text-info/80 font-semibold text-body-small transition-colors duration-200"
              >
                Access Dashboard →
              </Link>
            </div>

            {/* Booking Manager */}
            <div className="card text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-warning" />
              </div>
              <h3 className="text-heading-4 mb-2">Booking Manager</h3>
              <p className="text-body-small mb-4">
                Handle reservations, customer service, and booking analytics.
              </p>
              <Link
                to="/login"
                className="text-warning hover:text-warning/80 font-semibold text-body-small transition-colors duration-200"
              >
                Access Dashboard →
              </Link>
            </div>

            {/* Bus Employee */}
            <div className="card text-center">
              <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-error" />
              </div>
              <h3 className="text-heading-4 mb-2">Bus Employee</h3>
              <p className="text-body-small mb-4">
                View schedules, update trip status, and manage daily tasks.
              </p>
              <Link
                to="/login"
                className="text-error hover:text-error/80 font-semibold text-body-small transition-colors duration-200"
              >
                Access Dashboard →
              </Link>
            </div>

            {/* Customer */}
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-heading-4 mb-2">Customer</h3>
              <p className="text-body-small mb-4">
                Book trips, manage reservations, and track your travel history.
              </p>
              <Link
                to="/search"
                className="text-primary hover:text-primary/80 font-semibold text-body-small transition-colors duration-200"
              >
                Start Booking →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-heading-2 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-body-large max-w-2xl mx-auto">
              Don't just take our word for it. Here's what bus operators are saying about SafeRun.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="card">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="John Smith"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-text-dark">John Smith</h4>
                  <p className="text-body-small">Bus Owner, City Transport</p>
                </div>
              </div>
              <p className="text-body italic">
                "SafeRun has revolutionized our operations. The real-time tracking and analytics have helped us increase efficiency by 40%."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="card">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="Sarah Johnson"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-text-dark">Sarah Johnson</h4>
                  <p className="text-body-small">Booking Manager, Metro Lines</p>
                </div>
              </div>
              <p className="text-body italic">
                "The booking management system is incredibly user-friendly. Our customers love the seamless experience."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="card">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                  alt="Mike Chen"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-text-dark">Mike Chen</h4>
                  <p className="text-body-small">Bus Admin, Express Transit</p>
                </div>
              </div>
              <p className="text-body italic">
                "The role-based access control gives us perfect security while maintaining operational flexibility."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-heading-2 text-text mb-4">
            Ready to Transform Your Bus Operations?
          </h2>
          <p className="text-body-large text-text/80 mb-8 max-w-2xl mx-auto">
            Join thousands of bus operators who trust SafeRun for their daily operations.
          </p>
          <Link
            to="/login"
            className="btn-secondary btn-lg"
          >
            Get Started Today
          </Link>
        </div>
      </section>

    </div>
  )
}

export default LandingPage
