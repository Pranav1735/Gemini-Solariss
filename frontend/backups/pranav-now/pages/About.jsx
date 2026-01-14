const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About GEMINI SOLARISS</h1>
        <p className="text-xl text-gray-600">
          Leading the way in solar energy solutions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            GEMINI SOLARISS is dedicated to making renewable energy accessible to everyone. 
            We believe in a sustainable future powered by clean, efficient solar energy solutions.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our mission is to provide high-quality solar panels, inverters, batteries, and 
            complete solar systems that help individuals and businesses reduce their carbon 
            footprint while saving on energy costs.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Founded by Niranjan Prabhu Jayaprakash, GEMINI SOLARISS was established with a 
            vision to revolutionize the solar energy market in India. We combine cutting-edge 
            technology with exceptional customer service to deliver the best solar solutions.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Based in Chennai, Tamil Nadu, we serve customers across India, providing 
            residential and commercial solar installations that meet the highest standards 
            of quality and efficiency.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Why Choose GEMINI SOLARISS?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">25+</div>
            <p className="text-gray-700">Years Warranty</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">22.3%</div>
            <p className="text-gray-700">Max Efficiency</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary-600 mb-2">100%</div>
            <p className="text-gray-700">Customer Satisfaction</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700 mb-2"><strong>Company:</strong> GEMINI SOLARISS</p>
          <p className="text-gray-700 mb-2"><strong>Founder:</strong> Niranjan Prabhu Jayaprakash</p>
          <p className="text-gray-700 mb-2"><strong>Address:</strong> No.63-A, Anna Enclave, East Coast Road, Injambakkam</p>
          <p className="text-gray-700 mb-2"><strong>City:</strong> Chennai, Tamil Nadu - 600115</p>
          <p className="text-gray-700 mb-2"><strong>Country:</strong> India</p>
          <p className="text-gray-700 mb-2"><strong>Email:</strong> admin@geminisolariss.com</p>
          <p className="text-gray-700"><strong>Phone:</strong> +91-9876543210</p>
        </div>
      </div>
    </div>
  )
}

export default About

