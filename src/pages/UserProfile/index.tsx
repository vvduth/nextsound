import { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext';
import { userProfileService } from '@/services/UserProfileService';
import type { IUserProfile } from '@/types';
import { Loader } from '@/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import { maxWidth } from '@/styles';
import { cn } from '@/utils';

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newBio, setNewBio] = useState('');
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      const userProfile = await userProfileService.getCurrentUserProfile();
      const count = await userProfileService.getUserUpvotesCount(user.id);
      
      setProfile(userProfile);
      setUpvoteCount(count);
      setNewUsername(userProfile?.username || '');
      setNewBio(userProfile?.bio || '');
      setLoading(false);
    };

    loadProfile();
  }, [user]);

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      setError('Username cannot be empty');
      return;
    }

    setSaving(true);
    setError(null);

    const updatedProfile = await userProfileService.updateUsername(newUsername);
    
    if (updatedProfile) {
      setProfile(updatedProfile);
      setEditingUsername(false);
    } else {
      setError('Failed to update username. It may already be taken.');
    }
    
    setSaving(false);
  };

  const handleSaveBio = async () => {
    setSaving(true);
    setError(null);

    const updatedProfile = await userProfileService.updateBio(newBio);
    
    if (updatedProfile) {
      setProfile(updatedProfile);
      setEditingBio(false);
    } else {
      setError('Failed to update bio');
    }
    
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Profile not found</p>
      </div>
    );
  }

  const initial = user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className={cn(maxWidth, 'py-24 min-h-screen')}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-orange-500 text-white text-3xl font-medium">
              {initial}
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-lg font-medium">{user?.email}</p>
            </div>
          </div>

          {/* Username */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Username</label>
              {!editingUsername && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingUsername(true)}
                >
                  <FiEdit2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {editingUsername ? (
              <div className="flex gap-2">
                <Input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter username"
                  disabled={saving}
                />
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveUsername}
                  disabled={saving}
                >
                  <FiCheck className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingUsername(false);
                    setNewUsername(profile.username || '');
                    setError(null);
                  }}
                  disabled={saving}
                >
                  <FiX className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                {profile.username || 'Not set'}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Bio</label>
              {!editingBio && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingBio(true)}
                >
                  <FiEdit2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {editingBio ? (
              <div className="space-y-2">
                <textarea
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  disabled={saving}
                />
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSaveBio}
                    disabled={saving}
                  >
                    <FiCheck className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingBio(false);
                      setNewBio(profile.bio || '');
                      setError(null);
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {profile.bio || 'No bio yet'}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-2xl font-bold text-orange-500">{upvoteCount}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tracks Upvoted</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-2xl font-bold text-orange-500">
                  {profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

