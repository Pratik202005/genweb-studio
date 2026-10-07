import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Loader2, 
  Clock, 
  Sparkles,
  Layout,
  Palette,
  Code,
  Image as ImageIcon
} from 'lucide-react';
import Logo from './Logo';

export const GENERATION_STAGES = [
  {
    id: 1,
    title: "Analyzing Prompt & Architecture",
    description: "Structuring wireframe and semantic layout hierarchy",
    icon: Layout,
  },
  {
    id: 2,
    title: "Designing Theme & Layout",
    description: "Crafting color palette, typography and responsive layout",
    icon: Palette,
  },
  {
    id: 3,
    title: "Generating Clean Code",
    description: "Writing semantic markup, CSS rules and interactive logic",
    icon: Code,
  },
  {
    id: 4,
    title: "Resolving Visual Assets",
    description: "Fetching contextual high-resolution images via Pollinations CDN",
    icon: ImageIcon,
  },
  {
    id: 5,
    title: "Mounting Live Preview",
    description: "Compiling layout structure and rendering live preview",
    icon: Sparkles,
  },
];

export function useGenerationTracker(loading) {
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    if (!loading) {
      setElapsedSec(0);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      setElapsedSec(seconds);
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, [loading]);

  let activeStageIndex = 0;
  if (elapsedSec < 3) activeStageIndex = 0;
  else if (elapsedSec < 7) activeStageIndex = 1;
  else if (elapsedSec < 12) activeStageIndex = 2;
  else if (elapsedSec < 17) activeStageIndex = 3;
  else activeStageIndex = 4;

  let progressPercent = 10;
  if (elapsedSec <= 3) {
    progressPercent = 10 + (elapsedSec / 3) * 20;
  } else if (elapsedSec <= 7) {
    progressPercent = 30 + ((elapsedSec - 3) / 4) * 25;
  } else if (elapsedSec <= 12) {
    progressPercent = 55 + ((elapsedSec - 7) / 5) * 25;
  } else if (elapsedSec <= 17) {
    progressPercent = 80 + ((elapsedSec - 12) / 5) * 14;
  } else {
    progressPercent = Math.min(99, 94 + (elapsedSec - 17) * 0.25);
  }

  const formattedTime = `0:${elapsedSec < 10 ? '0' : ''}${elapsedSec}s`;

  return {
    elapsedSec,
    formattedTime,
    activeStageIndex,
    currentStage: GENERATION_STAGES[activeStageIndex],
    progressPercent: Math.round(progressPercent),
  };
}

/**
 * Clean native Chat Card (blends seamlessly into GenWeb Studio Response History)
 */
export function GenerationChatCard({ tracker }) {
  if (!tracker) return null;
  const { 
    formattedTime = "0:01s", 
    activeStageIndex = 0, 
    currentStage = GENERATION_STAGES[0], 
    progressPercent = 10 
  } = tracker;
  const stage = currentStage || GENERATION_STAGES[0];

  return (
    <div className="my-3 p-3.5 rounded-lg bg-gray-800/95 border border-indigo-500/30 shadow-lg max-w-[92%] md:max-w-[85%] text-white animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-700/60">
        <div className="flex items-center gap-2">
          <Logo className="w-4 h-4 animate-pulse shrink-0 drop-shadow-[0_0_6px_rgba(99,102,241,0.5)]" />
          <span className="text-xs font-semibold text-indigo-400">GenWeb AI</span>
          <span className="text-xs text-gray-400">· Generating website...</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-mono text-gray-400">
          <Clock className="w-3 h-3 text-indigo-400" />
          <span>{formattedTime}</span>
        </div>
      </div>

      {/* Active Stage info */}
      <div className="mt-2.5">
        <div className="flex justify-between items-center text-xs">
          <span className="font-medium text-gray-200">
            {stage.title}
          </span>
          <span className="font-mono text-indigo-400 font-medium">
            {progressPercent}%
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-0.5">
          {stage.description}
        </p>

        {/* Clean progress bar matching studio buttons */}
        <div className="w-full h-1.5 bg-gray-700 rounded-full mt-2 overflow-hidden">
          <div 
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Clean stage list matching studio UI */}
      <div className="mt-3 pt-2.5 border-t border-gray-700/50 space-y-1">
        {GENERATION_STAGES.map((s, idx) => {
          const isDone = idx < activeStageIndex;
          const isCurrent = idx === activeStageIndex;
          return (
            <div 
              key={s.id}
              className={`flex items-center gap-2 text-[11px] py-0.5 transition-colors ${
                isCurrent 
                  ? 'text-indigo-300 font-medium' 
                  : isDone 
                    ? 'text-gray-400' 
                    : 'text-gray-600'
              }`}
            >
              {isDone ? (
                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-3 h-3 text-indigo-400 animate-spin shrink-0" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mx-0.5 shrink-0" />
              )}
              <span className="truncate">{s.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Clean native Preview Overlay (matches GenWeb Studio canvas style)
 */
export function GenerationPreviewOverlay({ tracker }) {
  if (!tracker) return null;
  const { 
    formattedTime = "0:01s", 
    activeStageIndex = 0, 
    currentStage = GENERATION_STAGES[0], 
    progressPercent = 10 
  } = tracker;
  const stage = currentStage || GENERATION_STAGES[0];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-900/85 backdrop-blur-sm p-4 text-white">
      <div className="w-full max-w-sm p-5 rounded-xl bg-gray-800 border border-indigo-500/30 shadow-2xl text-center">
        <div className="flex justify-center mb-3">
          <div className="relative w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center p-2.5 shadow-xl shadow-indigo-500/10">
            <Logo className="w-9 h-9 animate-pulse drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
            <div className="absolute inset-0 rounded-2xl border border-indigo-400/30 animate-ping opacity-20 pointer-events-none" />
          </div>
        </div>

        <h3 className="text-sm font-semibold text-white">
          Building Website
        </h3>
        <p className="text-xs text-gray-300 mt-1">
          {stage.title}
        </p>

        {/* Clean progress bar */}
        <div className="w-full h-1.5 bg-gray-700 rounded-full mt-3.5 overflow-hidden">
          <div 
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] text-gray-400 mt-2 font-mono">
          <span>Step {activeStageIndex + 1} of 5</span>
          <span>{formattedTime}</span>
        </div>
      </div>
    </div>
  );
}
