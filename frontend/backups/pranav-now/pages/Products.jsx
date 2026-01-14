import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../store/slices/productSlice'
import api from '../store/api'
import { Search, FilterList, GridView, ViewList } from '@mui/icons-material'

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Solar Products</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64">
          <div className="card sticky top-24">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FilterList className="mr-2" />
              Filters
            </h2>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search products..."
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input-field"
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
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="input-field"
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
              <label className="block text-sm font-medium mb-2">Price Range (₹)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  placeholder="Min"
                  className="input-field"
                />
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  placeholder="Max"
                  className="input-field"
                />
              </div>
            </div>

            {/* Wattage Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Wattage Range (W)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters.minWattage}
                  onChange={(e) => handleFilterChange('minWattage', e.target.value)}
                  placeholder="Min"
                  className="input-field"
                />
                <input
                  type="number"
                  value={filters.maxWattage}
                  onChange={(e) => handleFilterChange('maxWattage', e.target.value)}
                  placeholder="Max"
                  className="input-field"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="input-field"
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
              className="btn-secondary w-full"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {pagination?.total || 0} products found
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'text-primary-600' : 'text-gray-400'}`}
              >
                <GridView />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'text-primary-600' : 'text-gray-400'}`}
              >
                <ViewList />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found</p>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-6'
              }>
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className={`card hover:shadow-lg transition-shadow ${viewMode === 'list' ? 'flex gap-6' : ''}`}
                  >
                    <div className={`${viewMode === 'grid' ? 'aspect-square' : 'w-48'} bg-gray-100 rounded-lg flex items-center justify-center`}>
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
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.shortDescription || product.description.substring(0, 100)}...
                      </p>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-2xl font-bold text-primary-600">
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
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    onClick={() => handleFilterChange('page', Number(filters.page) - 1)}
                    disabled={Number(filters.page) === 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4">
                    Page {filters.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => handleFilterChange('page', Number(filters.page) + 1)}
                    disabled={Number(filters.page) >= pagination.pages}
                    className="btn-secondary disabled:opacity-50"
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
  )
}

export default Products

