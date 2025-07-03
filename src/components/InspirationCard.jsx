import React from 'react';
import Card, { CardBody } from './Card';

const InspirationCard = ({ 
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
      <div className="aspect-w-16 aspect-h-9">
        <img 
          src={image} 
          alt={title}
          className="w-full h-36 object-cover rounded-t-lg"
        />
      </div>
      <CardBody padding="sm">
        <h3 className="font-bold text-gray-900 text-sm">
          {title}
        </h3>
      </CardBody>
    </Card>
  );
};

export default InspirationCard;
