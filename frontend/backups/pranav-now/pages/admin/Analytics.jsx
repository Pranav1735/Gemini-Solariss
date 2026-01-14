import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../store/api'
import { ArrowBack, TrendingUp, TrendingDown, Assessment } from '@mui/icons-material'

const Analytics = () => {
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('year')

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const [salesResponse, dashboardResponse] = await Promise.all([
        api.get(`/admin/analytics/sales?period=${period}`).catch(err => {
          console.error('Analytics API error:', err)
          return { data: { sales: [] } }
        }),
        api.get('/admin/dashboard').catch(err => {
          console.error('Dashboard API error:', err)
          return { data: { stats: null } }
        })
      ])

      console.log('Analytics Response:', salesResponse.data)
      console.log('Dashboard Response:', dashboardResponse.data)

      const salesData = salesResponse.data?.sales || []
      const stats = dashboardResponse.data?.stats

      setAnalytics({
        sales: salesData,
        stats
      })

      // Calculate forecast
      if (salesData.length > 0) {
        const forecastData = calculateForecast(salesData)
        setForecast(forecastData)
      } else {
        console.log('No sales data available for period:', period)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      console.error('Error details:', error.response?.data)
    } finally {
      setLoading(false)
    }
  }

  const calculateForecast = (salesData) => {
    if (salesData.length < 2) return null

    const recentData = salesData.slice(-6)
    const revenues = recentData.map(d => parseFloat(d.revenue || 0))
    const orders = recentData.map(d => parseInt(d.orders || 0))

    const revenueGrowth = revenues.length > 1 
      ? ((revenues[revenues.length - 1] - revenues[0]) / Math.max(revenues[0], 1)) * 100 
      : 0
    
    const orderGrowth = orders.length > 1
      ? ((orders[orders.length - 1] - orders[0]) / Math.max(orders[0], 1)) * 100
      : 0

    const lastRevenue = revenues[revenues.length - 1] || 0
    const lastOrders = orders[orders.length - 1] || 0
    
    const projectedRevenue = lastRevenue * (1 + revenueGrowth / 100)
    const projectedOrders = Math.round(lastOrders * (1 + orderGrowth / 100))

    // Calculate trends
    const avgRevenue = revenues.reduce((a, b) => a + b, 0) / revenues.length
    const avgOrders = orders.reduce((a, b) => a + b, 0) / orders.length

    return {
      revenueGrowth: revenueGrowth.toFixed(1),
      orderGrowth: orderGrowth.toFixed(1),
      projectedRevenue,
      projectedOrders,
      avgRevenue,
      avgOrders,
      trend: revenueGrowth > 0 ? 'up' : 'down'
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const sales = analytics?.sales || []
  const stats = analytics?.stats || {}
  const maxRevenue = Math.max(...sales.map(s => parseFloat(s.revenue || 0)), 1)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowBack className="mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Forecasting</h1>
        <p className="text-gray-600">Detailed insights and revenue forecasting</p>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <div className="flex gap-2">
          {['week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                period === p
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Forecast Cards */}
      {forecast && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100 text-sm">Projected Revenue</span>
              <Assessment className="text-white opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">
              ₹{forecast.projectedRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div className="flex items-center text-sm">
              {forecast.trend === 'up' ? (
                <TrendingUp className="mr-1" />
              ) : (
                <TrendingDown className="mr-1" />
              )}
              <span>{forecast.revenueGrowth}% growth</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-100 text-sm">Projected Orders</span>
              <Assessment className="text-white opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{forecast.projectedOrders}</div>
            <div className="flex items-center text-sm">
              {parseFloat(forecast.orderGrowth) > 0 ? (
                <TrendingUp className="mr-1" />
              ) : (
                <TrendingDown className="mr-1" />
              )}
              <span>{forecast.orderGrowth}% growth</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100 text-sm">Avg Revenue</span>
              <Assessment className="text-white opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">
              ₹{forecast.avgRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div className="text-sm text-purple-100">Per period</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-100 text-sm">Avg Orders</span>
              <Assessment className="text-white opacity-80" />
            </div>
            <div className="text-3xl font-bold mb-1">{Math.round(forecast.avgOrders)}</div>
            <div className="text-sm text-orange-100">Per period</div>
          </div>
        </div>
      )}

      {/* Sales Chart */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Sales Trend</h2>
        {sales.length > 0 ? (
          <div className="space-y-4">
            {sales.map((sale, index) => {
              const revenue = parseFloat(sale.revenue || 0)
              const width = (revenue / maxRevenue) * 100
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-24 text-sm text-gray-600">{sale._id || 'N/A'}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{revenue.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-gray-600">{sale.orders || 0} orders</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-primary-600 to-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${width}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No sales data available for this period
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Sales</h3>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            ₹{sales.reduce((sum, s) => sum + parseFloat(s.revenue || 0), 0).toLocaleString('en-IN')}
          </div>
          <div className="text-sm text-gray-600">
            {sales.reduce((sum, s) => sum + parseInt(s.orders || 0), 0)} total orders
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Daily</h3>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            ₹{sales.length > 0 
              ? (sales.reduce((sum, s) => sum + parseFloat(s.revenue || 0), 0) / sales.length).toLocaleString('en-IN', { maximumFractionDigits: 0 })
              : '0'}
          </div>
          <div className="text-sm text-gray-600">Revenue per day</div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Rate</h3>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {forecast ? `${forecast.revenueGrowth}%` : '0%'}
          </div>
          <div className="text-sm text-gray-600">
            {forecast && forecast.trend === 'up' ? (
              <span className="text-green-600">↑ Positive trend</span>
            ) : (
              <span className="text-red-600">↓ Needs attention</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics

