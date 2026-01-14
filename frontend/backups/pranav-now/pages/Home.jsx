import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../store/slices/productSlice'
import { ArrowForward, TrendingUp, Security, Headset } from '@mui/icons-material'

const Home = () => {
  const dispatch = useDispatch()
  const { products } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8, featured: 'true' }))
  }, [dispatch])

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Power Your Future with <span className="text-solar-yellow">Solar Energy</span>
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Premium solar panels, inverters, and renewable energy solutions for residential and commercial use.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/products" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Shop Now
              </Link>
              <Link to="/about" className="btn-outline border-white text-white hover:bg-white/10">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">High Efficiency</h3>
              <p className="text-gray-600">Up to 22.3% efficiency for maximum energy production</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Security className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">25 Year Warranty</h3>
              <p className="text-gray-600">Industry-leading warranty on all solar panels</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headset className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600">Dedicated customer support team</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowForward className="text-primary-600 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping across India</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-primary-600 hover:text-primary-700 font-semibold">
              View All <ArrowForward className="inline ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.shortDescription || product.description.substring(0, 60)}...</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-primary-600">₹{product.price.toLocaleString()}</span>
                    {product.compareAtPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        ₹{product.compareAtPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">About GEMINI SOLARISS</h2>
              <p className="text-gray-600 mb-4">
                GEMINI SOLARISS is a leading provider of solar energy solutions in India. We specialize in 
                high-quality solar panels, inverters, batteries, and complete solar systems for residential 
                and commercial applications.
              </p>
              <p className="text-gray-600 mb-6">
                Founded by Niranjan Prabhu Jayaprakash, we are committed to making renewable energy accessible 
                to everyone while maintaining the highest standards of quality and service.
              </p>
              <Link to="/about" className="btn-primary">
                Learn More About Us
              </Link>
            </div>
            <div className="bg-primary-100 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
              <ul className="text-left space-y-3">
                <li className="flex items-center">
                  <span className="text-primary-600 mr-2">✓</span>
                  Premium quality products
                </li>
                <li className="flex items-center">
                  <span className="text-primary-600 mr-2">✓</span>
                  Competitive pricing
                </li>
                <li className="flex items-center">
                  <span className="text-primary-600 mr-2">✓</span>
                  Expert installation support
                </li>
                <li className="flex items-center">
                  <span className="text-primary-600 mr-2">✓</span>
                  Comprehensive warranty
                </li>
                <li className="flex items-center">
                  <span className="text-primary-600 mr-2">✓</span>
                  Nationwide delivery
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

