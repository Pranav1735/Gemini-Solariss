import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProduct } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import { toast } from 'react-toastify'
import { ShoppingCart, CheckCircle, ArrowBack } from '@mui/icons-material'
import ProductImage from '../components/ProductImage/ProductImage'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { product, loading } = useSelector((state) => state.products)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    dispatch(fetchProduct(id))
  }, [id, dispatch])

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart')
      navigate('/login')
      return
    }

    dispatch(addToCart({ productId: product.id, quantity }))
      .unwrap()
      .then(() => {
        toast.success('Product added to cart')
      })
      .catch((error) => {
        toast.error(error || 'Failed to add to cart')
      })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 animate-fadeInUp">
          <p className="text-xl text-gray-600 mb-4">Product not found</p>
          <Link 
            to="/products" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 animate-fadeInUp">
          <Link 
            to="/products" 
            className="inline-flex items-center text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowBack className="mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="animate-slideInLeft">
            <div className="aspect-square bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl mb-4 overflow-hidden shadow-xl relative">
              <ProductImage
                src={product.images && product.images[selectedImage] ? product.images[selectedImage] : null}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-3">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-110 ${
                      selectedImage === index 
                        ? 'border-emerald-500 ring-4 ring-emerald-200 shadow-lg' 
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <ProductImage
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      fallbackIcon={false}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="animate-slideInRight">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-4xl font-bold text-emerald-600">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.compareAtPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.compareAtPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
              </div>

              {/* Technical Specs */}
              <div className="mb-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 text-emerald-700">Key Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Wattage:</span>
                    <span className="font-semibold text-gray-800">{product.wattage}W</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Efficiency:</span>
                    <span className="font-semibold text-gray-800">{product.efficiency}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold text-gray-800">{product.type}</span>
                  </div>
                  {product.brand && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Brand:</span>
                      <span className="font-semibold text-gray-800">{product.brand}</span>
                    </div>
                  )}
                  {product.warranty && (
                    <div className="flex justify-between col-span-2">
                      <span className="text-gray-600">Warranty:</span>
                      <span className="font-semibold text-gray-800">{product.warranty} {product.warrantyUnit}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Technical Specs */}
              {product.technicalSpecs && typeof product.technicalSpecs === 'object' && Object.keys(product.technicalSpecs).length > 0 && (
                <div className="mb-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-teal-700">Additional Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(product.technicalSpecs).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-semibold text-gray-800">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3 text-gray-700">Quantity</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 border-2 border-emerald-300 rounded-xl flex items-center justify-center hover:bg-emerald-50 text-emerald-600 font-bold text-xl transition-all duration-300 transform hover:scale-110"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="w-20 text-center border-2 border-emerald-300 rounded-xl py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 border-2 border-emerald-300 rounded-xl flex items-center justify-center hover:bg-emerald-50 text-emerald-600 font-bold text-xl transition-all duration-300 transform hover:scale-110"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                  <ShoppingCart className="mr-2" />
                  Add to Cart
                </button>
                <div className="flex items-center justify-center px-6 py-4 bg-emerald-50 text-emerald-600 rounded-xl border-2 border-emerald-200">
                  <CheckCircle className="mr-2" />
                  <span className="font-semibold">Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
