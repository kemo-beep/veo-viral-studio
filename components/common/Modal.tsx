import React from 'react';
import { XIcon } from '../Icons';

interface ModalProps {
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal = ({ onClose, title, children }: ModalProps) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-md bg-studio-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-semibold">{title}</h3>
                <button onClick={onClose} className="text-studio-500 hover:text-white transition-colors">
                    <XIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="p-6">{children}</div>
        </div>
    </div>
);

