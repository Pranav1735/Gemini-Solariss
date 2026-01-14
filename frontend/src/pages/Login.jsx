import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearError, logout } from '../store/slices/authSlice'
import { toast } from 'react-toastify'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { isAuthenticated, user, loading, error } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const from = location.state?.from?.pathname || '/'

  useEffect(() => {
    // Only redirect if authenticated AND not an admin (admins should use /admin page)
    if (isAuthenticated && user && user.role !== 'admin') {
      navigate(from, { replace: true })
    } else if (isAuthenticated && user && user.role === 'admin') {
      // If admin somehow got authenticated, logout them
      dispatch(logout())
      toast.error('Admin users must login via /admin page')
    }
  }, [isAuthenticated, user, navigate, from, dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login(formData))
      .unwrap()
      .then((result) => {
        // Check if user is admin - admins should only login via /admin page
        if (result.user && result.user.role === 'admin') {
          // Logout immediately and show error
          dispatch(logout())
          toast.error('Admin users must login via /admin page')
          return
        }
        // Regular users can proceed
        toast.success('Login successful')
        navigate(from, { replace: true })
      })
      .catch((error) => {
        toast.error(error || 'Login failed')
      })
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="card">
        <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login

