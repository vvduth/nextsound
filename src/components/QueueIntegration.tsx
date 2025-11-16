import { useEffect } from 'react';
import { useQueue } from '@/context/queueContext';
import { useAudioPlayerContext } from '@/context/audioPlayerContext';

/**
 * Component that connects the queue system with the audio player
 * Handles auto-playing next track when current track ends
 */
export const QueueIntegration: React.FC = () => {
  const { getNextTrack, removeNextTrack } = useQueue();
  const { setOnTrackEndCallback, playTrack, repeatMode } = useAudioPlayerContext();

  useEffect(() => {
    // Set up callback for when track ends
    setOnTrackEndCallback(() => {
      console.log('Track ended, repeat mode:', repeatMode);
      
      // If repeat mode is 'one', the audio player will handle it
      if (repeatMode === 'one') {
        return;
      }

      // Try to play next track from queue
      const nextTrack = getNextTrack();
      if (nextTrack) {
        console.log('Playing next track from queue:', nextTrack.name);
        removeNextTrack();
        playTrack(nextTrack);
      } else {
        console.log('No more tracks in queue');
      }
    });
  }, [setOnTrackEndCallback, getNextTrack, removeNextTrack, playTrack, repeatMode]);

  return null; // This component doesn't render anything
};
