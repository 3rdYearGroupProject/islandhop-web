import React from 'react';

const DestinationCard = ({ 
  destination, 
  onClick, 
  className = "",
  imageUrl = "https://placehold.co/400x300?text=Destination"
}) => {
  const handleClick = () => {
    console.log('🖱️ DestinationCard clicked:', destination.name);
    if (onClick) {
      onClick(destination);
    } else {
      console.warn('⚠️ No onClick handler provided to DestinationCard');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative w-full overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer ${className}`}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
        }}
      />
      
      {/* Gradient Overlay - Black to transparent from bottom to top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      
      {/* Content */}
      <div className="absolute bottom-4 right-4 text-right">
        <h3 className="text-white font-medium text-sm md:text-base drop-shadow-lg">
          {destination.name}
        </h3>
      </div>
    </button>
  );
};

export default DestinationCard;
