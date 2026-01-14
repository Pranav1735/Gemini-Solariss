import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getCart, updateCartItem, removeFromCart, applyCoupon } from '../store/slices/cartSlice'
import { toast } from 'react-toastify'
import { Delete, Add, Remove, ShoppingCart, Description } from '@mui/icons-material'
import api from '../store/api'

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
        responseType: 'blob' // Important for PDF download
      })

      // Create blob URL and trigger download
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <ShoppingCart className="mx-auto text-gray-400 mb-4" style={{ fontSize: 64 }} />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Shop Now
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card flex gap-6">
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0">
                {item.product?.images?.[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{item.product?.name}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  ₹{item.price.toLocaleString()} each
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                    >
                      <Remove style={{ fontSize: 16 }} />
                    </button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                    >
                      <Add style={{ fontSize: 16 }} />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-700"
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
          <div className="card sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

            {/* Coupon Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Coupon Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="input-field flex-1"
                  disabled={!!appliedCoupon}
                />
                {!appliedCoupon ? (
                  <button onClick={handleApplyCoupon} className="btn-secondary">
                    Apply
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCouponCode('')
                      setAppliedCoupon(null)
                      dispatch(getCart())
                    }}
                    className="btn-secondary"
                  >
                    Remove
                  </button>
                )}
              </div>
              {appliedCoupon && (
                <p className="text-sm text-green-600 mt-2">
                  Coupon applied: {appliedCoupon.code} - ₹{discount.toLocaleString()} off
                </p>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold pt-3 border-t">
                <span>Total</span>
                <span className="text-primary-600">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleGenerateQuotation}
              disabled={generatingQuotation}
              className="w-full mb-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generatingQuotation ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
              className="btn-primary w-full"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

