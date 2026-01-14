import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProduct } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import { toast } from 'react-toastify'
import { ShoppingCart, CheckCircle } from '@mui/icons-material'

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-gray-600">Product not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
            {product.images && product.images[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-3xl font-bold text-primary-600">
              ₹{product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && (
              <span className="text-xl text-gray-500 line-through">
                ₹{product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Technical Specs */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Key Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Wattage:</span>
                <span className="ml-2 font-semibold">{product.wattage}W</span>
              </div>
              <div>
                <span className="text-gray-600">Efficiency:</span>
                <span className="ml-2 font-semibold">{product.efficiency}%</span>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 font-semibold">{product.type}</span>
              </div>
              {product.brand && (
                <div>
                  <span className="text-gray-600">Brand:</span>
                  <span className="ml-2 font-semibold">{product.brand}</span>
                </div>
              )}
              {product.warranty && (
                <div>
                  <span className="text-gray-600">Warranty:</span>
                  <span className="ml-2 font-semibold">{product.warranty} {product.warrantyUnit}</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Technical Specs */}
          {product.technicalSpecs && typeof product.technicalSpecs === 'object' && Object.keys(product.technicalSpecs).length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Additional Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(product.technicalSpecs).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-gray-600">{key}:</span>
                    <span className="ml-2 font-semibold">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="w-20 text-center border border-gray-300 rounded-lg py-2"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="btn-primary flex-1 flex items-center justify-center"
            >
              <ShoppingCart className="mr-2" />
              Add to Cart
            </button>
            <div className="flex items-center text-green-600">
              <CheckCircle className="mr-1" />
              <span className="text-sm">Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

