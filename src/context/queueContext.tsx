import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ITrack } from '@/types';

interface QueueContextType {
  queue: ITrack[];
  isQueueOpen: boolean;
  addToQueue: (track: ITrack) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  playNext: (track: ITrack) => void;
  toggleQueue: () => void;
  openQueue: () => void;
  closeQueue: () => void;
  getNextTrack: () => ITrack | null;
  removeNextTrack: () => ITrack | null;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

interface QueueProviderProps {
  children: ReactNode;
}

export const QueueProvider: React.FC<QueueProviderProps> = ({ children }) => {
  const [queue, setQueue] = useState<ITrack[]>([]);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  const addToQueue = useCallback((track: ITrack) => {
    setQueue((prevQueue) => {
      // Check if track already exists in queue
      const exists = prevQueue.some(t => t.id === track.id);
      if (exists) {
        console.log('Track already in queue:', track.name);
        return prevQueue;
      }
      console.log('Adding to queue:', track.name);
      return [...prevQueue, track];
    });
  }, []);

  const removeFromQueue = useCallback((trackId: string) => {
    setQueue((prevQueue) => prevQueue.filter(track => track.id !== trackId));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const reorderQueue = useCallback((startIndex: number, endIndex: number) => {
    setQueue((prevQueue) => {
      const result = Array.from(prevQueue);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  }, []);

  const playNext = useCallback((track: ITrack) => {
    setQueue((prevQueue) => {
      // Remove track if it already exists
      const filtered = prevQueue.filter(t => t.id !== track.id);
      // Add at the beginning
      return [track, ...filtered];
    });
  }, []);

  const toggleQueue = useCallback(() => {
    setIsQueueOpen((prev) => !prev);
  }, []);

  const openQueue = useCallback(() => {
    setIsQueueOpen(true);
  }, []);

  const closeQueue = useCallback(() => {
    setIsQueueOpen(false);
  }, []);

  const getNextTrack = useCallback((): ITrack | null => {
    return queue.length > 0 ? queue[0] : null;
  }, [queue]);

  const removeNextTrack = useCallback((): ITrack | null => {
    if (queue.length === 0) return null;
    
    const nextTrack = queue[0];
    setQueue((prevQueue) => prevQueue.slice(1));
    return nextTrack;
  }, [queue]);

  const value: QueueContextType = {
    queue,
    isQueueOpen,
    addToQueue,
    removeFromQueue,
    clearQueue,
    reorderQueue,
    playNext,
    toggleQueue,
    openQueue,
    closeQueue,
    getNextTrack,
    removeNextTrack,
  };

  return (
    <QueueContext.Provider value={value}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within QueueProvider');
  }
  return context;
};
