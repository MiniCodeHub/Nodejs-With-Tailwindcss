import { useState } from 'react';

interface Step {
  id: number;
  title: string;
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const steps: Step[] = [
    { id: 1, title: 'Account' },
    { id: 2, title: 'Profile' },
    { id: 3, title: 'Payment' },
    { id: 4, title: 'Complete' },
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const progressWidth =
    ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6">
      
      <div className="w-full max-w-3xl">
        
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">
            Stepper Component
          </h1>

          <p className="text-gray-400">
            React + Tailwind Progress Tracker
          </p>
        </div>

        {/* Stepper */}
        <div className="relative mb-12">
          
          {/* Background Line */}
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-700 rounded-full" />

          {/* Active Progress */}
          <div
            className="absolute top-5 left-0 h-1 bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${progressWidth}%` }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step) => {
              const isActive = currentStep >= step.id;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center"
                >
                  {/* Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-all duration-300 z-10
                    ${
                      isActive
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-gray-900 border-gray-600 text-gray-400'
                    }`}
                  >
                    {step.id}
                  </div>

                  {/* Label */}
                  <p
                    className={`mt-3 text-sm font-medium transition
                    ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition"
          >
            Previous
          </button>

          <button
            onClick={nextStep}
            disabled={currentStep === steps.length}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
          >
            Next
          </button>
        </div>

        {/* Current Step */}
        <div className="text-center mt-8">
          <p className="text-gray-400">
            Current Step:
            <span className="text-white font-semibold ml-2">
              {steps[currentStep - 1].title}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}