import { useParams, useNavigate, Link } from 'react-router-dom'
import { CalendarToday, ArrowBack } from '@mui/icons-material'
import { useState, useEffect } from 'react'

const NewsDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In production, fetch from API
    const fetchArticle = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const newsData = [
        {
          id: 1,
          title: 'India Achieves 100 GW Solar Energy Milestone',
          excerpt: 'India has successfully crossed the 100 GW mark in solar energy capacity, marking a significant milestone in the country\'s renewable energy journey.',
          content: 'India has achieved a major milestone by crossing 100 GW of solar energy capacity. This achievement positions India as one of the leading countries in solar energy adoption globally. The government\'s ambitious renewable energy targets and favorable policies have played a crucial role in this achievement.\n\nThis milestone comes at a time when the world is increasingly focusing on renewable energy sources to combat climate change. India\'s commitment to renewable energy has been evident through various initiatives and policy frameworks that encourage solar adoption.\n\nThe growth in solar capacity has been driven by both utility-scale projects and rooftop installations. Residential and commercial consumers are increasingly adopting solar energy, recognizing its long-term economic and environmental benefits.',
          image: 'https://images.unsplash.com/photo-1509391366360-2e959784a272?w=800',
          date: '2026-01-10',
          category: 'Industry News',
          author: 'GEMINI SOLARISS Team'
        },
        {
          id: 2,
          title: 'New High-Efficiency Solar Panels Launched in India',
          excerpt: 'Leading manufacturers have introduced next-generation solar panels with efficiency ratings exceeding 22%, promising better energy output for residential and commercial installations.',
          content: 'The solar industry has witnessed a breakthrough with the launch of high-efficiency solar panels featuring advanced PERC technology. These panels offer efficiency ratings of over 22%, significantly higher than traditional panels. This advancement means homeowners and businesses can generate more electricity from the same roof space.\n\nThe new panels incorporate cutting-edge technology that maximizes energy conversion while maintaining durability and reliability. This is particularly important for Indian conditions, where panels need to withstand high temperatures and varying weather conditions.\n\nManufacturers are also focusing on making these high-efficiency panels more affordable, ensuring that the benefits of advanced technology reach a wider audience.',
          image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800',
          date: '2026-01-08',
          category: 'Technology',
          author: 'GEMINI SOLARISS Team'
        },
        {
          id: 3,
          title: 'Government Announces New Solar Subsidy Scheme for 2026',
          excerpt: 'The Ministry of New and Renewable Energy has unveiled a new subsidy scheme offering up to 40% subsidy on residential solar installations.',
          content: 'In a move to accelerate solar adoption, the government has announced an enhanced subsidy scheme for 2026. Residential consumers can now avail up to 40% subsidy on solar panel installations, with additional benefits for low-income households. This scheme is expected to make solar energy more accessible to millions of Indian households.\n\nThe new scheme builds upon previous initiatives and addresses some of the key barriers to solar adoption, including upfront costs. By providing substantial subsidies, the government aims to make solar energy an attractive option for a broader segment of the population.\n\nIndustry experts have welcomed this move, predicting a significant increase in residential solar installations in the coming year.',
          image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800',
          date: '2026-01-05',
          category: 'Policy',
          author: 'GEMINI SOLARISS Team'
        },
        {
          id: 4,
          title: 'Solar Battery Storage Costs Drop by 30% in India',
          excerpt: 'The cost of solar battery storage systems has decreased significantly, making solar-plus-storage solutions more affordable for Indian consumers.',
          content: 'Recent market analysis shows that solar battery storage costs have dropped by 30% in India over the past year. This reduction is attributed to increased manufacturing capacity and improved technology. As a result, more consumers are opting for solar-plus-storage solutions to ensure uninterrupted power supply.\n\nThe declining costs make it more feasible for consumers to store excess solar energy generated during the day for use during evenings and nights. This is particularly valuable in areas with intermittent grid supply.\n\nExperts predict that as technology continues to improve and manufacturing scales up, storage costs will continue to decrease, making solar-plus-storage the preferred choice for many consumers.',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
          date: '2026-01-03',
          category: 'Technology',
          author: 'GEMINI SOLARISS Team'
        },
        {
          id: 5,
          title: 'Chennai Leads in Solar Rooftop Installations',
          excerpt: 'Chennai has emerged as the top city in Tamil Nadu for solar rooftop installations, with over 50,000 homes now powered by solar energy.',
          content: 'Chennai continues to lead the way in solar energy adoption in Tamil Nadu. The city has seen remarkable growth in rooftop solar installations, with over 50,000 homes now generating their own clean energy. This trend is expected to continue as more residents recognize the long-term benefits of solar power.\n\nThe city\'s favorable climate, combined with government incentives and increasing awareness about renewable energy, has contributed to this growth. Many residents are seeing significant savings on their electricity bills while contributing to environmental conservation.\n\nLocal solar companies have also played a crucial role by providing quality installations and excellent customer service, making the transition to solar energy smooth for homeowners.',
          image: 'https://images.unsplash.com/photo-1509391366360-2e959784a272?w=800',
          date: '2025-12-28',
          category: 'Regional News',
          author: 'GEMINI SOLARISS Team'
        },
        {
          id: 6,
          title: 'Solar Energy Reduces Carbon Footprint by 2.5 Million Tons',
          excerpt: 'India\'s solar energy sector has helped reduce carbon emissions by 2.5 million tons annually, contributing significantly to climate change mitigation.',
          content: 'A recent study reveals that India\'s solar energy sector has made a substantial contribution to reducing carbon emissions. With 2.5 million tons of CO2 emissions avoided annually, solar energy is playing a crucial role in India\'s commitment to climate change mitigation and sustainable development.\n\nThis reduction in carbon footprint is equivalent to taking hundreds of thousands of cars off the road or planting millions of trees. The environmental benefits of solar energy extend beyond just reducing emissions - they also include reduced water usage and minimal environmental impact compared to fossil fuel-based power generation.\n\nAs India continues to expand its solar capacity, these environmental benefits will only increase, making a significant contribution to global climate change efforts.',
          image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
          date: '2025-12-25',
          category: 'Environment',
          author: 'GEMINI SOLARISS Team'
        }
      ]

      const foundArticle = newsData.find(a => a.id === parseInt(id))
      setArticle(foundArticle)
      setLoading(false)
    }

    fetchArticle()
  }, [id])

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <Link to="/news" className="text-primary-600 hover:text-primary-700">
            Back to News
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate('/news')}
        className="flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowBack className="mr-2" />
        Back to News
      </button>

      {/* Article Header */}
      <div className="mb-8">
        <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full inline-block mb-4">
          {article.category}
        </span>
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{article.title}</h1>
        <div className="flex items-center text-gray-600 space-x-4">
          <div className="flex items-center">
            <CalendarToday className="w-4 h-4 mr-2" />
            {formatDate(article.date)}
          </div>
          <span>•</span>
          <span>By {article.author}</span>
        </div>
      </div>

      {/* Featured Image */}
      <div className="mb-8 rounded-lg overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-96 object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1509391366360-2e959784a272?w=800'
          }}
        />
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-6 font-medium">{article.excerpt}</p>
        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
          {article.content}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 bg-primary-50 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold mb-2">Interested in Solar Solutions?</h3>
        <p className="text-gray-600 mb-4">
          Explore our range of high-quality solar panels and renewable energy solutions
        </p>
        <Link to="/products" className="btn-primary inline-block">
          View Products
        </Link>
      </div>
    </div>
  )
}

export default NewsDetail

