import React from 'react';
import ExploreCard from '../../components/ExploreCard';
import CardGrid from '../../components/CardGrid';

/**
 * ColomboExperiences - shows a scrollable row of featured experiences near Colombo.
 * @param {Object} props
 * @param {Array} [props.experiences] - Optional override for experiences list
 * @param {Function} [props.onExperienceClick] - Handler for experience card clicks
 */
const DEFAULT_EXPERIENCES = [
  { 
    title: 'Sigiriya Rock Fortress Day Trip', 
    rating: 4.8, 
    reviewCount: 1000, 
    price: '$99', 
    image: require('../../assets/exp-colombo/sigiriya.jpeg'),
    description: 'Embark on a journey to the ancient Sigiriya Rock Fortress, one of Sri Lanka\'s most iconic UNESCO World Heritage sites. This 5th-century royal citadel rises dramatically 200 meters above the surrounding jungle, offering breathtaking views and fascinating history.',
    highlights: ['UNESCO World Heritage Site', 'Ancient royal palace ruins', 'Famous frescoes and mirror wall', 'Panoramic views from summit', 'Lion Gate entrance'],
    duration: 'Full day (8-10 hours)',
    bestTime: 'Early morning start to avoid crowds'
  },
  { 
    title: 'Elephant Orphanage & Spice Garden Tour', 
    rating: 4.6, 
    reviewCount: 850, 
    price: '$75', 
    image: require('../../assets/exp-colombo/pinnawala.jpg'),
    description: 'Visit the world-famous Pinnawala Elephant Orphanage to witness rescued elephants in their natural habitat, followed by an aromatic journey through traditional spice gardens where you\'ll learn about Sri Lanka\'s renowned spices.',
    highlights: ['Largest elephant orphanage', 'Elephant feeding and bathing', 'Traditional spice garden tour', 'Learn about cinnamon production', 'Local lunch included'],
    duration: 'Half day (4-5 hours)',
    bestTime: 'Morning for elephant feeding time'
  },
  { 
    title: 'Galle Fort & Southern Coast Tour', 
    rating: 4.9, 
    reviewCount: 1200, 
    price: '$120', 
    image: require('../../assets/exp-colombo/galle-fort.jpg'),
    description: 'Explore the historic Galle Fort, a 16th-century Portuguese citadel later fortified by the Dutch. Walk along cobblestone streets lined with colonial architecture, art galleries, and boutique shops, then enjoy the stunning southern coastline.',
    highlights: ['UNESCO World Heritage Fort', 'Colonial architecture', 'Ocean-facing ramparts', 'Art galleries and shops', 'Beautiful coastal views'],
    duration: 'Full day (8-9 hours)',
    bestTime: 'Sunset for best rampart views'
  },
  { 
    title: 'Tea Plantation & Kandy City Tour', 
    rating: 4.7, 
    reviewCount: 950, 
    price: '$85', 
    image: require('../../assets/exp-colombo/tea-plantations.jpg'),
    description: 'Journey to the hill country to explore lush tea plantations and learn about Ceylon tea production. Visit the sacred Temple of the Tooth in Kandy, Sri Lanka\'s cultural capital, and stroll around the beautiful Kandy Lake.',
    highlights: ['Tea plantation tour', 'Tea tasting experience', 'Temple of the Tooth', 'Kandy Lake walk', 'Cultural capital exploration'],
    duration: 'Full day (9-10 hours)',
    bestTime: 'Morning for tea plantation visit'
  },
  { 
    title: 'Whale Watching in Mirissa', 
    rating: 4.5, 
    reviewCount: 600, 
    price: '$65', 
    image: require('../../assets/exp-colombo/whale-watching-mirissa.jpg'),
    description: 'Set sail from the picturesque fishing village of Mirissa for an unforgettable whale watching experience. Spot blue whales, sperm whales, and dolphins in their natural habitat in the deep waters of the Indian Ocean.',
    highlights: ['Blue whale sightings', 'Dolphin encounters', 'Scenic boat ride', 'Beautiful coastal village', 'Marine wildlife photography'],
    duration: 'Full day (8-9 hours)',
    bestTime: 'November to April season'
  },
  { 
    title: 'Colombo City Walking Tour', 
    rating: 4.4, 
    reviewCount: 400, 
    price: '$45', 
    image: require('../../assets/exp-colombo/colombo-tour.jpg'),
    description: 'Discover the vibrant capital city of Colombo on foot with a local guide. Explore bustling markets, colonial architecture, modern developments, and taste authentic street food while learning about the city\'s rich history and culture.',
    highlights: ['Local guide expertise', 'Street food tasting', 'Colonial architecture', 'Bustling local markets', 'Cultural insights'],
    duration: 'Half day (3-4 hours)',
    bestTime: 'Morning or late afternoon'
  }
];

const ColomboExperiences = ({ experiences = DEFAULT_EXPERIENCES, onExperienceClick }) => (
  <section className="w-full py-8">
    <div className="content-container">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Explore experiences near Colombo</h2>
      <CardGrid cardType="scroll" maxCards={6}>
        {experiences.map((exp, i) => (
          <ExploreCard
            key={i}
            image={exp.image}
            title={exp.title}
            rating={exp.rating}
            reviewCount={exp.reviewCount}
            price={exp.price}
            className="flex-shrink-0"
            onClick={() => onExperienceClick && onExperienceClick(exp)}
          />
        ))}
      </CardGrid>
    </div>
  </section>
);

export default ColomboExperiences;
