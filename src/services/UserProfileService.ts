// Use this when implementing auth
import { supabase } from './supabaseClient';
import type { IUserProfile } from '@/types';

/**
 * UserProfileService - Handles all user profile operations with Supabase
 */
class UserProfileService {
  /**
   * Get a user's profile by ID
   */
  async getProfile(userId: string): Promise<IUserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Get current user's profile
   */
  async getCurrentUserProfile(): Promise<IUserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      return await this.getProfile(user.id);
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      return null;
    }
  }

  /**
   * Get a user's profile by username
   */
  async getProfileByUsername(username: string): Promise<IUserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // No rows found
        console.error('Error fetching user profile by username:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profile by username:', error);
      return null;
    }
  }

  /**
   * Create or update user profile
   */
  async upsertProfile(profile: Partial<IUserProfile>): Promise<IUserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('User must be authenticated to update profile');
        return null;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          ...profile,
        })
        .select()
        .single();

      if (error) {
        console.error('Error upserting user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error upserting user profile:', error);
      return null;
    }
  }

  /**
   * Update username
   */
  async updateUsername(username: string): Promise<IUserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('User must be authenticated to update username');
        return null;
      }

      // Check if username is already taken
      const existing = await this.getProfileByUsername(username);
      if (existing && existing.id !== user.id) {
        console.error('Username already taken');
        return null;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ username })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating username:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error updating username:', error);
      return null;
    }
  }

  /**
   * Update avatar URL
   */
  async updateAvatar(avatarUrl: string): Promise<IUserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('User must be authenticated to update avatar');
        return null;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating avatar:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error updating avatar:', error);
      return null;
    }
  }

  /**
   * Update bio
   */
  async updateBio(bio: string): Promise<IUserProfile | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('User must be authenticated to update bio');
        return null;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ bio })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating bio:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error updating bio:', error);
      return null;
    }
  }

  /**
   * Check if username is available
   */
  async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const profile = await this.getProfileByUsername(username);
      return profile === null;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
  }

  /**
   * Get multiple user profiles by IDs
   */
  async getProfilesByIds(userIds: string[]): Promise<IUserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .in('id', userIds);

      if (error) {
        console.error('Error fetching user profiles:', error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Error fetching user profiles:', error);
      return [];
    }
  }

  /**
   * Get user's upvoted tracks count
   */
  async getUserUpvotesCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('song_upvotes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user upvotes count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error fetching user upvotes count:', error);
      return 0;
    }
  }

  /**
   * Get user's upvoted tracks
   */
  async getUserUpvotedTracks(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('song_upvotes')
        .select('track_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user upvoted tracks:', error);
        return [];
      }

      return data.map(item => item.track_id);
    } catch (error) {
      console.error('Error fetching user upvoted tracks:', error);
      return [];
    }
  }
}

// Export singleton instance
export const userProfileService = new UserProfileService();
export default userProfileService;

