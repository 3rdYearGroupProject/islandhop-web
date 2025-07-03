# Google Places API Setup Guide

To enable the Discover page functionality, you need to set up the Google Places API:

## Step 1: Get Google Places API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google Places API
   - Google Maps JavaScript API
4. Create credentials (API Key)
5. Restrict the API key for security:
   - Add HTTP referrers (websites) restrictions
   - Restrict to Google Places API and Google Maps JavaScript API

## Step 2: Configure Environment Variables

Update your `.env` file with your actual API key:

```env
REACT_APP_GOOGLE_PLACES_API_KEY=your_actual_api_key_here
```

## Step 3: Update HTML Script

The HTML file has been configured to use the environment variable. Make sure to replace the placeholder with your actual API key.

## Important Notes

- **API Limits**: Google Places API has usage limits and costs
- **Security**: Never commit real API keys to version control
- **Billing**: Enable billing in Google Cloud Console for the API to work
- **Quotas**: Monitor your API usage to avoid unexpected charges

## Testing

1. Set up your API key
2. Start the development server: `npm start`
3. Navigate to `/discover`
4. Search for places in Sri Lanka

The page will show:

- Popular destinations in Sri Lanka
- Category filters (attractions, restaurants, hotels, etc.)
- Place search with photos and ratings
- Interactive place details modal
- Favorites functionality
