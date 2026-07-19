import React from 'react';
import { X as CloseIcon } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      <div className="relative bg-[var(--bg-card)] w-full max-w-[500px] sm:max-w-[600px] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-[var(--border-soft)] max-h-[90vh] flex flex-col">
        <div className="px-4 sm:px-5 h-[48px] sm:h-[56px] flex items-center gap-2 sm:gap-3 border-b border-[var(--border-soft)]">
          <button
            onClick={onClose}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-[var(--bg-soft)] hover:bg-[var(--border-medium)] transition-all active:scale-95 touch-manipulation"
            style={{ touchAction: 'manipulation' }}
          >
            <CloseIcon className="w-[14px] h-[14px] text-[var(--text-primary)]" />
          </button>
          <h2 className="text-[15px] sm:text-[16px] md:text-[18px] font-black text-[var(--text-primary)] tracking-tight">{title}</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
