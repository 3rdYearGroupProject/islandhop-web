# PoolPage Documentation

## Overview

The PoolPage has been refactored into a modular structure with 4 separate components for better maintainability and organization. The main PoolPage.jsx serves as the entry point with tab navigation.

## File Structure

```
src/pages/
├── PoolPage.jsx (Entry point with tab navigation)
└── pools/
    ├── FindPools.jsx (Find available pools)
    ├── MyPools.jsx (User's pools and history)
    ├── ConfirmedPools.jsx (Confirmed pool details)
    └── OngoingPools.jsx (Live ongoing pool tracking)
```

## Components

### 1. PoolPage.jsx (Entry Point)

- **Purpose**: Main container with tab navigation and routing
- **Features**:
  - Hero section with gradient background
  - Tab navigation with modern design
  - Dynamic component rendering based on active tab
  - Responsive design with proper spacing

### 2. FindPools.jsx

- **Purpose**: Browse and search for available travel pools
- **Features**:
  - Advanced search and filtering (destination, seats, keyword)
  - Grid layout of pool cards with hover effects
  - Pool information: name, owner, destinations, rating, participants, price
  - Star rating system
  - Pagination controls
  - Join pool functionality

### 3. MyPools.jsx

- **Purpose**: User's personal pool management dashboard
- **Features**:
  - **Ongoing Pool**: Full-width card with itinerary progress
  - **Upcoming Pools**: Horizontal scrollable cards
  - **Pool History**: Completed and cancelled pools
  - Create new pool button
  - Search and filter personal pools
  - Visual status indicators (ongoing, upcoming, completed, cancelled)

### 4. ConfirmedPools.jsx

- **Purpose**: Detailed view of confirmed pools ready to start
- **Features**:
  - Complete pool information with guide and driver details
  - **Payment Status**: Progress bars and payment tracking
  - Participant list with role-based color coding
  - Itinerary timeline with progress indicators
  - Important notes and contact information
  - Action buttons for communication and downloads

### 5. OngoingPools.jsx

- **Purpose**: Live tracking of current trips
- **Features**:
  - **Live Status Banner**: Real-time location and ETA
  - **Journey Progress**: Visual timeline with current location
  - **Live Map Integration**: Placeholder for GPS tracking
  - **Active Participants**: Online status indicators
  - **Live Updates Feed**: Real-time messages and updates
  - **Emergency Information**: Quick access to emergency contacts
  - Group chat and emergency call functionality

## Design Features

### Color Scheme

- **Find Pools**: Primary blue theme
- **My Pools**: Success green for ongoing, warning orange for upcoming
- **Confirmed**: Info blue with payment status indicators
- **Ongoing**: Success green with live status elements

### Interactive Elements

- Hover effects on cards and buttons
- Progress bars for payments and journey tracking
- Live status indicators with animations
- Responsive grid layouts
- Modern tab navigation

### Accessibility

- Proper contrast ratios
- Icon usage with text labels
- Keyboard navigation support
- Screen reader friendly structure

## Integration

- Fully integrated with project's design system
- Uses existing Card, Navbar components
- Follows project's color palette and styling conventions
- Responsive design across all screen sizes

## Future Enhancements

- Real-time WebSocket integration for live updates
- Google Maps integration for live tracking
- Push notifications for pool updates
- Payment gateway integration
- Advanced filtering and search capabilities
