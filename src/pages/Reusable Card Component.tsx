import React from 'react';

// TypeScript interface for Card props
interface CardProps {
  title: string;
  description: string;
  image?: string;
  badge?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

// Reusable Card Component
const Card: React.FC<CardProps> = ({ 
  title, 
  description, 
  image, 
  badge, 
  buttonText = "Learn More",
  onButtonClick 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {image && (
        <div className="h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          {badge && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {badge}
            </span>
          )}
        </div>
        
        <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
        
        {buttonText && (
          <button 
            onClick={onButtonClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

// Interface for card data
interface CardData {
  title: string;
  description: string;
  image: string;
  badge: string;
  buttonText: string;
}

// Demo Component showing reusability
export default function CardDemo() {
  const handleCardClick = (cardTitle: string) => {
    alert(`You clicked: ${cardTitle}`);
  };

  const cardData: CardData[] = [
    {
      title: "Mountain Adventure",
      description: "Explore breathtaking mountain trails and discover nature's beauty in this unforgettable hiking experience.",
      image: "https://picsum.photos/seed/mountain/400/300",
      badge: "Popular",
      buttonText: "Book Now"
    },
    {
      title: "Beach Getaway",
      description: "Relax on pristine beaches with crystal clear waters. Perfect for families and solo travelers alike.",
      image: "https://picsum.photos/seed/beach/400/300",
      badge: "New",
      buttonText: "View Details"
    },
    {
      title: "City Explorer",
      description: "Experience vibrant city life, cultural landmarks, and world-class cuisine in this urban adventure.",
      image: "https://picsum.photos/seed/city/400/300",
      badge: "Trending",
      buttonText: "Explore"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
          Reusable Card Component
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Same component, different props - demonstrating component reusability
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardData.map((card: CardData, index: number) => (
            <Card
              key={index}
              title={card.title}
              description={card.description}
              image={card.image}
              badge={card.badge}
              buttonText={card.buttonText}
              onButtonClick={() => handleCardClick(card.title)}
            />
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Key Concepts Demonstrated:
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Props:</strong> The Card component accepts customizable props (title, description, image, badge, etc.)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Reusability:</strong> Same component rendered 3 times with different data</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Tailwind CSS:</strong> Utility classes for styling, hover effects, and responsive design</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span><strong>Default Props:</strong> buttonText has a default value of "Learn More"</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}