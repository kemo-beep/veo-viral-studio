import React from 'react';
import { KeyIcon } from '../Icons';

interface AuthGateProps {
    onConnect: () => void;
}

export const AuthGate = ({ onConnect }: AuthGateProps) => (
    <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full animate-fade-in-up">
            <div className="glass-panel rounded-2xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/50 to-orange-500/50" />
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <KeyIcon className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Connect Your API Key</h3>
                <p className="text-studio-500 text-sm mb-6 leading-relaxed">
                    To start creating videos with Veo 3, connect your Google Cloud API key.
                </p>
                <button
                    onClick={onConnect}
                    className="w-full py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-studio-100 transition-all shadow-glow"
                >
                    Connect API Key
                </button>
                <a
                    href="https://ai.google.dev/gemini-api/docs/billing"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-4 text-xs text-studio-500 hover:text-white transition-colors"
                >
                    Learn about API billing →
                </a>
            </div>
        </div>
    </div>
);

