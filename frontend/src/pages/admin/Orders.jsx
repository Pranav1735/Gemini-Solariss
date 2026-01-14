import { useState, useEffect } from 'react'
import api from '../../store/api'
import { toast } from 'react-toastify'
import { 
  Search, 
  CheckCircle, 
  Pending, 
  Done,
  Visibility,
  Edit,
  LocalShipping,
  Person,
  CalendarToday,
  Payment,
  Inventory
} from '@mui/icons-material'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [allOrders, setAllOrders] = useState([]) // Store all orders for badge counts
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('new') // 'new', 'pending', 'completed'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [orderDetails, setOrderDetails] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [activeTab])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await api.get('/orders/admin/all')
      let allOrdersData = response.data.orders || []
      
      console.log('Fetched orders:', allOrdersData.length)
      console.log('Sample order:', allOrdersData[0])

      // Store all orders for badge counts
      setAllOrders(allOrdersData)

      // Filter orders based on active tab
      let filteredOrders = allOrdersData
      switch (activeTab) {
        case 'new':
          // New orders: status is 'pending' (regardless of payment status for admin view)
          filteredOrders = allOrdersData.filter(order => 
            order.status === 'pending'
          )
          break
        case 'pending':
          // Pending orders: status is 'confirmed', 'processing', or 'shipped'
          filteredOrders = allOrdersData.filter(order => 
            ['confirmed', 'processing', 'shipped'].includes(order.status)
          )
          break
        case 'completed':
          // Completed orders: status is 'delivered'
          filteredOrders = allOrdersData.filter(order => 
            order.status === 'delivered'
          )
          break
        default:
          filteredOrders = allOrdersData
          break
      }

      // Apply search filter
      if (searchTerm) {
        filteredOrders = filteredOrders.filter(order =>
          order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      console.log(`Filtered orders for ${activeTab}:`, filteredOrders.length)
      setOrders(filteredOrders)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      console.error('Error details:', error.response?.data)
      toast.error(error.response?.data?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [searchTerm])

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoadingDetails(true)
      const response = await api.get(`/orders/${orderId}`)
      setOrderDetails(response.data.order)
    } catch (error) {
      console.error('Failed to fetch order details:', error)
      toast.error('Failed to load order details')
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleViewDetails = async (order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
    await fetchOrderDetails(order.id)
  }

  const handleAcceptOrder = async (order) => {
    try {
      await api.put(`/orders/${order.id}/status`, {
        status: 'confirmed'
      })
      toast.success('Order accepted and moved to pending orders')
      fetchOrders()
      if (showOrderDetails && selectedOrder?.id === order.id) {
        fetchOrderDetails(order.id)
      }
    } catch (error) {
      toast.error('Failed to accept order')
    }
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, {
        status: newStatus
      })
      toast.success('Order status updated successfully')
      fetchOrders()
      if (showOrderDetails && selectedOrder?.id === orderId) {
        fetchOrderDetails(orderId)
      }
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const handleCompleteOrder = async (order) => {
    try {
      await api.put(`/orders/${order.id}/status`, {
        status: 'delivered'
      })
      toast.success('Order marked as completed')
      fetchOrders()
      if (showOrderDetails && selectedOrder?.id === order.id) {
        fetchOrderDetails(order.id)
      }
    } catch (error) {
      toast.error('Failed to complete order')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-purple-100 text-purple-800'
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>Debug:</strong> Total orders fetched: {allOrders.length} | 
            Filtered for "{activeTab}": {orders.length}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md p-2 mb-6 border border-gray-100 flex gap-2">
        <button
          onClick={() => setActiveTab('new')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'new'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Pending />
          <span>New Orders</span>
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
            activeTab === 'new' ? 'bg-white text-primary-600' : 'bg-gray-200 text-gray-700'
          }`}>
            {allOrders.filter(o => o.status === 'pending').length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'pending'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <LocalShipping />
          <span>Pending Orders</span>
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
            activeTab === 'pending' ? 'bg-white text-primary-600' : 'bg-gray-200 text-gray-700'
          }`}>
            {allOrders.filter(o => ['confirmed', 'processing', 'shipped'].includes(o.status)).length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === 'completed'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Done />
          <span>Completed Orders</span>
          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
            activeTab === 'completed' ? 'bg-white text-primary-600' : 'bg-gray-200 text-gray-700'
          }`}>
            {allOrders.filter(o => o.status === 'delivered').length}
          </span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order number, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Inventory className="mx-auto text-gray-400 mb-4" style={{ fontSize: 64 }} />
            <p className="text-gray-600 text-lg">No {activeTab} orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          #{order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-600">
                          ₹{parseFloat(order.total || 0).toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {order.items?.length || 0} item(s)
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Person className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.user?.name || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.user?.email || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          order.paymentStatus === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.paymentStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.paymentStatus}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {order.paymentMethod?.toUpperCase() || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {activeTab === 'pending' ? (
                        <select
                          value={order.status}
                          onChange={(e) => {
                            const newStatus = e.target.value
                            if (newStatus === 'delivered') {
                              if (window.confirm('Mark this order as delivered? It will move to Completed Orders.')) {
                                handleUpdateStatus(order.id, newStatus)
                              } else {
                                e.target.value = order.status // Reset to original value
                              }
                            } else {
                              handleUpdateStatus(order.id, newStatus)
                            }
                          }}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border-2 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 ${getStatusColor(order.status)} hover:shadow-md`}
                          style={{ 
                            backgroundColor: order.status === 'confirmed' ? '#dbeafe' : 
                                            order.status === 'processing' ? '#e9d5ff' : 
                                            order.status === 'shipped' ? '#e0e7ff' : 
                                            '#f3f4f6',
                            color: order.status === 'confirmed' ? '#1e40af' : 
                                   order.status === 'processing' ? '#6b21a8' : 
                                   order.status === 'shipped' ? '#4338ca' : 
                                   '#374151',
                            borderColor: order.status === 'confirmed' ? '#93c5fd' : 
                                        order.status === 'processing' ? '#c084fc' : 
                                        order.status === 'shipped' ? '#a5b4fc' : 
                                        '#d1d5db'
                          }}
                        >
                          <option value="confirmed" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>Confirmed</option>
                          <option value="processing" style={{ backgroundColor: '#e9d5ff', color: '#6b21a8' }}>Processing</option>
                          <option value="shipped" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>Shipped</option>
                          <option value="delivered" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>Delivered</option>
                        </select>
                      ) : activeTab === 'new' ? (
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                          <button
                            onClick={() => handleAcceptOrder(order)}
                            className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                            title="Accept Order"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarToday className="w-4 h-4 mr-1" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Visibility />
                        </button>
                        {activeTab === 'new' && (
                          <button
                            onClick={() => handleAcceptOrder(order)}
                            className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                            title="Accept Order"
                          >
                            <CheckCircle />
                          </button>
                        )}
                        {activeTab === 'pending' && (
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="text-purple-600 hover:text-purple-900 p-2 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Update Status"
                          >
                            <Edit />
                          </button>
                        )}
                        {activeTab === 'pending' && order.status === 'shipped' && (
                          <button
                            onClick={() => handleCompleteOrder(order)}
                            className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mark as Completed"
                          >
                            <Done />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          orderDetails={orderDetails}
          loadingDetails={loadingDetails}
          activeTab={activeTab}
          onClose={() => {
            setShowOrderDetails(false)
            setSelectedOrder(null)
            setOrderDetails(null)
          }}
          onUpdateStatus={handleUpdateStatus}
          onAcceptOrder={handleAcceptOrder}
          onCompleteOrder={handleCompleteOrder}
        />
      )}
    </div>
  )
}

// Order Details Modal Component
const OrderDetailsModal = ({ 
  order, 
  orderDetails, 
  loadingDetails, 
  activeTab,
  onClose, 
  onUpdateStatus,
  onAcceptOrder,
  onCompleteOrder
}) => {
  const [status, setStatus] = useState(order.status)

  useEffect(() => {
    if (orderDetails) {
      setStatus(orderDetails.status)
    }
  }, [orderDetails])

  const handleStatusChange = async (newStatus) => {
    await onUpdateStatus(order.id, newStatus)
    setStatus(newStatus)
  }

  const statusOptions = [
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'processing', label: 'Processing', color: 'bg-purple-100 text-purple-800' },
    { value: 'shipped', label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loadingDetails ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : orderDetails ? (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Order Number</h3>
                  <p className="text-lg font-semibold text-gray-900">{orderDetails.orderNumber}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Order Date</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(orderDetails.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Status</h3>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    orderDetails.paymentStatus === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {orderDetails.paymentStatus}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Method</h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {orderDetails.paymentMethod?.toUpperCase() || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold text-gray-900">{orderDetails.user?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{orderDetails.user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">{orderDetails.user?.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h3>
                <p className="text-gray-700">
                  {orderDetails.shippingAddress?.name && `${orderDetails.shippingAddress.name}\n`}
                  {orderDetails.shippingAddress?.street && `${orderDetails.shippingAddress.street}\n`}
                  {orderDetails.shippingAddress?.city && `${orderDetails.shippingAddress.city}, `}
                  {orderDetails.shippingAddress?.state && `${orderDetails.shippingAddress.state} `}
                  {orderDetails.shippingAddress?.zipCode && `${orderDetails.shippingAddress.zipCode}\n`}
                  {orderDetails.shippingAddress?.country && orderDetails.shippingAddress.country}
                </p>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {orderDetails.items?.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-600">Price: ₹{parseFloat(item.price || 0).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{(parseFloat(item.price || 0) * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Totals */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{parseFloat(orderDetails.subtotal || 0).toLocaleString('en-IN')}</span>
                  </div>
                  {orderDetails.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{parseFloat(orderDetails.discount || 0).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">₹{parseFloat(orderDetails.shipping || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">₹{parseFloat(orderDetails.tax || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-primary-600">
                      ₹{parseFloat(orderDetails.total || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Management */}
              {activeTab === 'new' && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Status</h3>
                  <p className="text-sm text-gray-600 mb-4">This is a new order. Accept it to move to pending orders.</p>
                  <button
                    onClick={() => onAcceptOrder(orderDetails)}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Accept Order
                  </button>
                </div>
              )}

              {activeTab === 'pending' && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Update Order Status</h3>
                  <div className="space-y-3">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className={`w-full px-4 py-3 rounded-lg font-semibold transition-all ${
                          status === option.value
                            ? `${option.color} ring-2 ring-offset-2 ring-primary-500`
                            : 'bg-white border-2 border-gray-300 hover:border-primary-500 text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                    {status === 'shipped' && (
                      <button
                        onClick={() => onCompleteOrder(orderDetails)}
                        className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mt-2"
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'completed' && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Status</h3>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                    Delivered
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Failed to load order details
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminOrders
