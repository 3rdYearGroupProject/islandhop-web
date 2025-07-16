import React from 'react';

const GuideAnalytics = () => {
  const analyticsData = {
    customerInsights: {
      demographics: [
        { country: 'United States', bookings: 28, percentage: 31 },
        { country: 'United Kingdom', bookings: 18, percentage: 20 },
        { country: 'Australia', bookings: 15, percentage: 17 },
        { country: 'Germany', bookings: 12, percentage: 13 },
        { country: 'Canada', bookings: 10, percentage: 11 },
        { country: 'Others', bookings: 6, percentage: 8 }
      ],
      ageGroups: [
        { age: '18-25', bookings: 15, percentage: 17 },
        { age: '26-35', bookings: 32, percentage: 36 },
        { age: '36-45', bookings: 24, percentage: 27 },
        { age: '46-55', bookings: 12, percentage: 13 },
        { age: '55+', bookings: 6, percentage: 7 }
      ],
      groupSizes: [
        { size: 'Solo (1)', bookings: 8, percentage: 9 },
        { size: 'Couple (2)', bookings: 45, percentage: 51 },
        { size: 'Small Group (3-4)', bookings: 28, percentage: 31 },
        { size: 'Large Group (5+)', bookings: 8, percentage: 9 }
      ]
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Analytics</h1>
            <p className="text-gray-600">Understand your customer demographics and preferences</p>
          </div>
        </div>
      </div>

      {/* Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Demographics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Demographics</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">By Country</h4>
              <div className="space-y-2">
                {analyticsData.customerInsights.demographics.map((demo, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{demo.country}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${demo.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900 w-8">{demo.bookings}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Age Groups */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Age Distribution</h3>
          <div className="space-y-3">
            {analyticsData.customerInsights.ageGroups.map((age, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{age.age}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${age.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900 w-8">{age.bookings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group Sizes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Group Sizes</h3>
          <div className="space-y-3">
            {analyticsData.customerInsights.groupSizes.map((group, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{group.size}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${group.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-900 w-8">{group.bookings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideAnalytics;