import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface NudgeToastProps {
  id: string;
  message: string;
  isVisible: boolean;
  onDismiss: (id: string) => void;
  autoDismissMs?: number;
}

export function NudgeToast({ id, message, isVisible, onDismiss, autoDismissMs = 8000 }: NudgeToastProps) {
  useEffect(() => {
    if (isVisible && autoDismissMs) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoDismissMs, id, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-elevated border-l-[3px] border-l-accent-green border-y border-r border-border rounded-r-md p-4 w-full flex items-start gap-3 relative"
        >
          <div className="flex-1 text-sm text-primary line-clamp-2 leading-relaxed">
            {message}
          </div>
          <button 
            onClick={() => onDismiss(id)}
            className="text-muted hover:text-primary transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
