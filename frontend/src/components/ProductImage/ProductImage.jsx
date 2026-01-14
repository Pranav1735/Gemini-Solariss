import { useState } from 'react'
import { SolarPower } from '@mui/icons-material'

const ProductImage = ({ src, alt, className = '', fallbackIcon = true }) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleLoad = () => {
    setImageLoading(false)
  }

  if (imageError || !src) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100 ${className}`}>
        {fallbackIcon ? (
          <div className="text-center">
            <SolarPower className="text-6xl text-emerald-300 mx-auto mb-2" />
            <span className="text-gray-400 text-sm">No Image Available</span>
          </div>
        ) : (
          <span className="text-gray-400">No Image</span>
        )}
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-500"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  )
}

export default ProductImage

