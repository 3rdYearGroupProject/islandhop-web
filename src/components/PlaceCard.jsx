import React from 'react';
import Card, { CardBody } from './Card';

const PlaceCard = ({ 
  image, 
  title, 
  className = '',
  onClick,
  ...props 
}) => {
  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-shadow duration-200 ${className}`}
      onClick={onClick}
      {...props}
    >
      <CardBody padding="sm" className="flex flex-col items-center text-center">
        <div className="w-full h-24 mb-2">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <h3 className="font-bold text-gray-900 text-sm text-center">
          {title}
        </h3>
      </CardBody>
    </Card>
  );
};

export default PlaceCard;
