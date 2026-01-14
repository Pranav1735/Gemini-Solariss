import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CalendarToday, ArrowForward } from '@mui/icons-material'

const News = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulated news data - In production, this would come from an API
    const fetchNews = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newsData = [
        {
          id: 1,
          title: 'India Achieves 100 GW Solar Energy Milestone',
          excerpt: 'India has successfully crossed the 100 GW mark in solar energy capacity, marking a significant milestone in the country\'s renewable energy journey.',
          content: 'India has achieved a major milestone by crossing 100 GW of solar energy capacity. This achievement positions India as one of the leading countries in solar energy adoption globally. The government\'s ambitious renewable energy targets and favorable policies have played a crucial role in this achievement.',
          image: 'https://images.unsplash.com/photo-1509391366360-2e959784a272?w=800',
          date: '2026-01-10',
          category: 'Industry News',
          author: 'GEMINI SOLARISS Team'
        },
        {
          id: 2,
          title: 'New High-Efficiency Solar Panels Launched in India',
          excerpt: 'Leading manufacturers have introduced next-generation solar panels with efficiency ratings exceeding 22%, promising better energy output for residential and commercial installations.',
          content: 'The solar industry has witnessed a breakthrough with the launch of high-efficiency solar panels featuring advanced PERC technology. These panels offer efficiency ratings of over 22%, significantly higher than traditional panels. This advancement means homeowners and businesses can generate more electricity from the same roof space.',
          image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800',
          date: '2026-01-08',
          category: 'Technology',
          author: 'GEMINI SOLARISS Team'
        },
        {
          id: 3,
          title: 'Government Announces New Solar Subsidy Scheme for 2026',
          excerpt: 'The Ministry of New and Renewable Energy has unveiled a new subsidy scheme offering up to 40% subsidy on residential solar installations.',
          content: 'In a move to accelerate solar adoption, the government has announced an enhanced subsidy scheme for 2026. Residential consumers can now avail up to 40% subsidy on solar panel installations, with additional benefits for low-income households. This scheme is expected to make solar energy more accessible to millions of Indian households.',
          image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800',
          date: '2026-01-05',
          category: 'Policy',
          author: 'GEMINI SOLARISS Team'
        },
        {
          id: 4,
          title: 'Solar Battery Storage Costs Drop by 30% in India',
          excerpt: 'The cost of solar battery storage systems has decreased significantly, making solar-plus-storage solutions more affordable for Indian consumers.',
          content: 'Recent market analysis shows that solar battery storage costs have dropped by 30% in India over the past year. This reduction is attributed to increased manufacturing capacity and improved technology. As a result, more consumers are opting for solar-plus-storage solutions to ensure uninterrupted power supply.',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
          date: '2026-01-03',
          category: 'Technology',
          author: 'GEMINI SOLARISS Team'
        },
        {
          id: 5,
          title: 'Chennai Leads in Solar Rooftop Installations',
          excerpt: 'Chennai has emerged as the top city in Tamil Nadu for solar rooftop installations, with over 50,000 homes now powered by solar energy.',
          content: 'Chennai continues to lead the way in solar energy adoption in Tamil Nadu. The city has seen remarkable growth in rooftop solar installations, with over 50,000 homes now generating their own clean energy. This trend is expected to continue as more residents recognize the long-term benefits of solar power.',
          image: 'https://images.unsplash.com/photo-1509391366360-2e959784a272?w=800',
          date: '2025-12-28',
          category: 'Regional News',
          author: 'GEMINI SOLARISS Team'
        },
        {
          id: 6,
          title: 'Solar Energy Reduces Carbon Footprint by 2.5 Million Tons',
          excerpt: 'India\'s solar energy sector has helped reduce carbon emissions by 2.5 million tons annually, contributing significantly to climate change mitigation.',
          content: 'A recent study reveals that India\'s solar energy sector has made a substantial contribution to reducing carbon emissions. With 2.5 million tons of CO2 emissions avoided annually, solar energy is playing a crucial role in India\'s commitment to climate change mitigation and sustainable development.',
          image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
          date: '2025-12-25',
          category: 'Environment',
          author: 'GEMINI SOLARISS Team'
        }
      ]
      
      setNews(newsData)
      setLoading(false)
    }

    fetchNews()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12 animate-fadeInUp">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Solar Energy News
        </h1>
        <p className="text-xl text-gray-600">
          Stay updated with the latest developments in solar energy and renewable technology
        </p>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((article) => (
          <article
            key={article.id}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            {/* News Image */}
            <div className="aspect-video bg-gray-200 overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1509391366360-2e959784a272?w=800'
                }}
              />
            </div>

            {/* News Content */}
            <div className="p-6">
              {/* Category & Date */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                  {article.category}
                </span>
                <div className="flex items-center text-gray-500 text-sm">
                  <CalendarToday className="w-4 h-4 mr-1" />
                  {formatDate(article.date)}
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2">
                {article.title}
              </h2>

              {/* Excerpt */}
              <p className="text-gray-600 mb-4 line-clamp-3">
                {article.excerpt}
              </p>

              {/* Read More */}
              <Link
                to={`/news/${article.id}`}
                className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                Read More
                <ArrowForward className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Newsletter Signup */}
      <div className="mt-16 bg-gradient-to-r from-primary-600 to-green-500 rounded-lg p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
        <p className="mb-6 text-primary-50">
          Subscribe to our newsletter for the latest solar energy news and updates
        </p>
        <div className="max-w-md mx-auto flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
    </div>
  )
}

export default News

