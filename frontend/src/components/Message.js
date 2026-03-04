import React from 'react';

const Message = ({ variant = 'error', children }) => {
  const className = variant === 'error' ? 'error-message' : 'success-message';
  
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default Message;
