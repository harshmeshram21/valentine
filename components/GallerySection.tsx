
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY_CARDS } from '../constants';
import { GoogleGenAI } from '@google/genai';
import TinderCard from './TinderCard';
import { CardItem } from '../types';
import { PartyPopper, Heart, Sparkles, RefreshCw, ChevronLeft, ChevronRight, Mail, X } from 'lucide-react';

const GallerySection: React.FC = () => {
  const AI_CARD_ID = 999999;
  
  const [cards, setCards] = useState<CardItem[]>(() => [
    ...GALLERY_CARDS,
    { id: AI_CARD_ID, imageUrl: '', message: 'Writing a special note for you...' }
  ]);
  
  const [personalizedMessage, setPersonalizedMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMessageOpen, setIsMessageOpen] = useState(false);

  useEffect(() => {
    const fetchSweetMessage = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "Write a short, extremely sweet, and poetic 2-sentence romantic message for a Valentine's Day acceptance. Use emojis.",
          config: {
            temperature: 0.9,
            topP: 0.95,
          }
        });
        const msg = response.text || "I'm the luckiest person alive! Can't wait for our adventure together. ❤️✨";
        setPersonalizedMessage(msg);
        setCards(prev => prev.map(c => c.id === AI_CARD_ID ? { ...c, message: msg } : c));
      } catch (error) {
        const fallbackMsg = "You just made my entire year! I promise to make every day feel like Valentine's. ❤️";
        setPersonalizedMessage(fallbackMsg);
        setCards(prev => prev.map(c => c.id === AI_CARD_ID ? { ...c, message: fallbackMsg } : c));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSweetMessage();
  }, []);

  const removeCard = (id: number) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  const handleRestart = () => {
    setCards([
      ...GALLERY_CARDS,
      { id: AI_CARD_ID, imageUrl: '', message: personalizedMessage || 'Writing a special note for you...' }
    ]);
  };

  const handleManualSwipe = () => {
    if (cards.length > 0) {
      const topCard = cards[cards.length - 1];
      removeCard(topCard.id);
    }
  };

  return (
    <div className="flex flex-col items-center h-full w-full py-2 relative">
      {/* Header Area */}
      <div className="text-center shrink-0 mb-4 px-4 w-full">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex justify-center space-x-2 text-rose-500 mb-1"
        >
          <PartyPopper className="w-6 h-6 md:w-7 md:h-7" />
          <Heart className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" />
          <Sparkles className="w-6 h-6 md:w-7 md:h-7" />
        </motion.div>
        
        <h2 className="text-xl md:text-3xl font-bold text-rose-600 font-handwriting">YAAAAAY! Best choice ever!</h2>
        
        <div className="mt-2 md:mt-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMessageOpen(true)}
            className="flex items-center gap-2 bg-rose-100 text-rose-600 px-3 md:px-4 py-1.5 rounded-full text-[11px] md:text-sm font-bold border border-rose-200 shadow-sm hover:bg-rose-200 transition-colors mx-auto"
          >
            <Mail size={14} />
            <span>Show Love Note Overlay</span>
          </motion.button>
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="flex flex-row items-center justify-center w-full gap-2 md:gap-8 flex-1 relative px-2">
        {/* Left Arrow - Hidden or smaller on very small mobile */}
        {cards.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleManualSwipe}
            className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-white/80 border-2 border-rose-200 shadow-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-all z-40"
            aria-label="Previous Card"
          >
            <ChevronLeft size={24} strokeWidth={3} className="md:w-10 md:h-10" />
          </motion.button>
        )}

        {/* Card Container - Sized for mobile viewport */}
        <div className="relative w-full max-w-[240px] md:max-w-[300px] aspect-[2/3] perspective-1000">
          <AnimatePresence>
            {cards.length > 0 ? (
              [...cards].map((card, index) => (
                <TinderCard
                  key={card.id}
                  card={card}
                  isTop={index === cards.length - 1}
                  onSwipe={() => removeCard(card.id)}
                />
              )).reverse() 
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-4 md:p-6 text-center border-4 border-rose-100"
              >
                <div className="text-4xl md:text-5xl mb-4">🥂</div>
                <h3 className="text-base md:text-lg font-bold text-rose-600 mb-2">The End!</h3>
                <p className="text-rose-400 mb-4 md:mb-6 text-[10px] md:text-xs text-center px-2">That was our little journey. Can't wait to start the real one with you!</p>
                <button
                  onClick={handleRestart}
                  className="flex items-center space-x-2 bg-rose-500 text-white px-4 md:px-6 py-1.5 md:py-2 rounded-full hover:bg-rose-600 transition-colors shadow-lg active:scale-95 text-xs md:text-base"
                >
                  <RefreshCw size={14} />
                  <span>Look Again?</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Arrow */}
        {cards.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleManualSwipe}
            className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-white/80 border-2 border-rose-200 shadow-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-all z-40"
            aria-label="Next Card"
          >
            <ChevronRight size={24} strokeWidth={3} className="md:w-10 md:h-10" />
          </motion.button>
        )}
      </div>

      {/* Instructions & Footer */}
      <div className="mt-4 shrink-0 flex flex-col items-center gap-1 w-full px-4">
        <div className="flex items-center gap-2">
           <Heart size={14} className="text-rose-400 animate-pulse" fill="currentColor" />
           <span className="text-rose-400 font-medium text-[10px] md:text-xs italic text-center">Swipe the top card to explore!</span>
           <Heart size={14} className="text-rose-400 animate-pulse" fill="currentColor" />
        </div>
        <div className="text-rose-300 text-[9px] md:text-xs text-center flex items-center gap-2 opacity-60">
          <span className="hidden sm:inline w-8 h-px bg-rose-200"></span>
          <span>Swipe or use side arrows</span>
          <span className="hidden sm:inline w-8 h-px bg-rose-200"></span>
        </div>
      </div>

      {/* Love Letter Overlay */}
      <AnimatePresence>
        {isMessageOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-rose-900/40 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsMessageOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-6 md:p-8 relative border-8 border-rose-50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-10 -right-10 text-rose-50 opacity-20 transform rotate-12">
                <Heart size={160} fill="currentColor" />
              </div>

              <button 
                onClick={() => setIsMessageOpen(false)}
                className="absolute top-4 right-4 p-2 text-rose-300 hover:text-rose-500 transition-colors z-20"
              >
                <X size={24} />
              </button>

              <div className="relative z-10 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Mail size={24} className="text-rose-500 md:w-8 md:h-8" />
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-rose-600 font-handwriting mb-4">A Note For You...</h3>
                
                <div className="min-h-[80px] md:min-h-[100px] flex items-center justify-center">
                  {!personalizedMessage ? (
                    <div className="animate-pulse flex flex-col items-center gap-2">
                      <div className="h-4 w-40 bg-rose-100 rounded"></div>
                      <div className="h-4 w-24 bg-rose-100 rounded"></div>
                    </div>
                  ) : (
                    <p className="text-rose-700 italic text-lg md:text-2xl font-handwriting leading-relaxed">
                      {personalizedMessage}
                    </p>
                  )}
                </div>

                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-rose-100 text-rose-400 font-bold italic text-sm md:text-base">
                  With all my love ❤️
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GallerySection;
