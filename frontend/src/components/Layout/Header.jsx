import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { ShoppingCart, Person, Logout, Menu, Close, AccountCircle, ArrowDropDown } from '@mui/icons-material'
import { useState, useRef, useEffect } from 'react'
import { getCart } from '../../store/slices/cartSlice'
import Logo from '../Logo/Logo'

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { itemCount } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef(null)

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const handleCartClick = () => {
    if (isAuthenticated) {
      dispatch(getCart())
      navigate('/cart')
    } else {
      navigate('/login')
    }
  }

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false)
      }
    }

    if (accountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [accountMenuOpen])

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`relative text-gray-700 hover:text-primary-600 transition-all duration-300 group py-2 ${
                isActive('/') ? 'text-primary-600' : ''
              }`}
            >
              <span className="relative z-10 font-medium">Home</span>
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary-600 transition-all duration-300 ${
                isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
            <Link 
              to="/about" 
              className={`relative text-gray-700 hover:text-primary-600 transition-all duration-300 group py-2 ${
                isActive('/about') ? 'text-primary-600' : ''
              }`}
            >
              <span className="relative z-10 font-medium">About Us</span>
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary-600 transition-all duration-300 ${
                isActive('/about') ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
            <Link 
              to="/products" 
              className={`relative text-gray-700 hover:text-primary-600 transition-all duration-300 group py-2 ${
                isActive('/products') ? 'text-primary-600' : ''
              }`}
            >
              <span className="relative z-10 font-medium">Products</span>
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary-600 transition-all duration-300 ${
                isActive('/products') ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
            <Link 
              to="/news" 
              className={`relative text-gray-700 hover:text-primary-600 transition-all duration-300 group py-2 ${
                isActive('/news') ? 'text-primary-600' : ''
              }`}
            >
              <span className="relative z-10 font-medium">News</span>
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary-600 transition-all duration-300 ${
                isActive('/news') ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
            <Link 
              to="/contact" 
              className={`relative text-gray-700 hover:text-primary-600 transition-all duration-300 group py-2 ${
                isActive('/contact') ? 'text-primary-600' : ''
              }`}
            >
              <span className="relative z-10 font-medium">Contact</span>
              <span className={`absolute bottom-0 left-0 h-0.5 bg-primary-600 transition-all duration-300 ${
                isActive('/contact') ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Account Menu - Only show when authenticated */}
            {isAuthenticated ? (
              <div className="relative" ref={accountMenuRef}>
                {/* Account Button */}
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                >
                  <AccountCircle className="w-6 h-6 text-gray-700 transition-transform duration-200 hover:scale-110" />
                  <span className="text-gray-700 font-medium">{user?.name || 'Account'}</span>
                  <ArrowDropDown className={`w-5 h-5 text-gray-700 transition-transform duration-300 ${accountMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Account Dropdown Menu */}
                {accountMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 backdrop-blur-sm"
                    style={{
                      animation: 'fadeIn 0.2s ease-out',
                      transformOrigin: 'top right'
                    }}
                  >
                    {/* User Info */}
                    <div 
                      className="px-4 py-3 border-b border-gray-200"
                      style={{
                        animation: 'slideIn 0.2s ease-out 0.05s both'
                      }}
                    >
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      {user?.role === 'admin' && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold bg-primary-100 text-primary-700 rounded animate-pulse hover:animate-none transition-all duration-200">
                          Admin
                        </span>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      {/* For Admin: Only show Admin Dashboard */}
                      {user?.role === 'admin' ? (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:translate-x-1 group"
                          style={{
                            animation: 'slideIn 0.2s ease-out 0.1s both'
                          }}
                        >
                          <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          <span>Admin Dashboard</span>
                        </Link>
                      ) : (
                        <>
                          {/* Cart - Only for customers */}
                          <button
                            onClick={() => {
                              handleCartClick()
                              setAccountMenuOpen(false)
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:translate-x-1 group"
                            style={{
                              animation: 'slideIn 0.2s ease-out 0.1s both'
                            }}
                          >
                            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                            <span>Cart</span>
                            {itemCount > 0 && (
                              <span className="ml-auto bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse hover:animate-none transition-all duration-200 group-hover:scale-125">
                                {itemCount}
                              </span>
                            )}
                          </button>

                          {/* Profile - Only for customers */}
                          <Link
                            to="/profile"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:translate-x-1 group"
                            style={{
                              animation: 'slideIn 0.2s ease-out 0.15s both'
                            }}
                          >
                            <Person className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                            <span>Profile</span>
                          </Link>

                          {/* Orders - Only for customers */}
                          <Link
                            to="/orders"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:translate-x-1 group"
                            style={{
                              animation: 'slideIn 0.2s ease-out 0.2s both'
                            }}
                          >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span>Orders</span>
                          </Link>
                        </>
                      )}

                      {/* Logout */}
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={() => {
                          handleLogout()
                          setAccountMenuOpen(false)
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-all duration-200 hover:translate-x-1 group"
                        style={{
                          animation: 'slideIn 0.2s ease-out 0.35s both'
                        }}
                      >
                        <Logout className="w-5 h-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-200" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Mobile Account Button */}
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="md:hidden p-2 text-gray-700 transition-transform duration-200 active:scale-95"
                >
                  <AccountCircle className="w-6 h-6 transition-transform duration-200 hover:scale-110" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 transition-transform duration-200 active:scale-95"
            >
              {mobileMenuOpen ? (
                <Close className="w-6 h-6 transition-transform duration-300 rotate-0" />
              ) : (
                <Menu className="w-6 h-6 transition-transform duration-300 hover:scale-110" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden py-4 border-t"
            style={{
              animation: 'fadeIn 0.3s ease-out'
            }}
          >
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`relative text-gray-700 hover:text-primary-600 transition-all duration-300 group py-2 pl-4 border-l-2 hover:translate-x-2 ${
                  isActive('/') 
                    ? 'text-primary-600 border-primary-600 font-semibold' 
                    : 'border-transparent hover:border-primary-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  animation: 'slideIn 0.2s ease-out 0.05s both'
                }}
              >
                <span>Home</span>
              </Link>
              <Link
                to="/about"
                className={`relative text-gray-700 hover:text-primary-600 transition-all duration-300 group py-2 pl-4 border-l-2 hover:translate-x-2 ${
                  isActive('/about') 
                    ? 'text-primary-600 border-primary-600 font-semibold' 
                    : 'border-transparent hover:border-primary-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  animation: 'slideIn 0.2s ease-out 0.1s both'
                }}
              >
                <span>About Us</span>
              </Link>
              <Link
                to="/products"
                className={`relative text-gray-700 hover:text-primary-600 transition-all duration-300 group py-2 pl-4 border-l-2 hover:translate-x-2 ${
                  isActive('/products') 
                    ? 'text-primary-600 border-primary-600 font-semibold' 
                    : 'border-transparent hover:border-primary-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  animation: 'slideIn 0.2s ease-out 0.15s both'
                }}
              >
                <span>Products</span>
              </Link>
              <Link
                to="/news"
                className={`relative text-gray-700 hover:text-primary-600 transition-all duration-300 group py-2 pl-4 border-l-2 hover:translate-x-2 ${
                  isActive('/news') 
                    ? 'text-primary-600 border-primary-600 font-semibold' 
                    : 'border-transparent hover:border-primary-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  animation: 'slideIn 0.2s ease-out 0.2s both'
                }}
              >
                <span>News</span>
              </Link>
              <Link
                to="/contact"
                className={`relative text-gray-700 hover:text-primary-600 transition-all duration-300 group py-2 pl-4 border-l-2 hover:translate-x-2 ${
                  isActive('/contact') 
                    ? 'text-primary-600 border-primary-600 font-semibold' 
                    : 'border-transparent hover:border-primary-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  animation: 'slideIn 0.2s ease-out 0.25s both'
                }}
              >
                <span>Contact</span>
              </Link>
              {isAuthenticated ? (
                <>
                  {/* For Admin: Only show Admin Dashboard */}
                  {user?.role === 'admin' ? (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="text-gray-700 hover:text-primary-600 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        onClick={() => {
                          handleLogout()
                          setMobileMenuOpen(false)
                        }}
                        className="text-left text-gray-700 hover:text-red-600 transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Cart - Only for customers */}
                      <button
                        onClick={() => {
                          handleCartClick()
                          setMobileMenuOpen(false)
                        }}
                        className="text-left text-gray-700 hover:text-primary-600 transition-colors flex items-center space-x-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span>Cart {itemCount > 0 && `(${itemCount})`}</span>
                      </button>
                      <Link
                        to="/profile"
                        className="text-gray-700 hover:text-primary-600 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="text-gray-700 hover:text-primary-600 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Orders
                      </Link>
                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        onClick={() => {
                          handleLogout()
                          setMobileMenuOpen(false)
                        }}
                        className="text-left text-gray-700 hover:text-red-600 transition-colors"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
