
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingHearts from './components/FloatingHearts';
import ProposalSection from './components/ProposalSection';
import GallerySection from './components/GallerySection';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.PROPOSING);

  const handleAccept = useCallback(() => {
    setAppState(AppState.ACCEPTED);
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full bg-rose-50 overflow-hidden flex flex-col items-center justify-center p-4 md:p-6">
      {/* Background Layer */}
      <FloatingHearts />

      <AnimatePresence mode="wait">
        {appState === AppState.PROPOSING ? (
          <motion.div
            key="proposal"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, rotate: 10 }}
            transition={{ type: 'spring', damping: 15 }}
            className="z-10 w-full max-w-lg flex items-center justify-center"
          >
            <ProposalSection onAccept={handleAccept} />
          </motion.div>
        ) : (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="z-10 w-full max-w-lg h-full max-h-[90vh] md:max-h-none flex flex-col"
          >
            <GallerySection />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative footer elements */}
      <div className="fixed bottom-2 text-rose-300 text-[10px] md:text-xs pointer-events-none opacity-60 font-medium">
        Made with ❤️ for someone special
      </div>
    </div>
  );
};

export default App;
