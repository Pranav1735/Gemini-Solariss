import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../store/slices/productSlice'
import api from '../store/api'
import { Search, FilterList, GridView, ViewList } from '@mui/icons-material'
import ProductImage from '../components/ProductImage/ProductImage'

const Products = () => {
  const dispatch = useDispatch()
  const { products, loading, pagination } = useSelector((state) => state.products)
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minWattage: searchParams.get('minWattage') || '',
    maxWattage: searchParams.get('maxWattage') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: searchParams.get('page') || 1,
  })
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.get('/categories')
        setCategories(response.data.categories)
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }
    loadCategories()
  }, [])

  useEffect(() => {
    const params = {}
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value
    })
    setSearchParams(params)
    dispatch(fetchProducts(params))
  }, [filters, dispatch, setSearchParams])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fadeInUp">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Solar Products
          </h1>
          <p className="text-xl text-gray-600">
            Discover our premium collection of solar energy solutions
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 sticky top-24 animate-fadeInUp">
              <h2 className="text-xl font-semibold mb-6 flex items-center text-emerald-600">
                <FilterList className="mr-2" />
                Filters
              </h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="">All Types</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="On-Grid">On-Grid</option>
                  <option value="Off-Grid">Off-Grid</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">Price Range (₹)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="Min"
                    className="w-full px-4 py-2 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Max"
                    className="w-full px-4 py-2 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Wattage Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">Wattage Range (W)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.minWattage}
                    onChange={(e) => handleFilterChange('minWattage', e.target.value)}
                    placeholder="Min"
                    className="w-full px-4 py-2 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="number"
                    value={filters.maxWattage}
                    onChange={(e) => handleFilterChange('maxWattage', e.target.value)}
                    placeholder="Max"
                    className="w-full px-4 py-2 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">Sort By</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="wattage">Wattage: Low to High</option>
                  <option value="-wattage">Wattage: High to Low</option>
                </select>
              </div>

              <button
                onClick={() => setFilters({
                  search: '',
                  category: '',
                  type: '',
                  minPrice: '',
                  maxPrice: '',
                  minWattage: '',
                  maxWattage: '',
                  sort: '-createdAt',
                  page: 1,
                })}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6 animate-fadeInUp">
              <p className="text-lg text-gray-700 font-medium">
                {pagination?.total || 0} products found
              </p>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl p-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-emerald-500'
                  }`}
                >
                  <GridView />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-emerald-500'
                  }`}
                >
                  <ViewList />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg animate-fadeInUp">
                <p className="text-xl text-gray-600 mb-4">No products found</p>
                <p className="text-gray-500">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-6'
                }>
                  {products.map((product, index) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-500 animate-fadeInUp ${
                        viewMode === 'list' ? 'flex gap-6' : ''
                      }`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className={`${viewMode === 'grid' ? 'aspect-square' : 'w-48 flex-shrink-0'} bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden relative`}>
                        <ProductImage
                          src={product.images && product.images[0] ? product.images[0] : null}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className={`${viewMode === 'list' ? 'flex-1' : ''} p-6`}>
                        <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-emerald-600 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.shortDescription || product.description.substring(0, 100)}...
                        </p>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-2xl font-bold text-emerald-600">
                              ₹{product.price.toLocaleString()}
                            </span>
                            {product.compareAtPrice && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ₹{product.compareAtPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        {viewMode === 'list' && (
                          <div className="mt-3 text-sm text-gray-600">
                            <p>Wattage: {product.wattage}W | Efficiency: {product.efficiency}%</p>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex justify-center items-center space-x-4 mt-12 animate-fadeInUp">
                    <button
                      onClick={() => handleFilterChange('page', Number(filters.page) - 1)}
                      disabled={Number(filters.page) === 1}
                      className="px-6 py-3 bg-white border-2 border-emerald-500 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      Previous
                    </button>
                    <span className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg">
                      Page {filters.page} of {pagination.pages}
                    </span>
                    <button
                      onClick={() => handleFilterChange('page', Number(filters.page) + 1)}
                      disabled={Number(filters.page) >= pagination.pages}
                      className="px-6 py-3 bg-white border-2 border-emerald-500 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products
