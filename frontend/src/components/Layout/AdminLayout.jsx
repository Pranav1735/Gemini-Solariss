import { Outlet, Link, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../store/slices/authSlice'
import { AccountCircle, Logout, Menu, Close } from '@mui/icons-material'
import { useState, useRef, useEffect } from 'react'
import Logo from '../Logo/Logo'

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef(null)

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/admin')
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

  const menuItems = [
    { path: 'dashboard', label: 'Dashboard', icon: '📊' },
    { path: 'products', label: 'Products', icon: '📦' },
    { path: 'orders', label: 'Orders', icon: '📋' },
    { path: 'users', label: 'Users', icon: '👥' },
    { path: 'coupons', label: 'Coupons', icon: '🎫' },
    { path: 'analytics', label: 'Analytics', icon: '📈' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Menu Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <Logo />
            </div>

            {/* User Menu */}
            <div className="relative" ref={accountMenuRef}>
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
              >
                <AccountCircle className="w-6 h-6 text-gray-700" />
                <span className="text-gray-700 font-medium">{user?.name || 'Admin'}</span>
              </button>

              {accountMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                  style={{
                    animation: 'fadeIn 0.2s ease-out'
                  }}
                >
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-all duration-200"
                  >
                    <Logout className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Sidebar */}
        <aside
          className={`bg-white border-r border-gray-200 transition-all duration-300 h-[calc(100vh-4rem)] fixed left-0 top-16 overflow-y-auto ${
            sidebarOpen ? 'w-64' : 'w-0'
          }`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const fullPath = `/admin/${item.path}`
              return (
                <Link
                  key={item.path}
                  to={fullPath}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive(fullPath)
                      ? 'bg-primary-100 text-primary-700 font-semibold'
                      : 'hover:bg-primary-50 hover:text-primary-600 text-gray-700'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
