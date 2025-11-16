import React from 'react';
import { FiList } from 'react-icons/fi';
import { cn } from '@/utils';
import { useQueue } from '@/context/queueContext';
import { useAudioPlayerContext } from '@/context/audioPlayerContext';

/**
 * Floating Queue Button - Always visible when queue has items
 * Shows on the right side when MiniPlayer is not visible
 */
export const FloatingQueueButton: React.FC = () => {
  const { queue, toggleQueue } = useQueue();
  const { currentTrack } = useAudioPlayerContext();

  // Hide if there's no queue items
  if (queue.length === 0) return null;

  // Hide if player is visible (player has its own queue button)
  if (currentTrack) return null;

  return (
    <button
      onClick={toggleQueue}
      className={cn(
        "fixed bottom-6 right-6 z-40",
        "w-14 h-14 rounded-full",
        "bg-gradient-to-br from-baby-blue to-lavender dark:from-lavender dark:to-soft-neon",
        "shadow-cyber-glow hover:shadow-float-hover",
        "flex items-center justify-center",
        "transition-all duration-300 hover:scale-110",
        "border-2 border-white/50 dark:border-charcoal/50",
        "group relative"
      )}
      aria-label="Open queue"
    >
      <FiList className="w-6 h-6 text-white" />
      
      {/* Queue count badge */}
      <span className="absolute -top-1 -right-1 bg-spotify-green text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-spotify-glow">
        {queue.length > 9 ? '9+' : queue.length}
      </span>

      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-baby-blue to-lavender opacity-75 animate-ping"></span>
      
      {/* Glow effect */}
      <span className="absolute -inset-1 bg-gradient-to-r from-baby-blue via-lavender to-soft-neon rounded-full opacity-40 blur-lg group-hover:opacity-60 transition-opacity duration-300 -z-10"></span>
    </button>
  );
};
