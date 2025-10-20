import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './card';
import {
  FaClock,
  FaHeart,
  FaRegHeart
} from 'react-icons/fa';
import { ITrack } from '@/types';
import { getImageUrl, cn } from '@/utils';
import { supabaseService } from '@/services/SupabaseService';

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
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);

  const { poster_path, original_title: title, name, artist, album, duration } = track;
  const displayTitle = title || name || 'Unknown Track';

  // Load upvote data on mount
  useEffect(() => {
    const loadUpvoteData = async () => {
      if (!track.id) return;
      
      // Check if user has upvoted
      const userUpvoted = supabaseService.hasUserUpvoted(track.id);
      setHasUpvoted(userUpvoted);
      
      // Get total upvote count
      const count = await supabaseService.getTotalUpvoteCount(track.id);
      setUpvoteCount(count);
    };

    loadUpvoteData();
  }, [track.id]);

  const handleUpvoteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (isUpvoting || !track.id) return;
    
    setIsUpvoting(true);
    
    try {
      const newUpvotedState = await supabaseService.toggleUpvote(track.id);
      setHasUpvoted(newUpvotedState);
      
      // Update count locally for instant feedback
      setUpvoteCount(prev => newUpvotedState ? prev + 1 : Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error toggling upvote:', error);
    } finally {
      setIsUpvoting(false);
    }
  };

  const formatDuration = (ms: number) => {
    if (!ms) return '';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };


  const cardHeight = variant === 'compact' ? 'h-52' : variant === 'featured' ? 'h-84' : 'h-80';
  const imageHeight = variant === 'compact' ? 160 : variant === 'featured' ? 240 : 200;

  return (
    <Card 
      className={cn(
        "group relative transition-all duration-300 ease-out overflow-hidden",
        "hover:scale-[1.03] hover:-translate-y-2 cursor-pointer",
        "bg-white dark:bg-card-dark border-0",
        "shadow-sm hover:shadow-card-hover",
        "rounded-xl p-4",
        cardHeight,
        "w-[180px]", // Slightly wider for better proportions
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Content */}
      <div className="block relative h-full">
        {/* Image Container */}
        <div className="relative overflow-hidden rounded-lg mb-3">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-hover-gray animate-pulse rounded-lg" 
                 style={{ height: imageHeight }} />
          )}
          
          {/* Album artwork */}
          <img
            src={getImageUrl(poster_path)}
            alt={displayTitle}
            className={cn(
              "w-full object-cover transition-all duration-300 rounded-lg",
              "group-hover:scale-105",
              "dark:brightness-75 dark:contrast-110 dark:saturate-90",
              "dark:group-hover:brightness-90 dark:group-hover:contrast-105 dark:group-hover:saturate-95",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            style={{ height: imageHeight }}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />

          {/* Gradient overlay on hover */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent transition-opacity duration-300 rounded-lg",
            isHovered ? "opacity-100" : "opacity-0"
          )} />

          {/* Upvote button - positioned on image */}
          <button
            onClick={handleUpvoteClick}
            disabled={isUpvoting}
            className={cn(
              "absolute top-2 right-2 z-10",
              "flex items-center gap-1 px-2.5 py-1.5 rounded-full",
              "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm",
              "border border-gray-200 dark:border-gray-700",
              "transition-all duration-200",
              "hover:scale-110 hover:bg-white dark:hover:bg-gray-800",
              "active:scale-95",
              isUpvoting && "opacity-50 cursor-not-allowed"
            )}
            title={hasUpvoted ? "Remove upvote" : "Upvote this track"}
          >
            {hasUpvoted ? (
              <FaHeart className="w-3.5 h-3.5 text-red-500" />
            ) : (
              <FaRegHeart className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
            )}
            <span className={cn(
              "text-xs font-semibold",
              hasUpvoted ? "text-red-500" : "text-gray-700 dark:text-gray-200"
            )}>
              {upvoteCount}
            </span>
          </button>
        </div>

        {/* Track information */}
        <CardContent className="p-0 space-y-2">
          {/* Track title */}
          <h3 className={cn(
            "font-semibold text-gray-900 dark:text-text-primary truncate transition-colors duration-200",
            variant === 'compact' ? "text-sm" : "text-base",
            "group-hover:text-accent-orange dark:group-hover:text-accent-orange"
          )}>
            {displayTitle}
          </h3>
          
          {/* Artist name */}
          <p className={cn(
            "text-gray-600 dark:text-text-secondary truncate font-medium",
            variant === 'compact' ? "text-xs" : "text-sm"
          )}>
            {artist || 'Unknown Artist'}
          </p>

          {/* Additional info for detailed variant */}
          {variant === 'detailed' && (
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2 flex-1 mr-2">
                {album && (
                  <span className="text-xs text-text-muted dark:text-text-secondary/70 truncate">
                    {album}
                  </span>
                )}
              </div>
              {duration && (
                <div className="flex items-center text-xs text-text-muted dark:text-text-secondary/70 shrink-0">
                  <FaClock className="w-3 h-3 mr-1 opacity-60" />
                  {formatDuration(duration)}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </div>

      {/* Hover glow effect */}
      <div className={cn(
        "absolute -inset-1 bg-gradient-to-r from-spotify-green via-accent-orange to-warning-amber rounded-2xl opacity-0 transition-opacity duration-500 -z-10 blur-md",
        "dark:bg-gradient-to-r dark:from-blue-800 dark:via-slate-600 dark:to-blue-800",
        isHovered && "opacity-10"
      )} />
    </Card>
  );
};