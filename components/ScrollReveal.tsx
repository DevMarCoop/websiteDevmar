// src/components/ScrollReveal.tsx

import React from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number; // Delay opcional para sequenciar as animações
  className?: string; // Para aplicar classes externas, se necessário
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, delay = 0, className }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 }); // amount: 20% do elemento visível

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ 
        duration: 0.6, 
        delay: delay, 
        ease: [0.17, 0.67, 0.83, 0.67] // Custom ease para um movimento suave
      }}
      style={{ pointerEvents: 'auto' }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;