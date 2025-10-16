# Guide Backend Endpoints Documentation

This document outlines all the backend endpoints required for the guide pages, following the same pattern as the driver endpoints.

## Base Configuration
- Base URL: `http://localhost:5002/api/guides`
- Authentication: Uses `guideEmail` from user storage
- Response Format: All endpoints should return data in the format `{ success: boolean, data: any }` or direct data

## Guide Analytics Endpoints

### 1. Analytics Overview
**Endpoint:** `GET /api/guides/{guideEmail}/analytics?period={timeRange}`

**Parameters:**
- `guideEmail`: The guide's email address
- `timeRange`: `week` | `month` | `quarter`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalEarnings": 1875.50,
    "totalTours": 12,
    "totalHours": 38.5,
    "totalCustomers": 45,
    "averageRating": 4.8,
    "completionRate": 96.7,
    "earningsChange": 15.8,
    "toursChange": 12.3,
    "hoursChange": -2.1,
    "customersChange": 18.5,
    "monthlyEarnings": 7420.75,
    "monthlyTours": 58,
    "monthlyHours": 152,
    "monthlyCustomers": 189,
    "monthlyEarningsChange": 22.1,
    "monthlyToursChange": 19.2,
    "monthlyHoursChange": 8.3,
    "monthlyCustomersChange": 25.6,
    "quarterlyEarnings": 21850.25,
    "quarterlyTours": 168,
    "quarterlyHours": 445,
    "quarterlyCustomers": 562,
    "quarterlyEarningsChange": 28.7,
    "quarterlyToursChange": 24.1,
    "quarterlyHoursChange": 15.4,
    "quarterlyCustomersChange": 32.3
  }
}
```

### 2. Top Tours
**Endpoint:** `GET /api/guides/{guideEmail}/top-tours?period={timeRange}`

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "tour": "Kandy Cultural Heritage Tour",
      "name": "Kandy Cultural Heritage Tour", // Alternative field name
      "bookings": 32,
      "earnings": 4800.00,
      "avgRating": 4.9,
      "rating": 4.9 // Alternative field name
    }
  ]
}
```

### 3. Busy Hours
**Endpoint:** `GET /api/guides/{guideEmail}/busy-hours?period={timeRange}`

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "hour": "6-7 AM",
      "tours": 3,
      "percentage": 15
    }
  ]
}
```

### 4. Weekly Earnings
**Endpoint:** `GET /api/guides/{guideEmail}/weekly-earnings`

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "day": "Mon",
      "earnings": 285.50
    },
    {
      "day": "Tue", 
      "earnings": 320.25
    }
  ]
}
```

### 5. Customer Insights
**Endpoint:** `GET /api/guides/{guideEmail}/customer-insights?period={timeRange}`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "demographics": [
      {
        "country": "United States",
        "bookings": 28,
        "percentage": 31
      }
    ],
    "ageGroups": [
      {
        "age": "18-25",
        "bookings": 15,
        "percentage": 17
      }
    ],
    "groupSizes": [
      {
        "size": "Solo (1)",
        "bookings": 8,
        "percentage": 9
      }
    ]
  }
}
```

## Guide Earnings Endpoints

### 1. Earnings Data
**Endpoint:** `GET /api/guides/{guideEmail}/earnings?period={timeFilter}`

**Parameters:**
- `timeFilter`: `week` | `month`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalEarnings": 18750.50,
    "todayEarnings": 285.50,
    "weeklyEarnings": 1875.50,
    "monthlyEarnings": 7420.75,
    "weeklyChange": 15.8,
    "monthlyChange": 12.7
  }
}
```

### 2. Recent Transactions
**Endpoint:** `GET /api/guides/{guideEmail}/transactions?limit=10`

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "TR001",
      "tourist": "Emily Johnson",
      "customerName": "Emily Johnson", // Alternative field name
      "route": "Kandy Cultural Heritage Tour",
      "tourName": "Kandy Cultural Heritage Tour", // Alternative field name
      "amount": 1500.00,
      "tip": 15.00,
      "date": "2024-07-03T10:00:00Z",
      "status": "completed",
      "paymentMethod": "card"
    }
  ]
}
```

## Guide History Endpoints

### 1. Tour History
**Endpoint:** `GET /api/guides/{guideEmail}/tours`

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "TG001",
      "customerName": "Emily Johnson",
      "tourist": "Emily Johnson", // Alternative field name
      "tourName": "Kandy Cultural Heritage Tour",
      "tourPackage": "Kandy Cultural Heritage Tour", // Alternative field name
      "startLocation": "Kandy Central",
      "endLocation": "Temple of the Tooth",
      "date": "2024-07-03T00:00:00Z",
      "startTime": "09:00",
      "endTime": "15:00",
      "duration": "6h 00m",
      "groupSize": 4,
      "earnings": 150.00,
      "rating": 5,
      "status": "completed", // completed | cancelled
      "paymentMethod": "card", // card | cash | digital
      "notes": "Family group, children interested in history"
    }
  ]
}
```

## Error Handling

All endpoints should handle errors gracefully and return appropriate HTTP status codes:

- **200**: Success
- **400**: Bad Request (invalid parameters)
- **401**: Unauthorized (invalid guide email)
- **404**: Not Found (guide not found)
- **500**: Internal Server Error

**Error Response Format:**
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Implementation Notes

1. **Data Transformation**: The frontend code includes fallback logic to handle missing fields and provides default values.

2. **Alternative Field Names**: The frontend supports both primary and alternative field names (e.g., `tour` and `name`, `tourist` and `customerName`).

3. **Loading States**: All pages include loading spinners and skeleton screens while data is being fetched.

4. **Error Recovery**: Each page includes error banners with retry functionality.

5. **Mock Data Fallback**: When API data is unavailable, the frontend creates proportional mock data based on available totals.

## Database Schema Recommendations

Based on the endpoints, consider these database tables:

- `guides` - Guide profile information
- `tours` - Tour bookings and history
- `tour_ratings` - Customer ratings and reviews
- `guide_earnings` - Earnings tracking
- `guide_analytics` - Cached analytics data
- `customers` - Customer demographics
- `transactions` - Payment and transaction history

This structure ensures all endpoints can be efficiently implemented while maintaining data consistency.
