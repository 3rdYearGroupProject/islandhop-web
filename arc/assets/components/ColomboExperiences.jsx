import React from 'react';
import ExploreCard from '../../../src/components/ExploreCard';
import CardGrid from '../../../src/components/CardGrid';

/**
 * ColomboExperiences - shows a scrollable row of featured experiences near Colombo.
 * @param {Object} props
 * @param {Array} [props.experiences] - Optional override for experiences list
 */
const DEFAULT_EXPERIENCES = [
  { title: 'Sigiriya Rock Fortress Day Trip', rating: 4.8, reviewCount: 1000, price: '$99', image: require('../../../src/assets/exp-colombo/sigiriya.jpeg') },
  { title: 'Elephant Orphanage & Spice Garden Tour', rating: 4.6, reviewCount: 850, price: '$75', image: require('../../../src/assets/exp-colombo/pinnawala.jpg') },
  { title: 'Galle Fort & Southern Coast Tour', rating: 4.9, reviewCount: 1200, price: '$120', image: require('../../../src/assets/exp-colombo/galle-fort.jpg') },
  { title: 'Tea Plantation & Kandy City Tour', rating: 4.7, reviewCount: 950, price: '$85', image: require('../../../src/assets/exp-colombo/tea-plantations.jpg') },
  { title: 'Whale Watching in Mirissa', rating: 4.5, reviewCount: 600, price: '$65', image: require('../../../src/assets/exp-colombo/whale-watching-mirissa.jpg') },
  { title: 'Colombo City Walking Tour', rating: 4.4, reviewCount: 400, price: '$45', image: require('../../../src/assets/exp-colombo/colombo-tour.jpg') }
];

const ColomboExperiences = ({ experiences = DEFAULT_EXPERIENCES }) => (
  <section className="w-full py-8">
    <div className="content-container">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Explore experiences near Colombo</h2>
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
          />
        ))}
      </CardGrid>
    </div>
  </section>
);

export default ColomboExperiences;
