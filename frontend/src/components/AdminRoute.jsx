import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getMe } from '../store/slices/authSlice'

const AdminRoute = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth)

  useEffect(() => {
    // Ensure user data is loaded
    if (isAuthenticated && !user) {
      dispatch(getMe())
    }
  }, [isAuthenticated, user, dispatch])

  // Show loading while checking auth
  if (loading || (isAuthenticated && !user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  if (user?.role !== 'admin') {
    console.log('User role check:', { role: user?.role, user })
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminRoute

