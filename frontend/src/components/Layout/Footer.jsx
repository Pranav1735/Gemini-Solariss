import { Link } from 'react-router-dom'
import { Email, Phone, LocationOn } from '@mui/icons-material'
import Logo from '../Logo/Logo'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Logo variant="dark" />
            </div>
            <p className="text-gray-400 mb-4">
              Premium solar panels and renewable energy solutions for residential and commercial use.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <LocationOn className="w-4 h-4" />
                <span>No.63-A, Anna Enclave, East Coast Road, Injambakkam, Chennai - 600115, Tamil Nadu, India</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+91-9876543210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Email className="w-4 h-4" />
                <span>admin@geminisolariss.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-400 hover:text-white transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=solar-panels" className="text-gray-400 hover:text-white transition-colors">
                  Solar Panels
                </Link>
              </li>
              <li>
                <Link to="/products?category=inverters" className="text-gray-400 hover:text-white transition-colors">
                  Inverters
                </Link>
              </li>
              <li>
                <Link to="/products?category=batteries" className="text-gray-400 hover:text-white transition-colors">
                  Batteries
                </Link>
              </li>
              <li>
                <Link to="/products?category=mounting" className="text-gray-400 hover:text-white transition-colors">
                  Mounting Systems
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-400 hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-400 hover:text-white transition-colors">
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} GEMINI SOLARISS. All rights reserved.</p>
          <p className="mt-2">
            Developed by{' '}
            <a 
              href="https://www.techdlt.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors underline"
            >
              Tech-DLT Software Solutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
