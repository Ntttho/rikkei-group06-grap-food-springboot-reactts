import React from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  hideCloseButton?: boolean;
  children?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = (props) => {
  if (!props.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
        {props.title && <h2 className="text-xl font-bold mb-4 text-slate-800">{props.title}</h2>}
        <div>{props.children}</div>
        {!props.hideCloseButton && (
          <button
            onClick={props.onClose}
            className="mt-4 rounded bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};
