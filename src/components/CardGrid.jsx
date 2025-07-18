import React from 'react';

const CardGrid = ({ 
  children, 
  maxCards = 6,
  cardType = 'default',
  className = '',
  ...props 
}) => {
  const limitedChildren = React.Children.toArray(children).slice(0, maxCards);
  
  const getGridClasses = () => {
    switch (cardType) {
      case 'experience':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-stretch';
      case 'interest':
        return 'grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center items-stretch';
      case 'place':
        return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 justify-items-center items-stretch';
      case 'collection':
        return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center items-stretch';
      case 'scroll':
        return 'flex gap-4 overflow-x-auto pb-2 scrollbar-hide justify-start';
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-items-center items-stretch';
    }
  };

  return (
    <div 
      className={`${getGridClasses()} ${className}`}
      {...props}
    >
      {limitedChildren}
    </div>
  );
};

export default CardGrid;
