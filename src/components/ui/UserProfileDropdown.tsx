// Use this when implementing auth
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/authContext';
import { FiUser, FiLogOut, FiHeart } from 'react-icons/fi';

export const UserProfileDropdown = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  if (!user) return null;

  // Get first letter of email for avatar
  const initial = user.email?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
      >
        {initial}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.email}
            </p>
          </div>

          <button
            onClick={() => {
              navigate('/profile');
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <FiUser className="w-4 h-4" />
            View Profile
          </button>

          <button
            onClick={() => {
              navigate('/my-upvotes');
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <FiHeart className="w-4 h-4" />
            My Upvoted Songs
          </button>

          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <FiLogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

