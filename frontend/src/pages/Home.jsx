import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../store/slices/productSlice'
import { 
  ArrowForward, 
  TrendingUp, 
  Security, 
  Headset, 
  LocalShipping,
  Nature,
  SolarPower,
  Verified,
  Star,
  CheckCircle,
  Phone,
  Email,
  LocationOn
} from '@mui/icons-material'
import ProductImage from '../components/ProductImage/ProductImage'

const Home = () => {
  const dispatch = useDispatch()
  const { products } = useSelector((state) => state.products)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8, featured: 'true' }))
    setIsVisible(true)
  }, [dispatch])

  const stats = [
    { number: '10K+', label: 'Happy Customers', icon: <Verified className="text-4xl" /> },
    { number: '50K+', label: 'Solar Panels Installed', icon: <SolarPower className="text-4xl" /> },
    { number: '25+', label: 'Years Warranty', icon: <Security className="text-4xl" /> },
    { number: '99%', label: 'Customer Satisfaction', icon: <Star className="text-4xl" /> },
  ]

  const features = [
    {
      icon: <TrendingUp className="text-5xl" />,
      title: 'High Efficiency',
      description: 'Up to 22.3% efficiency for maximum energy production and optimal performance.',
      color: 'from-emerald-400 to-teal-500'
    },
    {
      icon: <Security className="text-5xl" />,
      title: '25 Year Warranty',
      description: 'Industry-leading warranty coverage ensuring long-term reliability and peace of mind.',
      color: 'from-teal-400 to-cyan-500'
    },
    {
      icon: <Headset className="text-5xl" />,
      title: 'Expert Support',
      description: 'Dedicated customer support team available 24/7 to assist with all your solar needs.',
      color: 'from-emerald-400 to-teal-500'
    },
    {
      icon: <LocalShipping className="text-5xl" />,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping across India with secure packaging and tracking.',
      color: 'from-cyan-400 to-teal-500'
    },
    {
      icon: <Nature className="text-5xl" />,
      title: 'Eco-Friendly',
      description: '100% renewable energy solutions contributing to a sustainable future for all.',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: <CheckCircle className="text-5xl" />,
      title: 'Certified Quality',
      description: 'All products meet international standards with ISO and BIS certifications.',
      color: 'from-teal-400 to-emerald-500'
    },
  ]

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Homeowner, Mumbai',
      content: 'Excellent quality solar panels! My electricity bill has reduced by 80%. Highly recommended!',
      rating: 5,
      image: '👤'
    },
    {
      name: 'Priya Sharma',
      role: 'Business Owner, Delhi',
      content: 'Professional installation and great customer service. The team was very knowledgeable and helpful.',
      rating: 5,
      image: '👤'
    },
    {
      name: 'Amit Patel',
      role: 'Factory Owner, Gujarat',
      content: 'Best investment we made! The solar system is working perfectly and saving us thousands monthly.',
      rating: 5,
      image: '👤'
    },
  ]

  const processSteps = [
    {
      step: '01',
      title: 'Consultation',
      description: 'Free consultation to understand your energy needs and requirements.'
    },
    {
      step: '02',
      title: 'Design & Quote',
      description: 'Customized solar system design with detailed quotation and timeline.'
    },
    {
      step: '03',
      title: 'Installation',
      description: 'Professional installation by certified technicians with quality assurance.'
    },
    {
      step: '04',
      title: 'Support & Maintenance',
      description: 'Ongoing support, monitoring, and maintenance services for optimal performance.'
    },
  ]

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&h=1080&fit=crop&q=80"
            alt="Solar panels on rooftop"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center' }}
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-teal-900/60 to-cyan-900/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block mb-6 px-4 py-2 bg-emerald-100/90 backdrop-blur-sm text-emerald-700 rounded-full text-sm font-semibold animate-fadeIn border border-emerald-300">
              🌱 Leading Solar Energy Solutions
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-white drop-shadow-2xl animate-fadeInUp">
              Power Your Future with
              <br />
              <span className="text-emerald-300">Clean Solar Energy</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-lg animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Premium solar panels, inverters, and renewable energy solutions for residential and commercial use. 
              Join thousands of satisfied customers powering their future sustainably.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <Link 
                to="/products" 
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Shop Now
                  <ArrowForward className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link 
                to="/about" 
                className="px-8 py-4 bg-white/90 backdrop-blur-sm text-emerald-600 rounded-full font-bold text-lg border-2 border-white hover:bg-white transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-emerald-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-emerald-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center transform hover:scale-110 transition-all duration-300 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4 flex justify-center text-white/90">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-emerald-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#FFF8E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Why Choose GEMINI SOLARISS?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the perfect blend of innovation, quality, and sustainability
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>
                <div className={`relative z-10 inline-flex p-4 bg-gradient-to-br ${feature.color} text-white rounded-2xl mb-6 transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                <div className="mt-6 w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transform group-hover:w-full transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 animate-fadeInUp">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600">Discover our premium solar energy solutions</p>
            </div>
            <Link 
              to="/products" 
              className="mt-4 md:mt-0 flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              View All Products
              <ArrowForward className="ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product, index) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-500 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-square bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
                  <ProductImage
                    src={product.images && product.images[0] ? product.images[0] : null}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    View Details
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-gray-800 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.shortDescription || product.description.substring(0, 80)}...
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
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, transparent process from consultation to installation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold mb-4 mt-4 text-gray-800">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowForward className="text-emerald-500 text-3xl" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#FFF8E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real experiences from satisfied customers across India
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center text-2xl mr-4">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slideInLeft">
              <div className="inline-block mb-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                About Us
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                About GEMINI SOLARISS
              </h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                GEMINI SOLARISS is a leading provider of solar energy solutions in India. We specialize in 
                high-quality solar panels, inverters, batteries, and complete solar systems for residential 
                and commercial applications.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Founded by Niranjan Prabhu Jayaprakash, we are committed to making renewable energy accessible 
                to everyone while maintaining the highest standards of quality and service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/about" className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-center">
                  Learn More About Us
                </Link>
                <Link to="/contact" className="px-8 py-4 bg-white border-2 border-emerald-500 text-emerald-600 rounded-full font-bold hover:bg-emerald-50 transform hover:scale-105 transition-all duration-300 text-center">
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="relative animate-slideInRight">
              <div className="bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-3xl font-bold mb-6 text-gray-800">Why Choose Us?</h3>
                <ul className="space-y-4">
                  {[
                    'Premium quality products with international certifications',
                    'Competitive pricing with flexible payment options',
                    'Expert installation support by certified technicians',
                    'Comprehensive warranty and after-sales service',
                    'Nationwide delivery and installation network',
                    'Eco-friendly solutions for sustainable future'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                      <CheckCircle className="text-emerald-500 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute -z-10 -bottom-6 -right-6 w-full h-full bg-emerald-200 rounded-3xl opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fadeInUp">
            Ready to Go Solar?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Get a free consultation and quote today. Join thousands of satisfied customers 
            saving money while saving the planet.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-white text-emerald-600 rounded-full font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Get Free Quote
            </Link>
            <a 
              href="tel:+919876543210" 
              className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white rounded-full font-bold text-lg hover:bg-white/30 transform hover:scale-105 transition-all duration-300 flex items-center"
            >
              <Phone className="mr-2" />
              Call Now
            </a>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3">
              <Phone className="text-3xl" />
              <div className="text-left">
                <div className="font-semibold">Phone</div>
                <div className="text-emerald-100">+91-9876543210</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Email className="text-3xl" />
              <div className="text-left">
                <div className="font-semibold">Email</div>
                <div className="text-emerald-100">admin@geminisolariss.com</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <LocationOn className="text-3xl" />
              <div className="text-left">
                <div className="font-semibold">Location</div>
                <div className="text-emerald-100 text-sm">Chennai, India</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
