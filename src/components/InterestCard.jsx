
import React from 'react';
import Card, { CardBody } from './Card';
import { FaUmbrellaBeach, FaHiking, FaLandmark, FaMountain, FaSpa, FaShoppingBag, FaUtensils } from 'react-icons/fa';

const interestIcons = {
  Beach: FaUmbrellaBeach,
  Adventure: FaHiking,
  Cultural: FaLandmark,
  Scenic: FaMountain,
  Wellness: FaSpa,
  Shopping: FaShoppingBag,
  Food: FaUtensils,
};


const InterestCard = ({ 
  image, 
  title, 
  className = '',
  onClick,
  ...props 
}) => {
  const Icon = interestIcons[title] || FaMountain;
  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-shadow duration-200 ${className}`}
      onClick={onClick}
      {...props}
    >
      <CardBody padding="default" className="flex flex-col items-center text-center">
        <div className="w-16 h-16 mb-3 flex items-center justify-center text-primary-600 text-4xl">
          <Icon aria-label={title} />
        </div>
        <h3 className="font-light text-base text-gray-900">
          {title}
        </h3>
      </CardBody>
    </Card>
  );
};

export default InterestCard;
