# Calendar and Modal Components

This document describes the Calendar, Modal, and DatePicker components created for the IslandHop application, based on the TripAdvisor design but using our blue color system.

## Components Overview

### 1. Modal Component (`Modal.jsx`)

A reusable modal component that provides a backdrop and centered content area.

#### Props:
- `isOpen` (boolean): Controls modal visibility
- `onClose` (function): Callback when modal should close
- `title` (string): Optional modal title
- `size` ('sm'|'md'|'lg'|'xl'|'full'): Modal size
- `showCloseButton` (boolean): Show/hide close button
- `className` (string): Additional CSS classes

#### Usage:
```jsx
<Modal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)}
  title="My Modal"
  size="md"
>
  <p>Modal content goes here</p>
</Modal>
```

### 2. Calendar Component (`Calendar.jsx`)

A full-featured calendar component with date selection capabilities.

#### Props:
- `selectedDates` (array): Array of selected Date objects
- `onDateSelect` (function): Callback when a date is selected
- `onDateRangeSelect` (function): Callback when a date range is selected
- `mode` ('single'|'range'|'multiple'): Selection mode
- `minDate` (Date): Minimum selectable date
- `maxDate` (Date): Maximum selectable date
- `disabledDates` (array): Array of disabled Date objects

#### Features:
- **Single date selection**: Select one date
- **Range selection**: Select start and end dates
- **Multiple selection**: Select multiple individual dates
- **Month navigation**: Previous/next month buttons
- **Date validation**: Min/max dates and disabled dates
- **Visual feedback**: Selected, disabled, and range highlighting

#### Usage:
```jsx
<Calendar
  selectedDates={selectedDates}
  onDateSelect={handleDateSelect}
  mode="range"
  minDate={new Date()}
/>
```

### 3. DatePicker Component (`DatePicker.jsx`)

A combined Modal + Calendar component that mimics TripAdvisor's date picker.

#### Props:
- `isOpen` (boolean): Controls visibility
- `onClose` (function): Close callback
- `onApply` (function): Apply selected dates callback
- `onClear` (function): Clear dates callback
- `title` (string): Modal title (default: "Add dates")
- `mode` ('single'|'range'|'multiple'): Selection mode
- `initialDates` (array): Initial selected dates

#### Features:
- **Modal integration**: Full modal with backdrop
- **Apply/Clear actions**: Confirm or reset selections
- **Temporary selection**: Preview selections before applying
- **State management**: Handles temporary vs applied states

#### Usage:
```jsx
<DatePicker
  isOpen={isDatePickerOpen}
  onClose={() => setIsDatePickerOpen(false)}
  onApply={handleDateApply}
  onClear={handleDateClear}
  mode="range"
  initialDates={selectedDates}
/>
```

## Color Scheme

The components use our system's blue color palette instead of TripAdvisor's green:

- **Primary**: `primary-600` (#2563eb) - Selected dates, buttons
- **Primary Light**: `primary-100` (#dbeafe) - Date range background
- **Primary Dark**: `primary-700` (#1d4ed8) - Hover states
- **Hover**: `primary-50` (#eff6ff) - Light hover background

## Integration with LandingPage

The DatePicker is integrated into the main search form on the landing page:

1. **Search form enhancement**: Added date selection field
2. **State management**: Manages selected dates in component state
3. **User interaction**: Click to open modal, select dates, apply changes
4. **Visual feedback**: Shows selected date range in form field

## Responsive Design

All components are fully responsive:

- **Mobile**: Single column layout, touch-friendly targets
- **Tablet**: Optimized spacing and sizing
- **Desktop**: Full layout with proper spacing

## Accessibility

Components include accessibility features:

- **Keyboard navigation**: Tab through calendar dates
- **ARIA labels**: Screen reader support
- **Focus management**: Proper focus handling in modals
- **Color contrast**: Meets WCAG guidelines

## Example Implementation

See `DatePickerDemo.jsx` for a complete example of how to use the DatePicker component with state management and event handling.
