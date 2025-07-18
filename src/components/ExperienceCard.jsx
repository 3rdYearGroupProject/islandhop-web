import React from 'react';
import Card, { CardBody } from './Card';

const ExperienceCard = ({ 
  image, 
  title, 
  rating, 
  reviewCount, 
  price, 
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
      <div className="aspect-w-16 aspect-h-9">
        <img 
          src={image} 
          alt={title}
          className="w-full h-36 object-cover rounded-t-lg"
        />
      </div>
      <CardBody padding="sm">
        <div className="space-y-1">
          <h3 className="font-bold text-gray-900 text-sm line-clamp-2">
            {title}
          </h3>
          {rating && (
            <div className="flex items-center gap-1">
              <span className="text-primary-600 text-sm font-semibold">
                {rating}
              </span>
              <span className="text-gray-500 text-sm">
                ({reviewCount?.toLocaleString() || 0})
              </span>
            </div>
          )}
          {price && (
            <div className="text-gray-700 text-sm">
              from <span className="font-semibold">{price}</span> per adult
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default ExperienceCard;
