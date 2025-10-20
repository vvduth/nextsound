import { supabase } from './supabaseClient';
import { ISongUpvote } from '@/types';

/**
 * SupabaseService - Handles all interactions with Supabase for song upvotes
 * 
 * ✅ AUTHENTICATED UPVOTING ENABLED
 * 
 * Features:
 * - User authentication required for upvoting
 * - Per-user upvote tracking via database
 * - RLS policies enforce user-specific access
 */
class SupabaseService {
  constructor() {
    // No initialization needed - all data is stored in database
  }

  /**
   * Check if user is authenticated
   */
  private async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return !!user;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  /**
   * Get current authenticated user
   */
  private async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Check if current user has upvoted a track
   */
  async hasUserUpvoted(trackId: string): Promise<boolean> {
    const upvote = await this.getUserUpvote(trackId);
    return !!upvote;
  }

  /**
   * Get upvote for a specific track by the current user
   */
  async getUserUpvote(trackId: string): Promise<ISongUpvote | null> {
    try {
      const user = await this.getCurrentUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('song_upvotes')
        .select('*')
        .eq('track_id', trackId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        console.error('Error fetching user upvote:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user upvote:', error);
      return null;
    }
  }

  /**
   * Get total upvote count for a specific track
   */
  async getTotalUpvoteCount(trackId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('song_upvotes')
        .select('*', { count: 'exact', head: true })
        .eq('track_id', trackId);

      if (error) {
        console.error('Error fetching total upvote count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error fetching total upvote count:', error);
      return 0;
    }
  }

  /**
   * Add an upvote for a track (authenticated users only)
   */
  async addUpvote(trackId: string): Promise<ISongUpvote | null> {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        console.warn('User must be authenticated to upvote');
        return null;
      }

      // Check if user has already upvoted
      const existing = await this.getUserUpvote(trackId);
      if (existing) {
        console.warn('User has already upvoted this track');
        return existing;
      }

      // Insert new upvote
      const { data, error } = await supabase
        .from('song_upvotes')
        .insert({
          track_id: trackId,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding upvote:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error adding upvote:', error);
      return null;
    }
  }

  /**
   * Remove an upvote for a track (authenticated users only)
   */
  async removeUpvote(trackId: string): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        console.warn('User must be authenticated to remove upvote');
        return false;
      }

      // Delete the upvote
      const { error } = await supabase
        .from('song_upvotes')
        .delete()
        .eq('track_id', trackId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error removing upvote:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error removing upvote:', error);
      return false;
    }
  }

  /**
   * Toggle upvote for a track (authenticated users only)
   * Returns true if upvoted, false if removed, null if failed or not authenticated
   */
  async toggleUpvote(trackId: string): Promise<boolean | null> {
    try {
      const isAuth = await this.isAuthenticated();
      if (!isAuth) {
        console.warn('User must be authenticated to toggle upvote');
        return null;
      }

      const existingUpvote = await this.getUserUpvote(trackId);

      if (existingUpvote) {
        const success = await this.removeUpvote(trackId);
        return success ? false : null;
      } else {
        const newUpvote = await this.addUpvote(trackId);
        return newUpvote ? true : null;
      }
    } catch (error) {
      console.error('Error toggling upvote:', error);
      return null;
    }
  }

  /**
   * Get multiple tracks' total upvote counts
   */
  async getBulkUpvoteCounts(trackIds: string[]): Promise<Map<string, number>> {
    try {
      if (trackIds.length === 0) return new Map();

      // Get counts for each track
      const countPromises = trackIds.map(async (trackId) => {
        const count = await this.getTotalUpvoteCount(trackId);
        return { trackId, count };
      });

      const results = await Promise.all(countPromises);
      
      const countMap = new Map<string, number>();
      results.forEach(({ trackId, count }) => {
        countMap.set(trackId, count);
      });

      return countMap;
    } catch (error) {
      console.error('Error fetching bulk upvote counts:', error);
      return new Map();
    }
  }

  /**
   * Check which tracks the current user has upvoted (authenticated users only)
   */
  async getUserUpvotedTracks(trackIds: string[]): Promise<Set<string>> {
    try {
      const user = await this.getCurrentUser();
      if (!user) return new Set();

      if (trackIds.length === 0) return new Set();

      const { data, error } = await supabase
        .from('song_upvotes')
        .select('track_id')
        .eq('user_id', user.id)
        .in('track_id', trackIds);

      if (error) {
        console.error('Error fetching user upvoted tracks:', error);
        return new Set();
      }

      return new Set(data.map(item => item.track_id));
    } catch (error) {
      console.error('Error fetching user upvoted tracks:', error);
      return new Set();
    }
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService();
export default supabaseService;

