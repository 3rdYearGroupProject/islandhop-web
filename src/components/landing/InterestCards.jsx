import React from 'react';

/**
 * InterestCards - displays a row of interest icons with labels.
 * @param {Object} props
 * @param {function} [props.onSelect] - Optional callback when an interest is clicked (receives name)
 */
const INTERESTS = [
  { name: 'Beach', icon: 'FiUmbrella' },
  { name: 'Adventure', icon: 'FiActivity' },
  { name: 'Cultural', icon: 'FiBookOpen' },
  { name: 'Scenic', icon: 'FiMap' },
  { name: 'Wellness', icon: 'FiHeart' },
  { name: 'Shopping', icon: 'FiShoppingBag' },
  { name: 'Food', icon: 'FiCoffee' },
];

const InterestCards = ({ onSelect }) => (
  <section className="w-full my-4 py-6">
    <div className="w-full flex justify-center">
      <div className="flex flex-wrap gap-2 sm:gap-3 px-2 justify-center max-w-4xl">
        {INTERESTS.map(({ name, icon }) => {
          const Icon = require('react-icons/fi')[icon];
          return (
            <div
              key={name}
              className="flex flex-col items-center justify-end min-w-[4.5rem] max-w-[5rem] sm:min-w-[6rem] sm:max-w-[6rem] w-20 sm:w-24 h-28 sm:h-32 mx-1 cursor-pointer group"
              style={{ marginTop: '-1.5rem' }}
              onClick={onSelect ? () => onSelect(name) : undefined}
              tabIndex={0}
              role="button"
              aria-label={name}
            >
              <Icon className="text-3xl sm:text-4xl text-primary-600 mb-1 sm:mb-2 group-hover:text-primary-700 transition" aria-label={name} />
              <span className="text-sm sm:text-base font-light text-gray-900 mt-1 text-center leading-tight">{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default InterestCards;
