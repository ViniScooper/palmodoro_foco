import React from 'react';
import { Toast } from './toast';

export const Toaster = ({ toasts }) => {
  return (
    <div className="toaster">
      {toasts.map((toast, index) => (
        <Toast key={index} {...toast} />
      ))}
    </div>
  );
};