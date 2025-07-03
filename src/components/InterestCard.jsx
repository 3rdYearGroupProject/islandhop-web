import React from 'react';
import Card, { CardBody } from './Card';

const InterestCard = ({ 
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
      <CardBody padding="default" className="flex flex-col items-center text-center">
        <div className="w-24 h-24 mb-3">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <h3 className="font-bold text-lg text-gray-900">
          {title}
        </h3>
      </CardBody>
    </Card>
  );
};

export default InterestCard;
