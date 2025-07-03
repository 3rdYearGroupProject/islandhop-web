import { useState, useEffect } from 'react';

// Import images
import sigiriyaImg from '../assets/exp-colombo/sigiriya.jpeg';
import pinnawalaImg from '../assets/exp-colombo/pinnawala.jpg';
import galleFortImg from '../assets/exp-colombo/galle-fort.jpg';
import teaPlantationsImg from '../assets/exp-colombo/tea-plantations.jpg';
import whaleWatchingImg from '../assets/exp-colombo/whale-watching-mirissa.jpg';
import colomboTourImg from '../assets/exp-colombo/colombo-tour.jpg';

// Default experience data
const defaultExperiences = [
  { 
    id: 1,
    title: 'Sigiriya Rock Fortress Day Trip', 
    rating: 4.8, 
    reviewCount: 1000, 
    price: '$99', 
    image: sigiriyaImg,
    category: 'cultural',
    duration: '8 hours',
    location: 'Sigiriya'
  },
  { 
    id: 2,
    title: 'Elephant Orphanage & Spice Garden Tour', 
    rating: 4.6, 
    reviewCount: 850, 
    price: '$75', 
    image: pinnawalaImg,
    category: 'wildlife',
    duration: '6 hours',
    location: 'Pinnawala'
  },
  { 
    id: 3,
    title: 'Galle Fort & Southern Coast Tour', 
    rating: 4.9, 
    reviewCount: 1200, 
    price: '$120', 
    image: galleFortImg,
    category: 'cultural',
    duration: '10 hours',
    location: 'Galle'
  },
  { 
    id: 4,
    title: 'Tea Plantation & Kandy City Tour', 
    rating: 4.7, 
    reviewCount: 950, 
    price: '$85', 
    image: teaPlantationsImg,
    category: 'scenic',
    duration: '9 hours',
    location: 'Kandy'
  },
  { 
    id: 5,
    title: 'Whale Watching in Mirissa', 
    rating: 4.5, 
    reviewCount: 600, 
    price: '$65', 
    image: whaleWatchingImg,
    category: 'adventure',
    duration: '4 hours',
    location: 'Mirissa'
  },
  { 
    id: 6,
    title: 'Colombo City Walking Tour', 
    rating: 4.4, 
    reviewCount: 400, 
    price: '$45', 
    image: colomboTourImg,
    category: 'cultural',
    duration: '3 hours',
    location: 'Colombo'
  }
];

/**
 * Custom hook for managing experience data
 * Provides filtering, sorting, and future API integration capabilities
 */
export const useExperiences = (options = {}) => {
  const {
    category = null,
    sortBy = 'rating', // 'rating', 'price', 'reviewCount', 'title'
    sortOrder = 'desc', // 'asc', 'desc'
    limit = null
  } = options;

  const [experiences, setExperiences] = useState(defaultExperiences);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter experiences by category
  const filteredExperiences = category 
    ? experiences.filter(exp => exp.category === category)
    : experiences;

  // Sort experiences
  const sortedExperiences = [...filteredExperiences].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle price sorting (remove $ and convert to number)
    if (sortBy === 'price') {
      aValue = parseFloat(aValue.replace('$', ''));
      bValue = parseFloat(bValue.replace('$', ''));
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Apply limit if specified
  const finalExperiences = limit 
    ? sortedExperiences.slice(0, limit)
    : sortedExperiences;

  // Future API integration placeholder
  const fetchExperiences = async (endpoint) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(endpoint);
      // const data = await response.json();
      // setExperiences(data);
      
      // For now, simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setExperiences(defaultExperiences);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    experiences: finalExperiences,
    allExperiences: experiences,
    loading,
    error,
    fetchExperiences,
    // Utility functions
    getExperienceById: (id) => experiences.find(exp => exp.id === id),
    getExperiencesByCategory: (cat) => experiences.filter(exp => exp.category === cat),
    getCategories: () => [...new Set(experiences.map(exp => exp.category))],
    // Stats
    totalExperiences: experiences.length,
    averageRating: experiences.reduce((sum, exp) => sum + exp.rating, 0) / experiences.length,
    priceRange: {
      min: Math.min(...experiences.map(exp => parseFloat(exp.price.replace('$', '')))),
      max: Math.max(...experiences.map(exp => parseFloat(exp.price.replace('$', ''))))
    }
  };
};

export default useExperiences;
