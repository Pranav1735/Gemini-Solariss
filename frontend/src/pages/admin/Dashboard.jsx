import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import api from '../../store/api'
import { 
  Inventory, 
  People, 
  Category, 
  ShoppingCart, 
  TrendingUp, 
  BarChart,
  Assessment,
  ArrowForward
} from '@mui/icons-material'

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [forecast, setForecast] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [statsResponse, analyticsResponse] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/analytics/sales?period=year').catch(() => ({ data: { sales: [] } }))
        ])
        
        console.log('Dashboard API Response:', statsResponse.data)
        
        if (statsResponse.data && statsResponse.data.stats) {
          setStats(statsResponse.data.stats)
        } else {
          console.error('Invalid response structure:', statsResponse.data)
          // Set default empty stats
          setStats({
            overview: {
              totalOrders: 0,
              totalRevenue: 0,
              totalUsers: 0,
              totalProducts: 0,
              totalCategories: 0
            },
            categories: 0,
            monthly: {
              orders: 0,
              revenue: 0
            },
            yearly: {
              revenue: 0
            },
            recentOrders: []
          })
        }
        
        // Calculate forecasting
        const salesData = analyticsResponse.data?.sales || []
        if (salesData.length > 0) {
          const forecastData = calculateForecast(salesData)
          setForecast(forecastData)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        console.error('Error details:', error.response?.data || error.message)
        // Set default empty stats on error
        setStats({
          overview: {
            totalOrders: 0,
            totalRevenue: 0,
            totalUsers: 0,
            totalProducts: 0,
            totalCategories: 0
          },
          categories: 0,
          monthly: {
            orders: 0,
            revenue: 0
          },
          yearly: {
            revenue: 0
          },
          recentOrders: []
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const calculateForecast = (salesData) => {
    if (salesData.length < 2) return null

    // Simple linear regression for forecasting
    const recentData = salesData.slice(-6) // Last 6 data points
    const revenues = recentData.map(d => parseFloat(d.revenue || 0))
    const orders = recentData.map(d => parseInt(d.orders || 0))

    // Calculate average growth rate
    const revenueGrowth = revenues.length > 1 
      ? ((revenues[revenues.length - 1] - revenues[0]) / revenues[0]) * 100 
      : 0
    
    const orderGrowth = orders.length > 1
      ? ((orders[orders.length - 1] - orders[0]) / orders[0]) * 100
      : 0

    // Project next month
    const lastRevenue = revenues[revenues.length - 1] || 0
    const lastOrders = orders[orders.length - 1] || 0
    
    const projectedRevenue = lastRevenue * (1 + revenueGrowth / 100)
    const projectedOrders = Math.round(lastOrders * (1 + orderGrowth / 100))

    return {
      revenueGrowth: revenueGrowth.toFixed(1),
      orderGrowth: orderGrowth.toFixed(1),
      projectedRevenue,
      projectedOrders
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Loading dashboard data...</p>
      </div>
    )
  }

  // Ensure stats exists
  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load dashboard data. Please refresh the page.</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  const overview = stats.overview || {}
  const monthly = stats.monthly || {}
  const recentOrders = stats.recentOrders || []

  // Calculate metrics with proper type conversion
  const totalOrders = Number(overview.totalOrders) || 0
  const totalRevenue = parseFloat(overview.totalRevenue) || 0
  const totalUsers = Number(overview.totalUsers) || 0
  const totalProducts = Number(overview.totalProducts) || 0
  const categories = Number(stats.categories) || 0
  const monthlyOrders = Number(monthly.orders) || 0
  const monthlyRevenue = parseFloat(monthly.revenue) || 0
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Debug log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Dashboard Stats:', {
      totalOrders,
      totalRevenue,
      totalUsers,
      totalProducts,
      categories,
      monthlyOrders,
      monthlyRevenue
    })
  }

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name || 'Admin'}!</p>
      </div>

      {/* Top Row - Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total Products */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-4xl font-bold text-gray-900 mb-1">{totalProducts}</div>
              <div className="text-sm text-gray-600">Total Products</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-3">
              <Inventory className="text-white text-2xl" />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-4xl font-bold text-gray-900 mb-1">{categories || 0}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-yellow-500 rounded-lg p-3">
              <Category className="text-white text-2xl" />
            </div>
          </div>
        </div>

        {/* Registered Users */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-4xl font-bold text-gray-900 mb-1">{totalUsers}</div>
              <div className="text-sm text-gray-600">Registered Users</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg p-3">
              <People className="text-white text-2xl" />
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-4xl font-bold text-gray-900 mb-1">{totalOrders}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
              <div className="text-xs text-green-600 mt-1">+{monthlyOrders} in last 30 days</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg p-3">
              <ShoppingCart className="text-white text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row - Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-xs text-orange-600 mt-1">From all orders</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-lg p-3">
              <TrendingUp className="text-white text-2xl" />
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ₹{averageOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-sm text-gray-600">Average Order Value</div>
              <div className="text-xs text-blue-600 mt-1">Per order</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg p-3">
              <BarChart className="text-white text-2xl" />
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ₹{monthlyRevenue.toLocaleString('en-IN')}
              </div>
              <div className="text-sm text-gray-600">This Month Revenue</div>
              <div className="text-xs text-purple-600 mt-1">Current month sales</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg p-3">
              <Assessment className="text-white text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Actions and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pending Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Pending Actions</h2>
          </div>
          <p className="text-gray-600 text-sm mb-4">Items waiting for your attention</p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/admin/orders')}
              className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ShoppingCart />
              <span>Pending Orders</span>
            </button>
          </div>
        </div>

        {/* View Analytics */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">View Analytics</h2>
            <BarChart className="text-blue-500" />
          </div>
          <p className="text-gray-600 text-sm mb-4">Detailed insights and reports</p>
          {forecast && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Forecast (Next Month)</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-gray-600">Projected Revenue</div>
                  <div className="text-lg font-bold text-blue-700">
                    ₹{forecast.projectedRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </div>
                  <div className={`text-xs ${parseFloat(forecast.revenueGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(forecast.revenueGrowth) >= 0 ? '+' : ''}{forecast.revenueGrowth}% growth
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Projected Orders</div>
                  <div className="text-lg font-bold text-blue-700">{forecast.projectedOrders}</div>
                  <div className={`text-xs ${parseFloat(forecast.orderGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {parseFloat(forecast.orderGrowth) >= 0 ? '+' : ''}{forecast.orderGrowth}% growth
                  </div>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => navigate('/admin/analytics')}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>View Full Analytics</span>
            <ArrowForward />
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        {recentOrders && recentOrders.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <div className="font-semibold text-gray-900">{order.orderNumber}</div>
                    <div className="text-sm text-gray-600">{order.user?.name || order.user?.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">₹{parseFloat(order.total || 0).toLocaleString('en-IN')}</div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/admin/orders')}
              className="mt-4 w-full text-center text-primary-600 hover:text-primary-700 font-semibold text-sm"
            >
              View All Orders →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminDashboard
