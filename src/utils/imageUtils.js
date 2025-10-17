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

// Import 10 additional city images (matching actual filenames)
import trincomaleeImg from '../assets/destinations/trincomaleeImg.jpg';
import jaffnaImg from '../assets/destinations/jaffnaImg.jpg';
import bentotaImg from '../assets/destinations/bentotaImg.jpg';
import hikkaduwaImg from '../assets/destinations/hikkaduwaImg.jpg';
import polonnaruwaImg from '../assets/destinations/polonnaruwaImg.jpg';
import dambullaImg from '../assets/destinations/dambullaImg.jpg';
import arugamBayImg from '../assets/destinations/arugamBayImg.jpg';
import unawatunaImg from '../assets/destinations/unawatunaImg.jpg';
import yalaImg from '../assets/destinations/yalaImg.jpg';
import negomboImg from '../assets/destinations/negomboImg.jpg';

// Default placeholder image - use a local asset
export const placeholderImage = colomboImg; // Fallback to colomboImg as default

// Map all our local image assets for easy access by city name
const cityImagesMap = {
  // Primary destinations with direct image matches (8 original)
  'colombo': colomboImg,
  'kandy': kandyImg,
  'galle': galleImg,
  'ella': ellaImg,
  'sigiriya': sigiriyaImg,
  'nuwara eliya': nuwaraEliyaImg,
  'mirissa': mirissaImg,
  'anuradhapura': anuradhapuraImg,
  
  // 10 additional cities with dedicated images
  'trincomalee': trincomaleeImg,
  'jaffna': jaffnaImg,
  'bentota': bentotaImg,
  'hikkaduwa': hikkaduwaImg,
  'polonnaruwa': polonnaruwaImg,
  'dambulla': dambullaImg,
  'arugam bay': arugamBayImg,
  'arugambay': arugamBayImg,
  'unawatuna': unawatunaImg,
  'yala': yalaImg,
  'negombo': negomboImg,
  
  // Common alternate spellings or city nicknames
  'nuwara-eliya': nuwaraEliyaImg,
  'nuwaraeliya': nuwaraEliyaImg,
  'arugam-bay': arugamBayImg,
  
  // Cities without dedicated images - map to closest match or by region
  'batticaloa': trincomaleeImg,
  'matara': galleImg,
  'tangalle': mirissaImg,
  'matale': kandyImg,
  'haputale': ellaImg,
  'badulla': ellaImg,
  'kalpitiya': negomboImg,
  'weligama': mirissaImg,
  
  // Regions/provinces
  'central province': kandyImg,
  'central': kandyImg,
  'southern province': galleImg,
  'southern': galleImg,
  'western province': colomboImg,
  'western': colomboImg,
  'northern province': jaffnaImg,
  'northern': jaffnaImg,
  'eastern province': trincomaleeImg,
  'eastern': trincomaleeImg,
  'north western province': negomboImg,
  'north western': negomboImg,
  'north central province': polonnaruwaImg,
  'north central': polonnaruwaImg,
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
      // Original 8 images
      colomboImg, 
      kandyImg, 
      galleImg, 
      ellaImg, 
      sigiriyaImg, 
      nuwaraEliyaImg, 
      mirissaImg, 
      anuradhapuraImg,
      // 10 additional images
      trincomaleeImg,
      jaffnaImg,
      bentotaImg,
      hikkaduwaImg,
      polonnaruwaImg,
      dambullaImg,
      arugamBayImg,
      unawatunaImg,
      yalaImg,
      negomboImg
    ];
    
    const index = cityNameSum % localImages.length;
    return localImages[index];
    
  } catch (error) {
    console.error("Error getting city image:", error);
    return placeholderImage;
  }
};

/**
 * Get a random image from the 18 available city images
 * Uses a seed (like tripId) to ensure consistent image for the same trip
 * 
 * @param {string} seed - Optional seed for consistent randomization (e.g., tripId)
 * @returns {string|Object} - Random local image import
 */
export const getRandomCityImage = (seed) => {
  const localImages = [
    // Original 8 images
    colomboImg, 
    kandyImg, 
    galleImg, 
    ellaImg, 
    sigiriyaImg, 
    nuwaraEliyaImg, 
    mirissaImg, 
    anuradhapuraImg,
    // 10 additional images
    trincomaleeImg,
    jaffnaImg,
    bentotaImg,
    hikkaduwaImg,
    polonnaruwaImg,
    dambullaImg,
    arugamBayImg,
    unawatunaImg,
    yalaImg,
    negomboImg
  ];
  
  if (seed) {
    // Use seed to get consistent "random" image for the same trip
    const seedSum = seed.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = seedSum % localImages.length;
    return localImages[index];
  }
  
  // True random if no seed provided
  const randomIndex = Math.floor(Math.random() * localImages.length);
  return localImages[randomIndex];
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
