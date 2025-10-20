import { supabase } from './supabaseClient';

/**
 * SupabaseService - Handles all interactions with Supabase for track upvotes
 * 
 * ✅ NO AUTHENTICATION REQUIRED
 * 
 * Features:
 * - Anonymous upvoting (no auth needed)
 * - Local storage tracking for user's upvoted tracks
 * - Global upvote counts stored in database
 */

const UPVOTED_TRACKS_KEY = 'nextsound_upvoted_tracks';

class SupabaseService {
  constructor() {
    // No initialization needed - all data is stored in database
  }

  /**
   * Get user's upvoted tracks from localStorage
   */
  private getLocalUpvotedTracks(): Set<string> {
    try {
      const stored = localStorage.getItem(UPVOTED_TRACKS_KEY);
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    return new Set();
  }

  /**
   * Save user's upvoted tracks to localStorage
   */
  private saveLocalUpvotedTracks(tracks: Set<string>): void {
    try {
      localStorage.setItem(UPVOTED_TRACKS_KEY, JSON.stringify(Array.from(tracks)));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }

  /**
   * Check if current user has upvoted a track (using localStorage)
   */
  hasUserUpvoted(trackId: string): boolean {
    const upvotedTracks = this.getLocalUpvotedTracks();
    return upvotedTracks.has(trackId);
  }

  /**
   * Get total upvote count for a specific track
   */
  async getTotalUpvoteCount(trackId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('track_upvotes')
        .select('upvote_count')
        .eq('track_id', trackId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching total upvote count:', error);
        return 0;
      }

      return data?.upvote_count || 0;
    } catch (error) {
      console.error('Error fetching total upvote count:', error);
      return 0;
    }
  }

  /**
   * Add an upvote for a track (no auth required)
   */
  async addUpvote(trackId: string): Promise<boolean> {
    try {
      // Check if user has already upvoted locally
      const upvotedTracks = this.getLocalUpvotedTracks();
      if (upvotedTracks.has(trackId)) {
        console.warn('User has already upvoted this track');
        return false;
      }

      // Check if track exists in database
      const { data: existingTrack } = await supabase
        .from('track_upvotes')
        .select('id, upvote_count')
        .eq('track_id', trackId)
        .maybeSingle();

      if (existingTrack) {
        // Increment existing upvote count
        const { error } = await supabase
          .from('track_upvotes')
          .update({ 
            upvote_count: existingTrack.upvote_count + 1,
            updated_at: new Date().toISOString()
          })
          .eq('track_id', trackId);

        if (error) {
          console.error('Error updating upvote:', error);
          return false;
        }
      } else {
        // Create new track upvote record
        const { error } = await supabase
          .from('track_upvotes')
          .insert({
            track_id: trackId,
            upvote_count: 1,
          });

        if (error) {
          console.error('Error creating upvote:', error);
          return false;
        }
      }

      // Save to localStorage
      upvotedTracks.add(trackId);
      this.saveLocalUpvotedTracks(upvotedTracks);

      return true;
    } catch (error) {
      console.error('Error adding upvote:', error);
      return false;
    }
  }

  /**
   * Remove an upvote for a track (no auth required)
   */
  async removeUpvote(trackId: string): Promise<boolean> {
    try {
      // Check if user has upvoted locally
      const upvotedTracks = this.getLocalUpvotedTracks();
      if (!upvotedTracks.has(trackId)) {
        console.warn('User has not upvoted this track');
        return false;
      }

      // Get current track data
      const { data: existingTrack } = await supabase
        .from('track_upvotes')
        .select('id, upvote_count')
        .eq('track_id', trackId)
        .maybeSingle();

      if (existingTrack && existingTrack.upvote_count > 0) {
        // Decrement upvote count
        const { error } = await supabase
          .from('track_upvotes')
          .update({ 
            upvote_count: existingTrack.upvote_count - 1,
            updated_at: new Date().toISOString()
          })
          .eq('track_id', trackId);

        if (error) {
          console.error('Error removing upvote:', error);
          return false;
        }

        // Remove from localStorage
        upvotedTracks.delete(trackId);
        this.saveLocalUpvotedTracks(upvotedTracks);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error removing upvote:', error);
      return false;
    }
  }

  /**
   * Toggle upvote for a track (no auth required)
   * Returns true if upvoted, false if removed
   */
  async toggleUpvote(trackId: string): Promise<boolean> {
    try {
      const hasUpvoted = this.hasUserUpvoted(trackId);

      if (hasUpvoted) {
        const success = await this.removeUpvote(trackId);
        return !success; // Return false if successfully removed
      } else {
        const success = await this.addUpvote(trackId);
        return success; // Return true if successfully added
      }
    } catch (error) {
      console.error('Error toggling upvote:', error);
      return false;
    }
  }

  /**
   * Get multiple tracks' total upvote counts
   */
  async getBulkUpvoteCounts(trackIds: string[]): Promise<Map<string, number>> {
    try {
      if (trackIds.length === 0) return new Map();

      const { data, error } = await supabase
        .from('track_upvotes')
        .select('track_id, upvote_count')
        .in('track_id', trackIds);

      if (error) {
        console.error('Error fetching bulk upvote counts:', error);
        return new Map();
      }

      const countMap = new Map<string, number>();
      
      // Add all tracks with their counts
      data?.forEach(item => {
        countMap.set(item.track_id, item.upvote_count || 0);
      });

      // Add tracks that don't exist in DB yet with count 0
      trackIds.forEach(trackId => {
        if (!countMap.has(trackId)) {
          countMap.set(trackId, 0);
        }
      });

      return countMap;
    } catch (error) {
      console.error('Error fetching bulk upvote counts:', error);
      return new Map();
    }
  }

  /**
   * Check which tracks the current user has upvoted (using localStorage)
   */
  getUserUpvotedTracks(trackIds: string[]): Set<string> {
    try {
      if (trackIds.length === 0) return new Set();

      const upvotedTracks = this.getLocalUpvotedTracks();
      
      // Filter to only include tracks from the provided list
      const filteredTracks = new Set<string>();
      trackIds.forEach(trackId => {
        if (upvotedTracks.has(trackId)) {
          filteredTracks.add(trackId);
        }
      });

      return filteredTracks;
    } catch (error) {
      console.error('Error fetching user upvoted tracks:', error);
      return new Set();
    }
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService();
export default supabaseService;

