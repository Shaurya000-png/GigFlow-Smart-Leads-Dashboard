import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { AnimatedText } from './AnimatedText';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md transform overflow-hidden rounded-xl glass-panel p-5 text-left shadow-2xl animate-fade-in-up border-primary/10">
        <div className="flex items-center justify-between mb-4">
          <AnimatedText as="h3" animation="text-reveal" className="text-sm font-medium text-premium font-heading">
            {title}
          </AnimatedText>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-textMuted hover:text-textMain hover:bg-surfaceElevated transition-colors duration-200"
          >
            <X size={18} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
};
