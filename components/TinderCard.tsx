
import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { CardItem } from '../types';
import { Heart, Mail } from 'lucide-react';

interface TinderCardProps {
  card: CardItem;
  isTop: boolean;
  onSwipe: () => void;
}

const TinderCard: React.FC<TinderCardProps> = ({ card, isTop, onSwipe }) => {
  const x = useMotionValue(0);
  
  // Create rotational effect based on horizontal drag
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  
  // Fade card slightly as it moves far off screen, but keep it mostly opaque for the "swipe" feel
  const opacity = useTransform(x, [-300, -250, 0, 250, 300], [0, 1, 1, 1, 0]);
  
  // Subtle scaling effect
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95]);

  // Transform indicators opacity based on swipe direction
  const loveOpacity = useTransform(x, [10, 80], [0, 1]);
  const meTooOpacity = useTransform(x, [-10, -80], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 100;
    // Check total displacement from center (x.get()) for more reliability
    const currentX = x.get();
    
    if (Math.abs(currentX) > threshold || Math.abs(info.velocity.x) > 500) {
      onSwipe();
    }
  };

  const hasImage = !!card.imageUrl;

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
        scale,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        cursor: isTop ? 'grab' : 'default',
        zIndex: isTop ? 50 : 0,
        touchAction: 'none' // Prevent scrolling while dragging on mobile
      }}
      drag={isTop ? 'x' : false}
      // Using dragConstraints and dragElastic allows the card to snap back if not swiped far enough
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1} 
      onDragEnd={handleDragEnd}
      whileTap={isTop ? { scale: 1.02, cursor: 'grabbing' } : {}}
      // Fly-off-screen animation when the card is removed from the list
      exit={{ 
        x: x.get() >= 0 ? 1000 : -1000, 
        opacity: 0,
        rotate: x.get() >= 0 ? 45 : -45,
        transition: { duration: 0.4, ease: "easeIn" }
      }}
      className="bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border-2 md:border-4 border-white"
    >
      <div className="h-full w-full relative">
        {hasImage ? (
          <>
            <img
              src={card.imageUrl}
              alt="Valentine"
              className="w-full h-full object-cover select-none pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rose-900/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white text-center pointer-events-none">
              <p className="text-lg md:text-xl font-bold italic font-handwriting leading-tight drop-shadow-lg">
                {card.message}
              </p>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-[#fffcf5] flex flex-col items-center justify-center p-6 md:p-8 text-center border-4 md:border-8 border-double border-rose-100">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mb-4 md:mb-6 text-rose-400"
            >
              <Heart size={window.innerWidth < 768 ? 36 : 48} fill="currentColor" className="opacity-50" />
            </motion.div>
            
            <div className="relative">
              <span className="absolute -top-3 -left-3 md:-top-4 md:-left-4 text-2xl md:text-4xl text-rose-200 opacity-50">“</span>
              <p className="text-xl md:text-3xl font-handwriting text-rose-700 leading-relaxed px-1 md:px-2">
                {card.message}
              </p>
              <span className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 text-2xl md:text-4xl text-rose-200 opacity-50">”</span>
            </div>

            <div className="mt-6 md:mt-10 flex flex-col items-center gap-1 md:gap-2">
              <div className="w-8 md:w-12 h-px bg-rose-200" />
              <div className="text-rose-400 font-bold italic text-[10px] md:text-sm font-handwriting">
                My special note for you
              </div>
              <Mail size={window.innerWidth < 768 ? 16 : 20} className="text-rose-300" />
            </div>

            {/* Decorative background icons */}
            <div className="absolute top-2 right-2 opacity-5 pointer-events-none">
              <Heart size={60} />
            </div>
            <div className="absolute bottom-2 left-2 opacity-5 pointer-events-none transform rotate-180">
              <Heart size={60} />
            </div>
          </div>
        )}
        
        {/* Swipe Indicators - Right Swipe for "Love!", Left Swipe for "Me too!" */}
        <motion.div 
          style={{ opacity: loveOpacity }}
          className="absolute top-8 left-8 border-4 border-emerald-500 text-emerald-500 rounded px-4 py-2 font-black text-2xl rotate-[-20deg] pointer-events-none uppercase z-10 bg-white/10 backdrop-blur-sm"
        >
          Love!
        </motion.div>
        
        <motion.div 
          style={{ opacity: meTooOpacity }}
          className="absolute top-8 right-8 border-4 border-rose-500 text-rose-500 rounded px-4 py-2 font-black text-2xl rotate-[20deg] pointer-events-none uppercase z-10 bg-white/10 backdrop-blur-sm"
        >
          Me too!
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TinderCard;
