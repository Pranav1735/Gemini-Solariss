import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../store/api'
import { toast } from 'react-toastify'
import { ArrowBack, Save } from '@mui/icons-material'

const ProductForm = ({ product, categories, onClose }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    categoryId: '',
    brand: '',
    price: '',
    compareAtPrice: '',
    images: [],
    wattage: '',
    efficiency: '',
    type: 'Residential',
    dimensions: {
      length: '',
      width: '',
      height: '',
      unit: 'mm'
    },
    weight: '',
    warranty: '',
    warrantyUnit: 'years',
    technicalSpecs: {},
    isActive: true,
    isFeatured: false
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        categoryId: product.categoryId || product.category?.id || '',
        brand: product.brand || '',
        price: product.price || '',
        compareAtPrice: product.compareAtPrice || '',
        images: product.images || [],
        wattage: product.wattage || '',
        efficiency: product.efficiency || '',
        type: product.type || 'Residential',
        dimensions: product.dimensions || { length: '', width: '', height: '', unit: 'mm' },
        weight: product.weight || '',
        warranty: product.warranty || '',
        warrantyUnit: product.warrantyUnit || 'years',
        technicalSpecs: product.technicalSpecs || {},
        isActive: product.isActive !== undefined ? product.isActive : true,
        isFeatured: product.isFeatured || false
      })
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('dimensions.')) {
      const dimField = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimField]: value
        }
      }))
    } else if (name.startsWith('technicalSpecs.')) {
      const specKey = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        technicalSpecs: {
          ...prev.technicalSpecs,
          [specKey]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleImageChange = (e) => {
    const images = e.target.value.split(',').map(img => img.trim()).filter(img => img)
    setFormData(prev => ({ ...prev, images }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Convert string numbers to actual numbers
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        wattage: parseInt(formData.wattage),
        efficiency: formData.efficiency ? parseFloat(formData.efficiency) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        warranty: formData.warranty ? parseInt(formData.warranty) : null,
        dimensions: {
          length: formData.dimensions.length ? parseFloat(formData.dimensions.length) : null,
          width: formData.dimensions.width ? parseFloat(formData.dimensions.width) : null,
          height: formData.dimensions.height ? parseFloat(formData.dimensions.height) : null,
          unit: formData.dimensions.unit
        }
      }

      if (product) {
        await api.put(`/products/${product.id}`, submitData)
        toast.success('Product updated successfully')
      } else {
        await api.post('/products', submitData)
        toast.success('Product created successfully')
      }

      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={onClose}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowBack />
        </button>
        <h1 className="text-3xl font-bold">
          {product ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="On-Grid">On-Grid</option>
                <option value="Off-Grid">Off-Grid</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Short Description</label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className="input-field"
                placeholder="Brief description for product cards"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="input-field"
                placeholder="Full product description"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Pricing & Inventory</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Compare At Price (₹)</label>
              <input
                type="number"
                name="compareAtPrice"
                value={formData.compareAtPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="input-field"
              />
            </div>

          </div>
        </div>

        {/* Solar Specifications */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Solar Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Wattage (W) *</label>
              <input
                type="number"
                name="wattage"
                value={formData.wattage}
                onChange={handleChange}
                required
                min="0"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Efficiency (%)</label>
              <input
                type="number"
                name="efficiency"
                value={formData.efficiency}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min="0"
                step="0.1"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Dimensions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Length</label>
              <input
                type="number"
                name="dimensions.length"
                value={formData.dimensions.length}
                onChange={handleChange}
                min="0"
                step="0.1"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Width</label>
              <input
                type="number"
                name="dimensions.width"
                value={formData.dimensions.width}
                onChange={handleChange}
                min="0"
                step="0.1"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Height</label>
              <input
                type="number"
                name="dimensions.height"
                value={formData.dimensions.height}
                onChange={handleChange}
                min="0"
                step="0.1"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Unit</label>
              <select
                name="dimensions.unit"
                value={formData.dimensions.unit}
                onChange={handleChange}
                className="input-field"
              >
                <option value="mm">mm</option>
                <option value="cm">cm</option>
                <option value="m">m</option>
              </select>
            </div>
          </div>
        </div>

        {/* Warranty */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Warranty</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Warranty Period</label>
              <input
                type="number"
                name="warranty"
                value={formData.warranty}
                onChange={handleChange}
                min="0"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Warranty Unit</label>
              <select
                name="warrantyUnit"
                value={formData.warrantyUnit}
                onChange={handleChange}
                className="input-field"
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Product Images</h2>
          <div>
            <label className="block text-sm font-medium mb-2">Image URLs (comma-separated)</label>
            <input
              type="text"
              value={formData.images.join(', ')}
              onChange={handleImageChange}
              className="input-field"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter image URLs separated by commas
            </p>
          </div>
        </div>

        {/* Settings */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Active (visible to customers)</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Featured Product</span>
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center space-x-2"
            disabled={loading}
          >
            <Save />
            <span>{loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductForm

