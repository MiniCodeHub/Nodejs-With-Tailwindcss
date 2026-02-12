'use client';

import React from 'react';

/* ---------------- Pricing Card Component ---------------- */

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}

function PricingCard({
  title,
  price,
  features,
  highlighted = false,
}: PricingCardProps) {
  return (
    <div
      className={`rounded-2xl p-8 transition-all duration-300 ${
        highlighted
          ? 'bg-blue-600 text-white scale-105 shadow-2xl'
          : 'bg-gray-800 text-gray-200'
      }`}
    >
      <h3 className="text-2xl font-bold mb-4 text-center">{title}</h3>

      <p className="text-4xl font-extrabold text-center mb-6">
        {price}
      </p>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="text-sm text-center">
            {feature}
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-3 rounded-lg font-semibold transition ${
          highlighted
            ? 'bg-white text-blue-600 hover:bg-gray-100'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        Get Started
      </button>
    </div>
  );
}

/* ---------------- Page ---------------- */

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-900 px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Responsive Pricing Cards
        </h1>

        {/* Grid Layout */}
        <div className="grid gap-8 md:grid-cols-3">
          <PricingCard
            title="Basic"
            price="$9/mo"
            features={[
              '1 Project',
              'Basic Support',
              'Limited Features',
            ]}
          />

          <PricingCard
            title="Pro"
            price="$29/mo"
            features={[
              '5 Projects',
              'Priority Support',
              'Advanced Features',
            ]}
            highlighted
          />

          <PricingCard
            title="Enterprise"
            price="$99/mo"
            features={[
              'Unlimited Projects',
              'Dedicated Support',
              'All Features Included',
            ]}
          />
        </div>
      </div>
    </div>
  );
}
