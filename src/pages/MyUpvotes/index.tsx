import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/authContext';
import { userProfileService } from '@/services/UserProfileService';
import { Loader } from '@/common';
import { TrackCard } from '@/components/ui/TrackCard';
import { maxWidth } from '@/styles';
import { cn } from '@/utils';
import { FiHeart } from 'react-icons/fi';

const MyUpvotes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trackIds, setTrackIds] = useState<string[]>([]);
  const [upvoteCount, setUpvoteCount] = useState(0);

  useEffect(() => {
    const loadUpvotedTracks = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      const tracks = await userProfileService.getUserUpvotedTracks(user.id);
      const count = await userProfileService.getUserUpvotesCount(user.id);
      
      setTrackIds(tracks);
      setUpvoteCount(count);
      setLoading(false);
    };

    loadUpvotedTracks();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className={cn(maxWidth, 'py-24 min-h-screen')}>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FiHeart className="w-8 h-8 text-orange-500" />
          <h1 className="text-3xl font-bold">My Upvoted Songs</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          {upvoteCount === 0 
            ? "You haven't upvoted any songs yet. Start exploring and upvote your favorites!" 
            : `You've upvoted ${upvoteCount} ${upvoteCount === 1 ? 'song' : 'songs'}`
          }
        </p>
      </div>

      {trackIds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FiHeart className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No upvoted songs yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Discover and upvote your favorite tracks to see them here
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Explore Music
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {trackIds.map((trackId) => (
            <div key={trackId} className="text-center text-sm text-gray-500 dark:text-gray-400">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-48 flex items-center justify-center">
                <div>
                  <FiHeart className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <p className="text-xs truncate">Track ID: {trackId.slice(0, 8)}...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Note:</strong> Full track details with album art and playback will be available once we integrate the track data fetching. Currently showing track IDs only.
        </p>
      </div>
    </div>
  );
};

export default MyUpvotes;

