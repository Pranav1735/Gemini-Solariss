import { Link } from 'react-router-dom'

const Logo = ({ className = '', variant = 'light' }) => {
  const isDark = variant === 'dark'
  
  return (
    <Link to="/" className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon - Lion with Sun Rays */}
      <div className="relative w-12 h-12 flex-shrink-0">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#1e40af', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          
          {/* Circle Background */}
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="url(#logoGradient)"
            stroke="url(#logoGradient)"
            strokeWidth="2"
          />
          
          {/* Sun Rays - 5 pointed rays from top-left */}
          <g>
            <path
              d="M 50 5 L 48 20 L 50 15 L 52 20 Z"
              fill="#10b981"
              opacity="0.95"
            />
            <path
              d="M 60 8 L 58 22 L 60 17 L 62 22 Z"
              fill="#10b981"
              opacity="0.95"
            />
            <path
              d="M 70 12 L 68 26 L 70 21 L 72 26 Z"
              fill="#10b981"
              opacity="0.95"
            />
            <path
              d="M 78 18 L 76 32 L 78 27 L 80 32 Z"
              fill="#10b981"
              opacity="0.95"
            />
            <path
              d="M 85 25 L 83 39 L 85 34 L 87 39 Z"
              fill="#10b981"
              opacity="0.95"
            />
          </g>
          
          {/* Lion Head - Profile facing right */}
          <g>
            {/* Lion Head Shape */}
            <path
              d="M 35 40 Q 30 35, 35 30 Q 40 25, 50 28 Q 60 25, 65 30 Q 70 35, 65 40 Q 63 45, 60 48 Q 55 50, 50 48 Q 45 50, 40 48 Q 37 45, 35 40 Z"
              fill="#1e40af"
              opacity="0.85"
            />
            {/* Lion Mane - Flowing lines */}
            <path
              d="M 38 45 Q 35 50, 38 55 Q 42 58, 45 56 Q 48 58, 52 56 Q 55 58, 58 55 Q 61 50, 58 45"
              fill="#1e40af"
              opacity="0.7"
            />
            {/* Lion Eye */}
            <circle cx="52" cy="38" r="2" fill="#ffffff" opacity="0.9" />
            {/* Lion Nose */}
            <path
              d="M 58 42 L 60 44 L 58 46 Z"
              fill="#1e40af"
              opacity="0.8"
            />
          </g>
        </svg>
      </div>

      {/* Logo Text */}
      <div className="flex flex-col">
        <div className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : ''}`}>
          {isDark ? (
            <span className="text-white">
              GEMINI <span className="text-green-400">SOLARISS</span>
            </span>
          ) : (
            <span
              className="bg-gradient-to-r from-blue-700 via-blue-500 to-green-500 bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(to right, #1e40af, #3b82f6, #10b981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              GEMINI <span className="text-green-500">SOLARISS</span>
            </span>
          )}
        </div>
        <div className="text-xs font-semibold uppercase tracking-wider">
          <span
            className={`inline-block px-2 py-0.5 rounded ${isDark ? 'text-white bg-gradient-to-r from-blue-600 to-green-500' : 'text-white'}`}
            style={!isDark ? {
              backgroundImage: 'linear-gradient(to right, #1e40af, #3b82f6, #10b981)',
            } : {}}
          >
            SOLAR POWER UP
          </span>
        </div>
      </div>
    </Link>
  )
}

export default Logo
