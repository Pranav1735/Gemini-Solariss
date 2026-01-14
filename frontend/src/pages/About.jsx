import { CheckCircle, TrendingUp, Security, LocalShipping, Nature, Headset } from '@mui/icons-material'

const About = () => {
  const features = [
    { icon: <TrendingUp className="text-4xl" />, title: 'High Efficiency', desc: 'Up to 22.3% efficiency' },
    { icon: <Security className="text-4xl" />, title: '25+ Years Warranty', desc: 'Industry-leading warranty' },
    { icon: <Headset className="text-4xl" />, title: 'Expert Support', desc: '24/7 customer support' },
    { icon: <LocalShipping className="text-4xl" />, title: 'Fast Delivery', desc: 'Nationwide shipping' },
    { icon: <Nature className="text-4xl" />, title: 'Eco-Friendly', desc: '100% renewable energy' },
    { icon: <CheckCircle className="text-4xl" />, title: 'Certified Quality', desc: 'ISO & BIS certified' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fadeInUp">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About Us</h1>
          <p className="text-xl md:text-2xl text-emerald-50 max-w-3xl mx-auto">
            Leading the way in solar energy solutions across India
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission & Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 animate-slideInLeft">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              GEMINI SOLARISS is dedicated to making renewable energy accessible to everyone. 
              We believe in a sustainable future powered by clean, efficient solar energy solutions.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Our mission is to provide high-quality solar panels, inverters, batteries, and 
              complete solar systems that help individuals and businesses reduce their carbon 
              footprint while saving on energy costs.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 animate-slideInRight">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Our Story
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4 text-lg">
              Founded by Niranjan Prabhu Jayaprakash, GEMINI SOLARISS was established with a 
              vision to revolutionize the solar energy market in India. We combine cutting-edge 
              technology with exceptional customer service to deliver the best solar solutions.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              Based in Chennai, Tamil Nadu, we serve customers across India, providing 
              residential and commercial solar installations that meet the highest standards 
              of quality and efficiency.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-2xl p-12 mb-16 text-white animate-fadeInUp">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose GEMINI SOLARISS?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl font-bold mb-2">25+</div>
              <p className="text-xl text-emerald-50">Years Warranty</p>
            </div>
            <div className="text-center transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl font-bold mb-2">22.3%</div>
              <p className="text-xl text-emerald-50">Max Efficiency</p>
            </div>
            <div className="text-center transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl font-bold mb-2">100%</div>
              <p className="text-xl text-emerald-50">Customer Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Our Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center transform hover:-translate-y-2 transition-all duration-500 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex p-4 bg-gradient-to-br from-emerald-400 to-teal-400 text-white rounded-2xl mb-4 transform hover:rotate-6 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 animate-fadeInUp">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <strong className="text-emerald-600">Company:</strong>
                <p className="text-gray-700">GEMINI SOLARISS</p>
              </div>
              <div>
                <strong className="text-emerald-600">Founder:</strong>
                <p className="text-gray-700">Niranjan Prabhu Jayaprakash</p>
              </div>
              <div>
                <strong className="text-emerald-600">Email:</strong>
                <p className="text-gray-700">admin@geminisolariss.com</p>
              </div>
              <div>
                <strong className="text-emerald-600">Phone:</strong>
                <p className="text-gray-700">+91-9876543210</p>
              </div>
            </div>
            <div>
              <strong className="text-emerald-600">Address:</strong>
              <p className="text-gray-700 leading-relaxed">
                No.63-A, Anna Enclave<br />
                East Coast Road, Injambakkam<br />
                Chennai, Tamil Nadu - 600115<br />
                India
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
