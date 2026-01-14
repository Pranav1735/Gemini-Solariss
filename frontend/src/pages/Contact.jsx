import { useState } from 'react'
import { toast } from 'react-toastify'
import { Email, Phone, LocationOn, Send } from '@mui/icons-material'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Thank you for your message! We will get back to you soon.')
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get in touch with us for any inquiries. We're here to help you with all your solar energy needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 animate-slideInLeft">
            <h2 className="text-3xl font-bold mb-6 text-emerald-700">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="+91-9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button 
                type="submit" 
                className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                <Send className="mr-2" />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 animate-slideInRight">
              <h2 className="text-3xl font-bold mb-6 text-emerald-700">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl hover:shadow-lg transition-all duration-300">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl">
                    <LocationOn className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-gray-800">Address</h3>
                    <p className="text-gray-600 leading-relaxed">
                      No.63-A, Anna Enclave<br />
                      East Coast Road, Injambakkam<br />
                      Chennai, Tamil Nadu - 600115<br />
                      India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl hover:shadow-lg transition-all duration-300">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl">
                    <Phone className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-gray-800">Phone</h3>
                    <a href="tel:+919876543210" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                      +91-9876543210
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl hover:shadow-lg transition-all duration-300">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl">
                    <Email className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-gray-800">Email</h3>
                    <a href="mailto:admin@geminisolariss.com" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                      admin@geminisolariss.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-xl p-8 text-white animate-fadeInUp">
              <h2 className="text-2xl font-bold mb-6">Business Hours</h2>
              <div className="space-y-3 text-lg">
                <div className="flex justify-between">
                  <span className="font-semibold">Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Saturday:</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Sunday:</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
