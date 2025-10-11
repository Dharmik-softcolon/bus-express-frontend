import { Bus, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container-responsive py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-3">
              <Bus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              <span className="text-base sm:text-lg font-bold">SafeRun</span>
            </div>
            <p className="text-white mb-3 max-w-md text-xs sm:text-sm leading-relaxed">
              Your trusted partner for comfortable and reliable bus travel.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-white hover:text-white transition-colors duration-200 p-1.5 hover:bg-hover rounded-lg">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-white hover:text-white transition-colors duration-200 p-1.5 hover:bg-hover rounded-lg">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-white hover:text-white transition-colors duration-200 p-1.5 hover:bg-hover rounded-lg">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-white hover:text-white transition-colors duration-200 p-1.5 hover:bg-hover rounded-lg">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold mb-2 text-white">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <a href="/" className="text-white hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/search" className="text-white hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                  Search Buses
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold mb-2 text-white">Services</h3>
            <ul className="space-y-1">
              <li>
                <a href="#" className="text-white hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                  Bus Booking
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                  Route Planning
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                  Corporate Travel
                </a>
              </li>
              <li>
                <a href="#" className="text-white hover:text-white transition-colors duration-200 text-xs sm:text-sm">
                  Group Bookings
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold mb-2 text-white">Contact Info</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-white flex-shrink-0" />
                <div>
                  <span className="text-white text-xs sm:text-sm block">+1 (555) 123-4567</span>
                  <span className="text-white text-xs">24/7 Support</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-white flex-shrink-0" />
                <div>
                  <span className="text-white text-xs sm:text-sm block break-all">info@saferun.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-6 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-white text-xs text-center sm:text-left">
              © 2024 SafeRun. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-3">
              <a href="#" className="text-white hover:text-white transition-colors duration-200 text-xs">
                Privacy Policy
              </a>
              <a href="#" className="text-white hover:text-white transition-colors duration-200 text-xs">
                Terms of Service
              </a>
              <a href="#" className="text-white hover:text-white transition-colors duration-200 text-xs">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

