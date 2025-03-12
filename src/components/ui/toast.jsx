import React from 'react';

export const Toast = ({ title, description, variant }) => {
  return (
    <div className={`toast ${variant}`}>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
};