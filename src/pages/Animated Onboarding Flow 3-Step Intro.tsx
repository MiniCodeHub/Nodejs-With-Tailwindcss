import { useState } from 'react';

interface Step {
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

export default function App() {

  const steps: Step[] = [
    {
      title: 'Welcome',
      description:
        'Build modern user experiences with smooth onboarding flows and interactive UI components.',
      icon: '🚀',
      gradient:
        'from-cyan-500 to-blue-600',
    },
    {
      title: 'Stay Organized',
      description:
        'Track your projects, tasks, and workflows with powerful productivity tools.',
      icon: '📂',
      gradient:
        'from-violet-500 to-purple-600',
    },
    {
      title: 'Launch Faster',
      description:
        'Deploy modern applications quickly with scalable frontend architecture.',
      icon: '⚡',
      gradient:
        'from-pink-500 to-rose-600',
    },
  ];

  const [currentStep, setCurrentStep] =
    useState(0);

  const nextStep = () => {

    if (currentStep < steps.length - 1) {

      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {

    if (currentStep > 0) {

      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="
      min-h-screen
      bg-gray-950
      flex
      items-center
      justify-center
      p-6
    ">

      <div className="
        relative
        w-full
        max-w-md
        bg-gray-900
        border
        border-gray-800
        rounded-3xl
        overflow-hidden
        shadow-2xl
      ">

        {/* Background Glow */}
        <div className={`
          absolute
          inset-0
          bg-gradient-to-br
          ${step.gradient}
          opacity-10
        `} />

        {/* Content */}
        <div className="
          relative
          z-10
          px-8
          py-12
          text-center
        ">

          {/* Progress */}
          <div className="
            flex
            justify-center
            gap-3
            mb-10
          ">

            {steps.map((_, index) => (

              <div
                key={index}
                className={`
                  h-2
                  rounded-full
                  transition-all
                  duration-500

                  ${
                    currentStep === index
                      ? 'w-12 bg-cyan-400'
                      : 'w-2 bg-gray-700'
                  }
                `}
              />
            ))}
          </div>

          {/* Icon */}
          <div className={`
            w-28
            h-28
            mx-auto
            rounded-full
            flex
            items-center
            justify-center
            text-5xl
            bg-gradient-to-br
            ${step.gradient}
            shadow-2xl
            mb-8
            animate-pulse
          `}>
            {step.icon}
          </div>

          {/* Title */}
          <h1 className="
            text-4xl
            font-bold
            text-white
            mb-5
          ">
            {step.title}
          </h1>

          {/* Description */}
          <p className="
            text-gray-400
            leading-8
            text-lg
          ">
            {step.description}
          </p>

          {/* Buttons */}
          <div className="
            flex
            justify-between
            gap-4
            mt-12
          ">

            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="
                flex-1
                py-4
                rounded-2xl
                bg-gray-800
                text-white
                font-semibold
                transition
                hover:bg-gray-700
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >
              Previous
            </button>

            {currentStep ===
            steps.length - 1 ? (

              <button
                className={`
                  flex-1
                  py-4
                  rounded-2xl
                  text-white
                  font-semibold
                  bg-gradient-to-r
                  ${step.gradient}
                  hover:scale-105
                  transition
                `}
              >
                Get Started
              </button>

            ) : (

              <button
                onClick={nextStep}
                className={`
                  flex-1
                  py-4
                  rounded-2xl
                  text-white
                  font-semibold
                  bg-gradient-to-r
                  ${step.gradient}
                  hover:scale-105
                  transition
                `}
              >
                Next
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}