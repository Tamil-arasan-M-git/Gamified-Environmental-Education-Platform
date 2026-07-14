import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{
          width: 60,
          height: 60,
          border: '6px solid #e0e0e0',
          borderTop: '6px solid #4CAF50',
          borderRadius: '50%',
        }}
      />
    </div>
  );
};

export default LoadingSpinner;