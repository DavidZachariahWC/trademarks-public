import { Button } from '@/components/ui/button'
import Link from 'next/link'

const pricingPlans = [
  {
    name: 'Basic',
    price: '$49',
    period: 'per month',
    description: 'Perfect for individual attorneys and small practices',
    features: [
      'Basic trademark search',
      'Up to 50 searches per month',
      'Basic case management',
      'Email support'
    ]
  },
  {
    name: 'Professional',
    price: '$99',
    period: 'per month',
    description: 'Ideal for growing law firms and businesses',
    features: [
      'Advanced AI-powered search',
      'Unlimited searches',
      'Full case management suite',
      'Priority support',
      'Custom reports'
    ]
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    description: 'For large firms and organizations',
    features: [
      'Everything in Professional',
      'Custom integrations',
      'Dedicated account manager',
      'SLA support',
      'Training sessions'
    ]
  }
]

export default function PricingPage() {
  return (
    <div className="bg-white py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Choose the plan that&apos;s right for you</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <div key={plan.name} className="border rounded-lg p-8 hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-600 ml-2">{plan.period}</span>
              </div>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <Link href="/dashboard">
                <Button className="w-full mb-8">Get Started</Button>
              </Link>
              <ul className="space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 