import React from 'react';
import { classNames } from '../../lib/utils';

export const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={classNames(
        'px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};