/**
 * TrackCard Component
 * 
 * ✅ AUTHENTICATED UPVOTING ENABLED
 * - Shows auth modal when user tries to upvote without being logged in
 * - Tracks per-user upvotes in database
 */
import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { Card, CardContent } from './card';
import { AuthModal } from './AuthModal';
import {
  FaPlay,
  FaPause,
  FaClock,
  FaArrowUp,
  FaSpotify
} from 'react-icons/fa';
import { ITrack } from '@/types';
import { getImageUrl, cn } from '@/utils';
import { supabaseService } from '@/services/SupabaseService';
import { useAudioPlayerContext } from '@/context/audioPlayerContext';
import { useAuth } from '@/context/authContext';

interface TrackCardProps {
  track: ITrack;
  category: string;
  isPlaying?: boolean;
  onPlay?: (track: ITrack) => void;
  variant?: 'compact' | 'detailed' | 'featured';
  className?: string;
  onAuthRequired?: () => void;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  category: _category,
  isPlaying: _isPlayingProp,
  onPlay: _onPlayProp,
  variant = 'detailed',
  className,
  onAuthRequired
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [isLoadingUpvote, setIsLoadingUpvote] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { currentTrack, isPlaying: globalIsPlaying, playTrack } = useAudioPlayerContext();
  const { user } = useAuth();

  const { poster_path, original_title: title, name, artist, album, duration } = track;
  const displayTitle = title || name || 'Unknown Track';
  const trackId = track.spotify_id || track.id;

  // Check if this track is currently playing
  const isPlaying = currentTrack?.id === track.id && globalIsPlaying;

  // Fetch upvote data from Supabase on component mount
  useEffect(() => {
    const fetchUpvoteData = async () => {
      // Get total upvote count
      const count = await supabaseService.getTotalUpvoteCount(trackId);
      setUpvoteCount(count);
      
      // Check if current user has upvoted (requires authentication)
      if (user) {
        const userUpvote = await supabaseService.getUserUpvote(trackId);
        setIsUpvoted(!!userUpvote);
      } else {
        setIsUpvoted(false);
      }
    };

    fetchUpvoteData();
  }, [trackId, user]);


  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 TrackCard: Play button clicked for track:', track.name || track.original_title);
    playTrack(track);
  };

  const handleUpvoteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoadingUpvote) return; // Prevent multiple clicks

    // Check if user is authenticated
    if (!user) {
      // Show auth modal if not authenticated
      setShowAuthModal(true);
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }

    setIsLoadingUpvote(true);

    try {
      // Toggle upvote (add or remove) - requires authentication
      const newState = await supabaseService.toggleUpvote(trackId);
      
      if (newState !== null) {
        setIsUpvoted(newState);
        
        // Refresh the total count
        const newCount = await supabaseService.getTotalUpvoteCount(trackId);
        setUpvoteCount(newCount);
      }
    } catch (error) {
      console.error('Error handling upvote:', error);
    } finally {
      setIsLoadingUpvote(false);
    }
  };

  const handleOpenSpotify = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!track.spotify_id) return;

    // Try to open in Spotify app first, fallback to web player
    const spotifyAppUrl = `spotify:track:${track.spotify_id}`;
    const spotifyWebUrl = `https://open.spotify.com/track/${track.spotify_id}`;

    // Attempt to open in app
    window.location.href = spotifyAppUrl;

    // Fallback to web player after a short delay
    setTimeout(() => {
      window.open(spotifyWebUrl, '_blank');
    }, 500);
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

          {/* Play button overlay */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-300",
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
          )}>
            <Button
              onClick={handlePlayClick}
              variant="ghost"
              size="icon"
              className={cn(
                "w-14 h-14 rounded-full shadow-xl transition-all duration-200",
                "bg-accent-orange hover:bg-accent-orange/90",
                "hover:scale-110 text-white"
              )}
            >
              {isPlaying ? (
                <FaPause className="w-6 h-6 ml-0.5" />
              ) : (
                <FaPlay className="w-6 h-6 ml-1" />
              )}
            </Button>
          </div>

          {/* Open in Spotify button */}
          {track.spotify_id && (
            <div className={cn(
              "absolute bottom-3 right-3 transition-all duration-300",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}>
              <Button
                onClick={handleOpenSpotify}
                variant="ghost"
                size="icon"
                className={cn(
                  "w-10 h-10 rounded-full shadow-lg transition-all duration-200",
                  "bg-[#1DB954] hover:bg-[#1ed760]",
                  "hover:scale-110 text-white"
                )}
                aria-label="Open in Spotify"
              >
                <FaSpotify className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Playing indicator */}
          {isPlaying && (
            <div className="absolute bottom-3 left-3">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-success-green rounded-full shadow-lg backdrop-blur-sm">
                <div className="flex space-x-0.5">
                  <div className="w-1 h-3 bg-white rounded-full animate-pulse"></div>
                  <div className="w-1 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                </div>
                <span className="text-xs text-white font-semibold">Playing</span>
              </div>
            </div>
          )}

          {/* Upvote button */}
          <button
            onClick={handleUpvoteClick}
            disabled={isLoadingUpvote}
            className={cn(
              "absolute top-3 right-3 flex flex-col items-center justify-center gap-0.5 px-2.5 py-1.5 rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 z-10 group/upvote",
              isUpvoted
                ? "bg-accent-orange/90 hover:bg-accent-orange"
                : "bg-black/40 hover:bg-black/60",
              isLoadingUpvote && "opacity-50 cursor-not-allowed"
            )}
            aria-label={isUpvoted ? "Remove upvote" : "Upvote track"}
          >
            <FaArrowUp className={cn(
              "w-3.5 h-3.5 transition-colors",
              isUpvoted ? "text-white" : "text-white/90"
            )} />
            <span className={cn(
              "text-xs font-semibold transition-colors",
              isUpvoted ? "text-white" : "text-white/90"
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView="signin"
      />
    </Card>
  );
};