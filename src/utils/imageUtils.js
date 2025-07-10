/**
 * Utility functions for handling images across the application
 */

// Import local images to use as placeholders and city images
// We'll use the existing assets from the project
import colomboImg from '../assets/destinations/colombo.jpg';
import kandyImg from '../assets/destinations/kandy.jpg';
import galleImg from '../assets/destinations/galle.jpg';
import ellaImg from '../assets/destinations/ella.jpg';
import sigiriyaImg from '../assets/destinations/sigiriya.jpg';
import nuwaraEliyaImg from '../assets/destinations/nuwara-eliya.jpg';
import mirissaImg from '../assets/destinations/mirissa.jpg';
import anuradhapuraImg from '../assets/destinations/anuradhapura.jpg';

// Default placeholder image - use a local asset
export const placeholderImage = colomboImg; // Fallback to colomboImg as default

// Map all our local image assets for easy access by city name
const cityImagesMap = {
  // Primary destinations with direct image matches
  'colombo': colomboImg,
  'kandy': kandyImg,
  'galle': galleImg,
  'ella': ellaImg,
  'sigiriya': sigiriyaImg,
  'nuwara eliya': nuwaraEliyaImg,
  'mirissa': mirissaImg,
  'anuradhapura': anuradhapuraImg,
  
  // Common alternate spellings or city nicknames
  'nuwara-eliya': nuwaraEliyaImg,
  'nuwaraeliya': nuwaraEliyaImg,
  
  // Cities without dedicated images - map to closest match or by region
  'jaffna': anuradhapuraImg,
  'trincomalee': mirissaImg,
  'batticaloa': mirissaImg,
  'negombo': colomboImg,
  'hikkaduwa': galleImg,
  'matara': galleImg,
  'polonnaruwa': anuradhapuraImg,
  'dambulla': sigiriyaImg,
  'yala': anuradhapuraImg,
  'unawatuna': galleImg,
  'bentota': galleImg,
  'tangalle': mirissaImg,
  'matale': kandyImg,
  'haputale': ellaImg,
  'badulla': ellaImg,
  'arugam bay': mirissaImg,
  'kalpitiya': colomboImg,
  'weligama': mirissaImg,
  
  // Regions/provinces
  'central province': kandyImg,
  'central': kandyImg,
  'southern province': galleImg,
  'southern': galleImg,
  'western province': colomboImg,
  'western': colomboImg,
  'northern province': anuradhapuraImg,
  'northern': anuradhapuraImg,
  'eastern province': mirissaImg,
  'eastern': mirissaImg,
  'north western province': colomboImg,
  'north western': colomboImg,
  'north central province': anuradhapuraImg,
  'north central': anuradhapuraImg,
  'uva province': ellaImg,
  'uva': ellaImg,
  'sabaragamuwa province': kandyImg,
  'sabaragamuwa': kandyImg
};

/**
 * Check if a URL is likely to be a valid image URL
 * This function is useful when working with external image URLs
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether the URL is likely valid
 */
export const isValidImageUrl = (url) => {
  if (!url) return false;
  
  // If it's a local import (object), it's valid
  if (typeof url === 'object' || url.startsWith('data:') || url.startsWith('blob:')) {
    return true;
  }
  
  // Check if URL has valid format
  try {
    new URL(url);
  } catch (e) {
    // If it's not a valid URL but begins with '/', it might be a local path
    return url.startsWith('/');
  }

  // Check if URL has an image extension
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const hasImageExtension = imageExtensions.some(ext => 
    url.toLowerCase().endsWith(ext)
  );
  
  // Check if URL is from a common image host
  const commonImageHosts = [
    'unsplash.com',
    'images.unsplash.com',
    'imgur.com',
    'i.imgur.com',
    'placehold.co',
    'placekitten.com',
    'picsum.photos',
    'cloudinary.com',
    'res.cloudinary.com',
    'storage.googleapis.com',
    's3.amazonaws.com'
  ];
  
  const urlObj = new URL(url);
  const isCommonHost = commonImageHosts.some(host => 
    urlObj.hostname.includes(host)
  );
  
  return hasImageExtension || isCommonHost || url.includes('data:image/');
};

/**
 * Get a city-specific image based on the city name
 * This function returns local images for each city for reliable loading
 * 
 * @param {string} city - The city or destination name
 * @returns {string|Object} - Local image import for the city
 */
export const getCityImageUrl = (city) => {
  if (!city) return placeholderImage;
  
  try {
    // Try to normalize the city name for matching
    const normalizedCity = city.trim().toLowerCase();

    // Try direct match from our city image map
    for (const [cityKey, imageUrl] of Object.entries(cityImagesMap)) {
      if (normalizedCity === cityKey || normalizedCity.includes(cityKey)) {
        return imageUrl;
      }
    }
    
    // For any place that includes "sri lanka" but no city, use a random image
    if (normalizedCity.includes('sri lanka')) {
      const allImages = Object.values(cityImagesMap);
      const randomIndex = Math.floor(Math.random() * allImages.length);
      return allImages[randomIndex];
    }
    
    // Use a hash function to consistently select an image based on the city name
    // This ensures the same city always gets the same image, even if not explicitly mapped
    const cityNameSum = normalizedCity.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const localImages = [
      colomboImg, 
      kandyImg, 
      galleImg, 
      ellaImg, 
      sigiriyaImg, 
      nuwaraEliyaImg, 
      mirissaImg, 
      anuradhapuraImg
    ];
    
    const index = cityNameSum % localImages.length;
    return localImages[index];
    
  } catch (error) {
    console.error("Error getting city image:", error);
    return placeholderImage;
  }
};

/**
 * Log image loading errors with useful debug information
 * @param {string} componentName - The component where the error occurred
 * @param {object} item - The item (trip, place) with the failed image
 * @param {string} imageUrl - The URL that failed to load
 */
export const logImageError = (componentName, item, imageUrl) => {
  console.warn(
    `Image loading error in ${componentName}: 
    Item: ${item?.name || item?.id || 'Unknown'} 
    URL: ${imageUrl || 'None provided'}
    Falling back to local image.`
  );
};
