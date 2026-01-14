import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import api from '../../store/api'
import { toast } from 'react-toastify'
import { Add, Edit, Delete, Visibility, VisibilityOff } from '@mui/icons-material'
import ProductForm from '../../components/admin/ProductForm'

const AdminProducts = () => {
  const { user } = useSelector((state) => state.auth)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    console.log('AdminProducts mounted, user:', user, 'role:', user?.role)
    fetchProducts()
    fetchCategories()
  }, [user])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/products', {
        params: { limit: 100, isActive: undefined } // Get all products including inactive
      })
      setProducts(response.data.products)
      console.log('Products fetched:', response.data.products.length)
    } catch (error) {
      toast.error('Failed to fetch products')
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories')
      setCategories(response.data.categories)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      await api.delete(`/products/${productId}`)
      toast.success('Product deleted successfully')
      fetchProducts()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product')
    }
  }

  const handleToggleActive = async (product) => {
    try {
      await api.put(`/products/${product.id}`, {
        ...product,
        isActive: !product.isActive
      })
      toast.success(`Product ${product.isActive ? 'deactivated' : 'activated'}`)
      fetchProducts()
    } catch (error) {
      toast.error('Failed to update product status')
      console.error(error)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingProduct(null)
    fetchProducts()
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct}
        categories={categories}
        onClose={handleFormClose}
      />
    )
  }

  return (
    <div>
      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
          Debug: User Role = {user?.role || 'Not loaded'} | Authenticated = {user ? 'Yes' : 'No'}
        </div>
      )}

      {/* Header with Add Button - Very Visible */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-1">Manage your solar products inventory</p>
          </div>
          <button 
            onClick={handleAdd} 
            type="button"
            className="w-full sm:w-auto px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            style={{ minWidth: '180px' }}
          >
            <Add style={{ fontSize: 20 }} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products by name, brand, or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field max-w-md"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 text-lg mb-4">No products found</p>
          <button onClick={handleAdd} className="btn-primary">
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className={!product.isActive ? 'bg-gray-50 opacity-75' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-12 w-12 object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-400 text-xs">No Image</span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.brand || 'No brand'}</div>
                        <div className="text-xs text-gray-400">SKU: {product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.category?.name || 'Uncategorized'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ₹{parseFloat(product.price).toLocaleString()}
                    </div>
                    {product.compareAtPrice && (
                      <div className="text-xs text-gray-500 line-through">
                        ₹{parseFloat(product.compareAtPrice).toLocaleString()}
                      </div>
                    )}
                  </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      product.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {product.isFeatured && (
                      <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className="text-gray-600 hover:text-gray-900"
                        title={product.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {product.isActive ? <VisibilityOff /> : <Visibility />}
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Delete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  )
}

export default AdminProducts
