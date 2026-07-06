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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-[600px] rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-[#e8eaed] max-h-[90vh] flex flex-col">
        <div className="px-5 h-[56px] flex items-center gap-3 border-b border-[#e8eaed]">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[#f0f1f5] hover:bg-[#e8eaed] transition-all active:scale-95"
          >
            <CloseIcon className="w-[14px] h-[14px] text-[#0a0a0a]" />
          </button>
          <h2 className="text-[16px] md:text-[18px] font-black text-[#0a0a0a] tracking-tight">{title}</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
