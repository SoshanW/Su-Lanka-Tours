import { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

export const FadeIn = ({ children, ...props }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { triggerOnce: true, threshold: 0.1 });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, x: 0, y: 0 });
    }
  }, [inView, controls]);

  return (
    <motion.div ref={ref} initial={{ opacity: 0 }} animate={controls} {...props}>
      {children}
    </motion.div>
  );
};
