import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getCart, updateCartItem, removeFromCart, applyCoupon } from '../store/slices/cartSlice'
import { toast } from 'react-toastify'
import { Delete, Add, Remove, ShoppingCart, Description, ArrowBack } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import api from '../store/api'
import ProductImage from '../components/ProductImage/ProductImage'

const Cart = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items, subtotal, discount, total, itemCount } = useSelector((state) => state.cart)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [generatingQuotation, setGeneratingQuotation] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    dispatch(getCart())
  }, [dispatch, isAuthenticated, navigate])

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return
    dispatch(updateCartItem({ itemId, quantity: newQuantity }))
      .unwrap()
      .catch((error) => {
        toast.error(error || 'Failed to update cart')
      })
  }

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId))
      .unwrap()
      .then(() => {
        toast.success('Item removed from cart')
      })
      .catch((error) => {
        toast.error(error || 'Failed to remove item')
      })
  }

  const handleGenerateQuotation = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty. Please add products to generate a quotation.')
      return
    }

    try {
      setGeneratingQuotation(true)
      const response = await api.get('/cart/quotation', {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `quotation-${Date.now()}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      toast.success('Quotation generated successfully!')
    } catch (error) {
      console.error('Error generating quotation:', error)
      toast.error(error.response?.data?.message || 'Failed to generate quotation')
    } finally {
      setGeneratingQuotation(false)
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }

    try {
      const response = await api.post('/coupons/validate', {
        code: couponCode,
        amount: subtotal
      })

      if (response.data.success) {
        dispatch(applyCoupon(couponCode))
          .unwrap()
          .then(() => {
            setAppliedCoupon(response.data.coupon)
            toast.success('Coupon applied successfully')
          })
          .catch((error) => {
            toast.error(error || 'Failed to apply coupon')
          })
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon code')
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center py-20">
        <div className="max-w-md mx-auto px-4 text-center animate-fadeInUp">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-12">
            <ShoppingCart className="mx-auto text-emerald-300 mb-6" style={{ fontSize: 80 }} />
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 text-lg">Add some products to get started</p>
            <Link 
              to="/products" 
              className="inline-block px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 animate-fadeInUp">
          <Link 
            to="/products" 
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors mb-4"
          >
            <ArrowBack className="mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Shopping Cart
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex gap-6 transform hover:scale-[1.02] transition-all duration-300 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-32 h-32 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex-shrink-0 overflow-hidden relative">
                  <ProductImage
                    src={item.product?.images?.[0] || null}
                    alt={item.product?.name || 'Product'}
                    className="w-full h-full object-cover"
                    fallbackIcon={false}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{item.product?.name}</h3>
                  <p className="text-emerald-600 font-semibold mb-4">
                    ₹{item.price.toLocaleString()} each
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 bg-emerald-50 rounded-xl p-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-10 h-10 border-2 border-emerald-300 rounded-lg flex items-center justify-center hover:bg-emerald-100 text-emerald-600 transition-all duration-300 transform hover:scale-110"
                      >
                        <Remove style={{ fontSize: 18 }} />
                      </button>
                      <span className="w-12 text-center font-bold text-gray-800">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-10 h-10 border-2 border-emerald-300 rounded-lg flex items-center justify-center hover:bg-emerald-100 text-emerald-600 transition-all duration-300 transform hover:scale-110"
                      >
                        <Add style={{ fontSize: 18 }} />
                      </button>
                    </div>
                    <div className="flex items-center space-x-6">
                      <span className="text-2xl font-bold text-emerald-600">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 transform hover:scale-125 transition-all duration-300"
                      >
                        <Delete />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sticky top-24 animate-fadeInUp">
              <h2 className="text-2xl font-bold mb-6 text-emerald-700">Order Summary</h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    disabled={!!appliedCoupon}
                  />
                  {!appliedCoupon ? (
                    <button 
                      onClick={handleApplyCoupon} 
                      className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      Apply
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setCouponCode('')
                        setAppliedCoupon(null)
                        dispatch(getCart())
                      }}
                      className="px-6 py-2 bg-red-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="text-sm text-emerald-600 mt-2 font-semibold">
                    ✓ Coupon applied: {appliedCoupon.code} - ₹{discount.toLocaleString()} off
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6 pb-6 border-b-2 border-emerald-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{discount.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between text-2xl font-bold mb-6">
                <span className="text-gray-800">Total</span>
                <span className="text-emerald-600">₹{total.toLocaleString()}</span>
              </div>

              <button
                onClick={handleGenerateQuotation}
                disabled={generatingQuotation}
                className="w-full mb-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                {generatingQuotation ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Description className="w-5 h-5" />
                    <span>Get Instant Quotation</span>
                  </>
                )}
              </button>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
