import React, { useState } from 'react';
import { Card, CardContent } from './card';
import {
  FaClock
} from 'react-icons/fa';
import { FiPlay, FiPlus } from 'react-icons/fi';
import { ITrack } from '@/types';
import { getImageUrl, cn } from '@/utils';
import { useQueue } from '@/context/queueContext';
import { useAudioPlayerContext } from '@/context/audioPlayerContext';

interface TrackCardProps {
  track: ITrack;
  category: string;
  isPlaying?: boolean;
  onPlay?: (track: ITrack) => void;
  variant?: 'compact' | 'detailed' | 'featured';
  className?: string;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  category: _category,
  isPlaying: _isPlayingProp,
  onPlay: _onPlayProp,
  variant = 'detailed',
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});
  const [showAddedToast, setShowAddedToast] = useState(false);

  const { addToQueue, openQueue } = useQueue();
  const { playTrack } = useAudioPlayerContext();

  const { poster_path, original_title: title, name, artist, album, duration } = track;
  const displayTitle = title || name || 'Unknown Track';

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎵 Add to Queue clicked!');
    console.log('Track:', track.name || track.title);
    console.log('Track object:', track);
    addToQueue(track);
    openQueue();
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 2000);
  };

  const handlePlayTrack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('▶️ Play clicked!');
    console.log('Track:', track.name || track.title);
    playTrack(track);
  };

  const formatDuration = (ms: number) => {
    if (!ms) return '';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
    });
  };

  const handleMouseEnter = () => {
    console.log('🎯 Card hovered!', track.name || track.title);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
    });
    setIsHovered(false);
  };

  const cardHeight = variant === 'compact' ? 'h-52' : variant === 'featured' ? 'h-84' : 'h-80';
  const imageHeight = variant === 'compact' ? 160 : variant === 'featured' ? 240 : 200;

  return (
    <Card 
      className={cn(
        "cyber-glow-ring group relative transition-all duration-300 ease-out overflow-hidden",
        "cursor-pointer",
        "bg-gradient-to-br from-off-white/80 to-baby-blue/10 dark:from-charcoal/80 dark:to-lavender/10",
        "backdrop-blur-xl border-2 border-baby-blue/30 dark:border-lavender/30",
        "shadow-float hover:shadow-float-hover",
        "rounded-3xl p-4",
        cardHeight,
        "w-[180px]",
        className
      )}
      style={tiltStyle}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Main Content */}
      <div className="block relative h-full">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-2xl mb-3">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-baby-blue/20 to-lavender/20 dark:from-pastel-cyan/10 dark:to-soft-neon/10 animate-pulse rounded-2xl holo-effect" 
                 style={{ height: imageHeight }} />
          )}
          
          {/* Album artwork */}
          <img
            src={getImageUrl(poster_path)}
            alt={displayTitle}
            className={cn(
              "w-full object-cover transition-all duration-500 rounded-2xl",
              "group-hover:scale-110 group-hover:rotate-1",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            style={{ height: imageHeight }}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />

          {/* Holographic overlay on hover */}
          <div className={cn(
            "absolute inset-0 holo-effect transition-opacity duration-500 rounded-2xl mix-blend-overlay",
            isHovered ? "opacity-60" : "opacity-0"
          )} />
          
          {/* Gradient overlay on hover */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-lavender/80 via-baby-blue/40 to-transparent transition-opacity duration-500 rounded-2xl",
            isHovered ? "opacity-100" : "opacity-0"
          )} />

          {/* Action buttons - Play & Add to Queue */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center space-x-3 transition-opacity duration-300 rounded-2xl z-10",
            isHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}>
            {/* Play Button */}
            <button
              onClick={handlePlayTrack}
              type="button"
              className="w-12 h-12 rounded-full bg-spotify-green hover:bg-spotify-green/90 shadow-spotify-glow flex items-center justify-center transform hover:scale-110 transition-all duration-200 z-20"
              aria-label="Play track"
            >
              <FiPlay className="w-6 h-6 text-white ml-0.5" />
            </button>

            {/* Add to Queue Button */}
            <button
              onClick={handleAddToQueue}
              type="button"
              className="w-10 h-10 rounded-full bg-white/90 dark:bg-charcoal/90 hover:bg-white dark:hover:bg-charcoal shadow-float flex items-center justify-center transform hover:scale-110 transition-all duration-200 z-20"
              aria-label="Add to queue"
            >
              <FiPlus className="w-5 h-5 text-charcoal dark:text-off-white" />
            </button>
          </div>

          {/* Added to Queue Toast */}
          {showAddedToast && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-spotify-green text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-spotify-glow animate-pulse">
              Added to Queue
            </div>
          )}
        </div>

        {/* Track information */}
        <CardContent className="p-0 space-y-2">
          {/* Track title */}
          <h3 className={cn(
            "font-bold font-cyber text-charcoal dark:text-off-white truncate transition-all duration-300",
            variant === 'compact' ? "text-sm" : "text-base",
            "group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-baby-blue group-hover:via-lavender group-hover:to-soft-neon"
          )}>
            {displayTitle}
          </h3>
          
          {/* Artist name */}
          <p className={cn(
            "text-charcoal/70 dark:text-off-white/70 truncate font-medium font-cyber",
            variant === 'compact' ? "text-xs" : "text-sm"
          )}>
            {artist || 'Unknown Artist'}
          </p>

          {/* Additional info for detailed variant */}
          {variant === 'detailed' && (
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2 flex-1 mr-2">
                {album && (
                  <span className="text-xs text-charcoal/60 dark:text-off-white/60 truncate font-cyber">
                    {album}
                  </span>
                )}
              </div>
              {duration && (
                <div className="flex items-center text-xs text-charcoal/60 dark:text-off-white/60 shrink-0 font-cyber">
                  <FaClock className="w-3 h-3 mr-1 opacity-60" />
                  {formatDuration(duration)}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </div>

      {/* Cyber glow effect */}
      <div className={cn(
        "absolute -inset-1 bg-gradient-to-r from-baby-blue via-lavender to-soft-neon rounded-3xl opacity-0 transition-opacity duration-500 -z-10 blur-xl",
        isHovered && "opacity-40 animate-glow-pulse"
      )} />
      
      {/* Floating animation */}
      <div className={cn(
        "absolute inset-0 rounded-3xl transition-all duration-500",
        isHovered && "shadow-holo"
      )} />
    </Card>
  );
};