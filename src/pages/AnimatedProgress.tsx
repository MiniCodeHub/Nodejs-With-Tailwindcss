'use client';

import React from 'react';

/* ---------------- Progress Bar Component ---------------- */

interface ProgressBarProps {
  value: number; // 0 - 100
}

function ProgressBar({ value }: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  const colorClasses =
    safeValue < 40
      ? 'bg-red-500'
      : safeValue < 70
      ? 'bg-yellow-500'
      : 'bg-green-500';

  return (
    <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
      <div
        className={`h-full ${colorClasses} transition-all duration-700 ease-out`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

/* ---------------- Page ---------------- */

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-white text-center">
          Animated Progress Bar
        </h1>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Low Progress (25%)</p>
            <ProgressBar value={25} />
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Medium Progress (55%)</p>
            <ProgressBar value={55} />
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">High Progress (85%)</p>
            <ProgressBar value={85} />
          </div>
        </div>
      </div>
    </div>
  );
}
