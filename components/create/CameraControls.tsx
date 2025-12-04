import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
    Camera01Icon,
    ViewIcon,
    ThreeDViewIcon,
    Angle01Icon,
    ArrowUp01Icon,
    ArrowDown01Icon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
    ZoomInAreaIcon,
    CameraVideoIcon,
    Maximize01Icon,
    Minimize01Icon,
    CraneIcon,
} from '@hugeicons/core-free-icons';
import { ChevronDownIcon, XIcon } from '../Icons';

interface CameraControlsProps {
    cameraAngle: string | null;
    setCameraAngle: (angle: string | null) => void;
    cameraMode: string | null;
    setCameraMode: (mode: string | null) => void;
    cameraAngleOpen: boolean;
    setCameraAngleOpen: (open: boolean) => void;
    cameraModeOpen: boolean;
    setCameraModeOpen: (open: boolean) => void;
}

export const CameraControls = ({
    cameraAngle,
    setCameraAngle,
    cameraMode,
    setCameraMode,
    cameraAngleOpen,
    setCameraAngleOpen,
    cameraModeOpen,
    setCameraModeOpen,
}: CameraControlsProps) => {
    return (
        <div className="glass-panel rounded-xl md:rounded-2xl p-4 md:p-5">
            <div className="flex gap-4 md:flex-col md:gap-5">
                {/* Camera Angle */}
                <div className="flex-1 min-w-[140px]">
                    <button
                        onClick={() => setCameraAngleOpen(!cameraAngleOpen)}
                        className="w-full flex items-center justify-between mb-2 md:mb-3 group"
                    >
                        <label className="text-[10px] md:text-xs text-studio-500 uppercase tracking-wider font-medium cursor-pointer group-hover:text-studio-400 transition-colors">
                            Camera Angle
                        </label>
                        <ChevronDownIcon className={`w-3.5 h-3.5 text-studio-500 transition-transform duration-200 ${cameraAngleOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {cameraAngleOpen && (
                        <div className="grid grid-cols-2 gap-1.5 bg-studio-900 p-1 rounded-lg border border-white/5">
                            <button
                                onClick={() => setCameraAngle(null)}
                                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${!cameraAngle
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-studio-500 hover:text-white hover:bg-white/5'
                                    }`}
                                title="None"
                            >
                                <XIcon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">None</span>
                            </button>
                            <button
                                onClick={() => setCameraAngle('wide')}
                                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraAngle === 'wide'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-studio-500 hover:text-white hover:bg-white/5'
                                    }`}
                                title="Wide Shot"
                            >
                                <HugeiconsIcon icon={Maximize01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                                <span className="hidden sm:inline">Wide</span>
                            </button>
                            <button
                                onClick={() => setCameraAngle('medium')}
                                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraAngle === 'medium'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-studio-500 hover:text-white hover:bg-white/5'
                                    }`}
                                title="Medium Shot"
                            >
                                <HugeiconsIcon icon={ViewIcon} size={14} color="currentColor" strokeWidth={1.5} />
                                <span className="hidden sm:inline">Medium</span>
                            </button>
                            <button
                                onClick={() => setCameraAngle('close-up')}
                                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraAngle === 'close-up'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-studio-500 hover:text-white hover:bg-white/5'
                                    }`}
                                title="Close-Up"
                            >
                                <HugeiconsIcon icon={ZoomInAreaIcon} size={14} color="currentColor" strokeWidth={1.5} />
                                <span className="hidden sm:inline">Close</span>
                            </button>
                            <button
                                onClick={() => setCameraAngle('extreme-close')}
                                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraAngle === 'extreme-close'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-studio-500 hover:text-white hover:bg-white/5'
                                    }`}
                                title="Extreme Close-Up"
                            >
                                <HugeiconsIcon icon={Camera01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                                <span className="hidden sm:inline">Extreme</span>
                            </button>
                            <button
                                onClick={() => setCameraAngle('bird-eye')}
                                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraAngle === 'bird-eye'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-studio-500 hover:text-white hover:bg-white/5'
                                    }`}
                                title="Bird's Eye View"
                            >
                                <HugeiconsIcon icon={ThreeDViewIcon} size={14} color="currentColor" strokeWidth={1.5} />
                                <span className="hidden sm:inline">Bird's Eye</span>
                            </button>
                            <button
                                onClick={() => setCameraAngle('low-angle')}
                                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraAngle === 'low-angle'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-studio-500 hover:text-white hover:bg-white/5'
                                    }`}
                                title="Low Angle"
                            >
                                <HugeiconsIcon icon={ArrowUp01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                                <span className="hidden sm:inline">Low</span>
                            </button>
                            <button
                                onClick={() => setCameraAngle('high-angle')}
                                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraAngle === 'high-angle'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-studio-500 hover:text-white hover:bg-white/5'
                                    }`}
                                title="High Angle"
                            >
                                <HugeiconsIcon icon={ArrowDown01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                                <span className="hidden sm:inline">High</span>
                            </button>
                            <button
                                onClick={() => setCameraAngle('dutch')}
                                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraAngle === 'dutch'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-studio-500 hover:text-white hover:bg-white/5'
                                    }`}
                                title="Dutch Angle"
                            >
                                <HugeiconsIcon icon={Angle01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                                <span className="hidden sm:inline">Dutch</span>
                            </button>
                            <button
                                onClick={() => setCameraAngle('point-of-view')}
                                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraAngle === 'point-of-view'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-studio-500 hover:text-white hover:bg-white/5'
                                    }`}
                                title="Point of View"
                            >
                                <HugeiconsIcon icon={CameraVideoIcon} size={14} color="currentColor" strokeWidth={1.5} />
                                <span className="hidden sm:inline">POV</span>
                            </button>
                        </div>
                    )}
                    {cameraAngleOpen && (
                        <p className="text-[10px] text-studio-600 mt-1.5 md:mt-2 hidden md:block">
                            Optional camera angle preset
                        </p>
                    )}
                </div>

                <div className="w-px md:w-full h-auto md:h-px bg-white/5" />

                {/* Camera Mode */}
                <div className="flex-1 min-w-[140px]">
                    <button
                        onClick={() => setCameraModeOpen(!cameraModeOpen)}
                        className="w-full flex items-center justify-between mb-2 md:mb-3 group"
                    >
                        <label className="text-[10px] md:text-xs text-studio-500 uppercase tracking-wider font-medium cursor-pointer group-hover:text-studio-400 transition-colors">
                            Camera Mode
                        </label>
                        <ChevronDownIcon className={`w-3.5 h-3.5 text-studio-500 transition-transform duration-200 ${cameraModeOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {cameraModeOpen && (
                        <div className="grid grid-cols-2 gap-1.5 bg-studio-900 p-1 rounded-lg border border-white/5">
                            <button
                                onClick={() => setCameraMode(null)}
                                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${!cameraMode
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-studio-500 hover:text-white hover:bg-white/5'
                                    }`}
                                title="None"
                            >
                                <XIcon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">None</span>
                            </button>
                            <button
                                onClick={() => setCameraMode('handheld')}
                                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraMode === 'handheld'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-studio-500 hover:text-white hover:bg-white/5'
                                    }`}
                                title="Handheld"
                            >
                                <HugeiconsIcon icon={Camera01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                                <span className="hidden sm:inline">Handheld</span>
                            </button>
                            <button
                                onClick={() => setCameraMode('steady')}
                                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraMode === 'steady'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-studio-500 hover:text-white hover:bg-white/5'
                                    }`}
                                title="Steady"
                            >
                                <HugeiconsIcon icon={Minimize01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                                <span className="hidden sm:inline">Steady</span>
                            </button>
                            <button
                                onClick={() => setCameraMode('tracking')}
                                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraMode === 'tracking'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-studio-500 hover:text-white hover:bg-white/5'
                                    }`}
                                title="Tracking Shot"
                            >
                                <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                                <span className="hidden sm:inline">Tracking</span>
                            </button>
                            <button
                                onClick={() => setCameraMode('dolly')}
                                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraMode === 'dolly'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-studio-500 hover:text-white hover:bg-white/5'
                                    }`}
                                title="Dolly Shot"
                            >
                                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                                <span className="hidden sm:inline">Dolly</span>
                            </button>
                            <button
                                onClick={() => setCameraMode('pan')}
                                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraMode === 'pan'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-studio-500 hover:text-white hover:bg-white/5'
                                    }`}
                                title="Pan"
                            >
                                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                                <span className="hidden sm:inline">Pan</span>
                            </button>
                            <button
                                onClick={() => setCameraMode('tilt')}
                                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraMode === 'tilt'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-studio-500 hover:text-white hover:bg-white/5'
                                    }`}
                                title="Tilt"
                            >
                                <HugeiconsIcon icon={ArrowUp01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                                <span className="hidden sm:inline">Tilt</span>
                            </button>
                            <button
                                onClick={() => setCameraMode('zoom')}
                                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraMode === 'zoom'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-studio-500 hover:text-white hover:bg-white/5'
                                    }`}
                                title="Zoom"
                            >
                                <HugeiconsIcon icon={ZoomInAreaIcon} size={14} color="currentColor" strokeWidth={1.5} />
                                <span className="hidden sm:inline">Zoom</span>
                            </button>
                            <button
                                onClick={() => setCameraMode('static')}
                                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraMode === 'static'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-studio-500 hover:text-white hover:bg-white/5'
                                    }`}
                                title="Static"
                            >
                                <HugeiconsIcon icon={Minimize01Icon} size={14} color="currentColor" strokeWidth={1.5} />
                                <span className="hidden sm:inline">Static</span>
                            </button>
                            <button
                                onClick={() => setCameraMode('crane')}
                                className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-md text-xs font-medium transition-all active:scale-95 ${cameraMode === 'crane'
                                    ? 'bg-accent text-white shadow-lg'
                                    : 'text-studio-500 hover:text-white hover:bg-white/5'
                                    }`}
                                title="Crane Shot"
                            >
                                <HugeiconsIcon icon={CraneIcon} size={14} color="currentColor" strokeWidth={1.5} />
                                <span className="hidden sm:inline">Crane</span>
                            </button>
                        </div>
                    )}
                    {cameraModeOpen && (
                        <p className="text-[10px] text-studio-600 mt-1.5 md:mt-2 hidden md:block">
                            Optional camera movement preset
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

