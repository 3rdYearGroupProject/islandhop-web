# Trip Components

This directory contains modular components for the OngoingTripPage, making the codebase more maintainable and organized.

## Components

### TripBanner.jsx

- Displays the trip header with trip name, destination, dates, and trip highlights
- Shows ongoing trip status and remaining days
- Props: `tripData`, `formattedDates`, `daysLeft`

### TripStatusCard.jsx

- Manages the trip progress and status display
- Handles different states: not started, in progress, completed
- Includes start/end trip functionality
- Props: `tripName`, `currentDayIndex`, `dailyPlansLength`, `daysLeft`, `dayStarted`, `dayEnded`, `startMeterReading`, modal setters, `onNextDay`

### TripItinerary.jsx

- Displays the collapsible daily itinerary
- Shows attractions, restaurants, and hotels for each day
- Includes expand/collapse functionality for individual days
- Props: `dailyPlans`, `itineraryCollapsed`, `setItineraryCollapsed`, `expandedDays`, `setExpandedDays`, `setSelectedMarker`, `setShowTravelersModal`, `setSelectedDestination`

### TripMapView.jsx

- Renders the Google Maps integration
- Shows markers for attractions and places
- Handles map interactions and info windows
- Props: `dailyPlans`, `mapCenter`, `selectedMarker`, `setSelectedMarker`, `setShowTravelersModal`, `setSelectedDestination`

### TripChat.jsx

- Manages the chat functionality for trips with drivers/guides
- Integrates with the chat service
- Handles message sending and display
- Props: `tripId`, `tripData`

## Usage

These components are used in the main `OngoingTripPage.jsx` file:

```jsx
import TripBanner from '../components/trip/TripBanner';
import TripStatusCard from '../components/trip/TripStatusCard';
import TripItinerary from '../components/trip/TripItinerary';
import TripMapView from '../components/trip/TripMapView';
import TripChat from '../components/trip/TripChat';

// In the component render:
<TripBanner tripData={tripData} formattedDates={formattedDates} daysLeft={daysLeft} />
<TripStatusCard {...statusProps} />
<TripItinerary {...itineraryProps} />
<TripMapView {...mapProps} />
<TripChat tripId={actualTripId} tripData={tripData} />
```

## Benefits

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other parts of the application
3. **Testing**: Easier to unit test individual components
4. **Code Organization**: Cleaner and more organized codebase
5. **Performance**: Better code splitting and lazy loading opportunities

## Dependencies

- React hooks (useState, useEffect, useRef)
- Lucide React icons
- Google Maps React components
- Firebase authentication
- Custom utils (chatService, imageUtils, googleMapsConfig)
