
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NO_MESSAGES } from '../constants';
import { Heart } from 'lucide-react';

interface ProposalSectionProps {
  onAccept: () => void;
}

const ProposalSection: React.FC<ProposalSectionProps> = ({ onAccept }) => {
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [showBubble, setShowBubble] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const lastMoveTime = useRef<number>(0);

  // Initial layout fix: start No button slightly offset
  useEffect(() => {
    setNoPosition({ x: window.innerWidth < 768 ? 60 : 100, y: 0 });
  }, []);

  const moveNoButton = useCallback(() => {
    const now = Date.now();
    if (now - lastMoveTime.current < 150) return;
    lastMoveTime.current = now;

    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    
    // Responsive button dimensions
    const isMobile = window.innerWidth < 768;
    const btnWidth = isMobile ? 80 : 100;
    const btnHeight = isMobile ? 40 : 50;
    const bubbleHeight = isMobile ? 70 : 90; 
    const margin = 20;

    // Boundaries relative to center
    const minX = -containerRect.width / 2 + btnWidth / 2 + margin;
    const maxX = containerRect.width / 2 - btnWidth / 2 - margin;
    const minY = -containerRect.height / 2 + btnHeight / 2 + bubbleHeight; 
    const maxY = containerRect.height / 2 - btnHeight / 2 - margin;

    let newX, newY;
    // On mobile, keep it closer but still erratic
    const useFarMove = isMobile ? Math.random() > 0.5 : Math.random() > 0.3;

    if (useFarMove) {
      newX = noPosition.x > 0 ? Math.random() * (0 - minX) + minX : Math.random() * (maxX - 0) + 0;
      newY = noPosition.y > 0 ? Math.random() * (0 - minY) + minY : Math.random() * (maxY - 0) + 0;
    } else {
      newX = Math.random() * (maxX - minX) + minX;
      newY = Math.random() * (maxY - minY) + minY;
    }

    setNoPosition({ x: newX, y: newY });
    setNoCount((prev) => (prev + 1));
    setShowBubble(true);
  }, [noPosition]);

  useEffect(() => {
    const handleInteraction = (clientX: number, clientY: number) => {
      if (!noButtonRef.current) return;

      const btnRect = noButtonRef.current.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;

      const distance = Math.sqrt(
        Math.pow(clientX - btnCenterX, 2) + Math.pow(clientY - btnCenterY, 2)
      );

      const triggerDistance = window.innerWidth < 768 ? 60 : 85;

      if (distance < triggerDistance) {
        moveNoButton();
      }
    };

    const onMouseMove = (e: MouseEvent) => handleInteraction(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [moveNoButton]);

  const currentThought = NO_MESSAGES[noCount % NO_MESSAGES.length];

  return (
    <div 
      ref={containerRef}
      className="bg-white/95 backdrop-blur-md p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl border-4 border-rose-200 text-center relative w-full min-h-[500px] md:min-h-[600px] flex flex-col justify-center items-center overflow-hidden select-none"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          y: [0, -10, 0]
        }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="mb-4 md:mb-8 text-rose-500 drop-shadow-xl"
      >
        <Heart size={window.innerWidth < 768 ? 48 : 64} fill="currentColor" />
      </motion.div>

      <h1 className="text-3xl md:text-5xl font-bold text-rose-600 mb-4 md:mb-6 font-handwriting leading-tight drop-shadow-sm px-2">
        Will you be my Valentine?
      </h1>
      
      <p className="text-rose-400 mb-8 md:mb-12 text-sm md:text-lg italic font-medium opacity-90 px-4">
        You know what to do... ❤️
      </p>

      <div className="flex items-center justify-center w-full relative h-32 md:h-48">
        {/* YES Button */}
        <motion.button
          whileHover={{ scale: 1.05, rotate: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAccept}
          animate={{
            scale: 1 + (Math.min(noCount, 15) * 0.025),
            boxShadow: [
              `0 0 10px rgba(244, 63, 94, 0.2)`,
              `0 0 25px rgba(244, 63, 94, 0.4)`,
              `0 0 10px rgba(244, 63, 94, 0.2)`
            ]
          }}
          transition={{
            boxShadow: { repeat: Infinity, duration: 2 },
            scale: { type: 'spring', stiffness: 300, damping: 20 }
          }}
          className="bg-rose-500 hover:bg-rose-600 text-white px-8 md:px-12 py-3 md:py-5 rounded-full text-xl md:text-3xl font-black shadow-lg shadow-rose-200 transition-colors z-20 cursor-pointer"
          style={{ x: window.innerWidth < 768 ? -40 : -70 }} 
        >
          YES!
        </motion.button>

        {/* NO Button Container */}
        <motion.div
          animate={{ x: noPosition.x, y: noPosition.y }}
          transition={{ 
            type: 'spring', 
            stiffness: 220, 
            damping: 24,
            mass: 1
          }}
          className="absolute z-10 flex flex-col items-center"
        >
          <AnimatePresence mode="wait">
            {showBubble && (
              <motion.div
                key={noCount}
                initial={{ opacity: 0, scale: 0.8, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: window.innerWidth < 768 ? -50 : -70 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute bg-white px-3 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-xl border-2 border-rose-100 flex items-center whitespace-nowrap z-30 pointer-events-none"
              >
                <span className="text-rose-600 font-extrabold text-xs md:text-lg">
                  {currentThought}
                </span>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 md:w-4 h-3 md:h-4 bg-white border-b-2 border-r-2 border-rose-100 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            ref={noButtonRef}
            onMouseEnter={moveNoButton}
            onTouchStart={(e) => { e.preventDefault(); moveNoButton(); }}
            className="bg-gray-100 text-gray-400 px-6 md:px-8 py-2 md:py-3 rounded-full text-sm md:text-lg font-bold shadow-md border border-gray-200 cursor-default"
          >
            No
          </button>
        </motion.div>
      </div>

      <div className="h-16 mt-6 md:mt-8 flex flex-col items-center justify-center">
        {noCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-rose-500 font-black text-lg md:text-xl italic tracking-tight">
              Dodges: {noCount}
            </p>
            <p className="text-rose-300 text-[9px] md:text-xs mt-1 font-semibold uppercase tracking-widest px-4">
              Resistance is cute but futile
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProposalSection;
