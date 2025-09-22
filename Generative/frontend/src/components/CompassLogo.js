import React from 'react';

const CompassLogo = ({ className = "w-12 h-12" }) => {
  return (
    <svg 
      className={className}
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Compass outer circle */}
      <circle 
        cx="50" 
        cy="50" 
        r="45" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      
      {/* Compass needle - North */}
      <polygon 
        points="50,15 45,50 50,85 55,50" 
        fill="#ef4444" 
        stroke="#dc2626" 
        strokeWidth="1"
      />
      
      {/* Compass needle - East */}
      <polygon 
        points="15,50 50,45 85,50 50,55" 
        fill="#3b82f6" 
        stroke="#2563eb" 
        strokeWidth="1"
      />
      
      {/* Center circle */}
      <circle 
        cx="50" 
        cy="50" 
        r="5" 
        fill="#1f2937" 
        stroke="white" 
        strokeWidth="2"
      />
      
      {/* Cardinal directions */}
      <text 
        x="50" 
        y="10" 
        textAnchor="middle" 
        fill="currentColor" 
        fontSize="12" 
        fontWeight="bold"
      >
        N
      </text>
      <text 
        x="90" 
        y="55" 
        textAnchor="middle" 
        fill="currentColor" 
        fontSize="12" 
        fontWeight="bold"
      >
        E
      </text>
      <text 
        x="50" 
        y="95" 
        textAnchor="middle" 
        fill="currentColor" 
        fontSize="12" 
        fontWeight="bold"
      >
        S
      </text>
      <text 
        x="10" 
        y="55" 
        textAnchor="middle" 
        fill="currentColor" 
        fontSize="12" 
        fontWeight="bold"
      >
        W
      </text>
    </svg>
  );
};

export default CompassLogo;