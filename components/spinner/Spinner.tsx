import React, { FC } from 'react';

interface SpinnerProps {
  size?: number;
  color?: string;
}

const Spinner: FC<SpinnerProps> = ({ size = 40, color = '#09f' }) => {
    const containerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', 
      };
  const spinnerStyle: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    border: `4px solid rgba(0, 0, 0, 0.1)`,
    borderTopColor: color, 
    borderRadius: '50%',
    animation: 'spin 1s ease infinite',
  };

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle}></div>
    </div>
  );
};

export default Spinner;
