'use client';

import React from 'react';

/* ---------------- Reusable Button Component ---------------- */

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
}: ButtonProps) {
  const baseStyles =
    'rounded-full font-medium transition-all duration-300 focus:outline-none';

  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-700 text-white hover:bg-gray-800',
    outline:
      'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed'
    : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles}`}
    >
      {children}
    </button>
  );
}

/* ---------------- Page ---------------- */

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-900">
      <h1 className="text-3xl font-bold text-white">
        Reusable Button Component System
      </h1>

      <div className="flex flex-wrap gap-4 justify-center">
        <Button>Primary</Button>

        <Button variant="secondary">
          Secondary
        </Button>

        <Button variant="outline">
          Outline
        </Button>

        <Button size="sm">
          Small
        </Button>

        <Button size="lg">
          Large
        </Button>

        <Button disabled>
          Disabled
        </Button>
      </div>
    </div>
  );
}
