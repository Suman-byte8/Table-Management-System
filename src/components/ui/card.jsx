import React from 'react';

const Card = ({ className = '', ...props }) => {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
      {...props}
    />
  );
};

const CardContent = ({ className = '', ...props }) => {
  return (
    <div
      className={`p-6 ${className}`}
      {...props}
    />
  );
};

export { Card, CardContent };
