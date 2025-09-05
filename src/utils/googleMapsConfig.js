// Google Maps configuration constants to prevent repeated API loading
export const GOOGLE_MAPS_LIBRARIES = ['places', 'marker'];

export const DEFAULT_MAP_OPTIONS = {
  id: 'google-map-script',
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  libraries: GOOGLE_MAPS_LIBRARIES,
  preventGoogleFontsLoading: true
};
