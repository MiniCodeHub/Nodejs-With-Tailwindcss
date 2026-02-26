import { useState } from 'react';

interface StarRatingProps {
  value: number;                 // Controlled value
  onChange: (value: number) => void;
  max?: number;                  // Default 5
}

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  max = 5,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue ?? value;

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const isHalf = x < width / 2;
    setHoverValue(isHalf ? index - 0.5 : index);
  };

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number
  ) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const isHalf = x < width / 2;
    const newValue = isHalf ? index - 0.5 : index;
    onChange(newValue);
  };

  const renderStar = (index: number) => {
    let fillPercentage = 0;

    if (displayValue >= index) {
      fillPercentage = 100;
    } else if (displayValue >= index - 0.5) {
      fillPercentage = 50;
    }

    return (
      <div
        key={index}
        className="relative w-10 h-10 cursor-pointer"
        onMouseMove={(e) => handleMouseMove(e, index)}
        onMouseLeave={() => setHoverValue(null)}
        onClick={(e) => handleClick(e, index)}
      >
        {/* Empty star */}
        <svg
          viewBox="0 0 24 24"
          className="absolute w-full h-full text-gray-400"
          fill="currentColor"
        >
          <path d="M12 2l3 7 7 .5-5.5 4.5 1.7 7L12 17l-6.2 4 1.7-7L2 9.5 9 9z" />
        </svg>

        {/* Filled star */}
        <div
          className="absolute top-0 left-0 h-full overflow-hidden text-yellow-400"
          style={{ width: `${fillPercentage}%` }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-10 h-10"
            fill="currentColor"
          >
            <path d="M12 2l3 7 7 .5-5.5 4.5 1.7 7L12 17l-6.2 4 1.7-7L2 9.5 9 9z" />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: max }, (_, i) => renderStar(i + 1))}
      <span className="ml-3 text-white text-sm">
        {displayValue.toFixed(1)}
      </span>
    </div>
  );
};

export default function App() {
  const [rating, setRating] = useState<number>(3.5);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl text-center space-y-6">
        <h1 className="text-2xl font-bold text-white">
          Star Rating Component
        </h1>

        <StarRating value={rating} onChange={setRating} />

        <p className="text-gray-400 text-sm">
          Current rating: {rating}
        </p>
      </div>
    </div>
  );
}