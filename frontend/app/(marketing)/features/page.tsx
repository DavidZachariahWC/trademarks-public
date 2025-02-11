export default function FeaturesPage() {
  return (
    <div className="bg-white py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Powerful Features for Trademark Professionals</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to streamline your trademark search and management workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* AI-Powered Search */}
          <div className="space-y-4">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">AI-Powered Search</h3>
            <p className="text-gray-600">
              Our advanced AI algorithms provide intelligent search suggestions and analyze trademark similarities with unprecedented accuracy.
            </p>
          </div>

          {/* Case Management */}
          <div className="space-y-4">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">Case Management</h3>
            <p className="text-gray-600">
              Keep track of all your trademark applications, deadlines, and communications in one centralized platform.
            </p>
          </div>

          {/* Attorney Tools */}
          <div className="space-y-4">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">Attorney Tools</h3>
            <p className="text-gray-600">
              Specialized features designed for legal professionals, including document generation and client management.
            </p>
          </div>

          {/* Analytics */}
          <div className="space-y-4">
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold">Analytics & Reporting</h3>
            <p className="text-gray-600">
              Gain valuable insights into your trademark portfolio with comprehensive analytics and customizable reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 