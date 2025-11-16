import React, { useState, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  FiX, 
  FiMusic, 
  FiTrash2, 
  FiMoreVertical,
  FiPlay
} from 'react-icons/fi';
import { MdDragIndicator } from 'react-icons/md';
import { Button } from './button';
import { ITrack } from '@/types';
import { getImageUrl, cn } from '@/utils';
import { useQueue } from '@/context/queueContext';
import { useAudioPlayerContext } from '@/context/audioPlayerContext';

interface QueuePanelProps {
  className?: string;
}

export const QueuePanel: React.FC<QueuePanelProps> = ({ className }) => {
  const { queue, isQueueOpen, removeFromQueue, clearQueue, reorderQueue, closeQueue } = useQueue();
  const { currentTrack, playTrack } = useAudioPlayerContext();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const formatDuration = (ms: number) => {
    if (!ms) return '';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      reorderQueue(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handlePlayTrack = (track: ITrack) => {
    playTrack(track);
    removeFromQueue(track.id);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isQueueOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={closeQueue}
          />
        )}
      </AnimatePresence>

      {/* Queue Panel */}
      <AnimatePresence>
        {isQueueOpen && (
          <m.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={cn(
              'fixed top-0 right-0 h-full w-full sm:w-96 z-50',
              'bg-gradient-to-br from-off-white/95 to-baby-blue/20 dark:from-charcoal/95 dark:to-lavender/20',
              'backdrop-blur-xl border-l-2 border-baby-blue/30 dark:border-lavender/30',
              'shadow-2xl overflow-hidden flex flex-col',
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-baby-blue/20 dark:border-lavender/20 bg-gradient-to-r from-baby-blue/10 to-lavender/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-baby-blue to-lavender flex items-center justify-center shadow-cyber-glow">
                  <FiMusic className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-cyber text-charcoal dark:text-off-white">
                    Queue
                  </h2>
                  <p className="text-xs text-charcoal/60 dark:text-off-white/60 font-cyber">
                    {queue.length} {queue.length === 1 ? 'track' : 'tracks'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {queue.length > 0 && (
                  <Button
                    onClick={clearQueue}
                    variant="ghost"
                    size="sm"
                    className="text-charcoal/70 dark:text-off-white/70 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
                <Button
                  onClick={closeQueue}
                  variant="ghost"
                  size="icon"
                  className="text-charcoal/70 dark:text-off-white/70 hover:text-charcoal dark:hover:text-off-white transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Currently Playing Section */}
            {currentTrack && (
              <div className="p-6 border-b border-baby-blue/20 dark:border-lavender/20 bg-gradient-to-br from-baby-blue/5 to-lavender/5">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={getImageUrl(currentTrack.poster_path)}
                      alt={currentTrack.title || currentTrack.name}
                      className="w-16 h-16 rounded-xl object-cover shadow-float"
                    />
                    <div className="absolute -top-1 -right-1 bg-spotify-green rounded-full p-1.5 shadow-spotify-glow">
                      <div className="flex space-x-0.5">
                        <div className="w-0.5 h-2 bg-white rounded-full animate-pulse"></div>
                        <div className="w-0.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-0.5 h-2.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-spotify-green font-semibold mb-1 font-cyber">NOW PLAYING</p>
                    <h3 className="font-bold text-charcoal dark:text-off-white truncate font-cyber">
                      {currentTrack.title || currentTrack.name}
                    </h3>
                    <p className="text-sm text-charcoal/70 dark:text-off-white/70 truncate font-cyber">
                      {currentTrack.artist}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Queue List */}
            <div className="flex-1 overflow-y-auto">
              {queue.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-baby-blue/20 to-lavender/20 flex items-center justify-center mb-4">
                    <FiMusic className="w-10 h-10 text-baby-blue dark:text-lavender opacity-50" />
                  </div>
                  <h3 className="text-lg font-bold text-charcoal dark:text-off-white mb-2 font-cyber">
                    Your queue is empty
                  </h3>
                  <p className="text-sm text-charcoal/60 dark:text-off-white/60 font-cyber">
                    Add tracks to your queue to play them next
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {queue.map((track, index) => (
                    <m.div
                      key={track.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={() => handleDrop(index)}
                      onDragEnd={handleDragEnd}
                      className={cn(
                        'group flex items-center space-x-3 p-3 rounded-2xl cursor-move transition-all duration-200',
                        'bg-white/50 dark:bg-charcoal/50 backdrop-blur-sm',
                        'border-2 border-transparent hover:border-baby-blue/30 dark:hover:border-lavender/30',
                        'hover:shadow-float',
                        draggedIndex === index && 'opacity-50 scale-95',
                        dragOverIndex === index && 'border-baby-blue dark:border-lavender'
                      )}
                    >
                      {/* Drag Handle */}
                      <div className="text-charcoal/40 dark:text-off-white/40 group-hover:text-charcoal/70 dark:group-hover:text-off-white/70 transition-colors cursor-grab active:cursor-grabbing">
                        <MdDragIndicator className="w-5 h-5" />
                      </div>

                      {/* Track Number */}
                      <div className="w-6 text-center">
                        <span className="text-sm font-semibold text-charcoal/50 dark:text-off-white/50 font-cyber">
                          {index + 1}
                        </span>
                      </div>

                      {/* Album Art */}
                      <div className="relative">
                        <img
                          src={getImageUrl(track.poster_path)}
                          alt={track.title || track.name}
                          className="w-12 h-12 rounded-lg object-cover shadow-sm"
                        />
                        {/* Play button overlay on hover */}
                        <button
                          onClick={() => handlePlayTrack(track)}
                          className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <FiPlay className="w-5 h-5 text-white ml-0.5" />
                        </button>
                      </div>

                      {/* Track Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-charcoal dark:text-off-white truncate text-sm font-cyber">
                          {track.title || track.name}
                        </h4>
                        <p className="text-xs text-charcoal/70 dark:text-off-white/70 truncate font-cyber">
                          {track.artist}
                        </p>
                      </div>

                      {/* Duration & Actions */}
                      <div className="flex items-center space-x-2">
                        {track.duration && (
                          <span className="text-xs text-charcoal/60 dark:text-off-white/60 font-cyber">
                            {formatDuration(track.duration)}
                          </span>
                        )}
                        <Button
                          onClick={() => removeFromQueue(track.id)}
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 text-charcoal/60 dark:text-off-white/60 hover:text-red-500 dark:hover:text-red-400"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </m.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Info */}
            {queue.length > 0 && (
              <div className="p-4 border-t border-baby-blue/20 dark:border-lavender/20 bg-gradient-to-r from-baby-blue/5 to-lavender/5">
                <div className="flex items-center justify-between text-xs text-charcoal/60 dark:text-off-white/60 font-cyber">
                  <span>Total Duration</span>
                  <span className="font-semibold">
                    {formatDuration(queue.reduce((acc, track) => acc + (track.duration || 0), 0))}
                  </span>
                </div>
              </div>
            )}
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
};
