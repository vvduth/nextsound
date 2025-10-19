import { useState } from 'react';
import { useAuth } from '@/context/authContext';
import { Button } from './button';
import { Input } from './input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './dialog';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: 'signin' | 'signup';
}

export const AuthModal = ({ isOpen, onClose, defaultView = 'signin' }: AuthModalProps) => {
  const [view, setView] = useState<'signin' | 'signup' | 'reset'>(defaultView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { signIn, signUp, resetPassword } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setLoading(false);
      onClose();
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signUp(email, password);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess('Check your email to confirm your account!');
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await resetPassword(email);
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess('Password reset email sent! Check your inbox.');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setSuccess(null);
  };

  const handleViewChange = (newView: 'signin' | 'signup' | 'reset') => {
    resetForm();
    setView(newView);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {view === 'signin' && 'Sign In'}
            {view === 'signup' && 'Create Account'}
            {view === 'reset' && 'Reset Password'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {view === 'signin' && 'Sign in to upvote your favorite tracks'}
            {view === 'signup' && 'Create an account to start upvoting'}
            {view === 'reset' && 'Enter your email to reset your password'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={view === 'signin' ? handleSignIn : view === 'signup' ? handleSignUp : handleResetPassword} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 text-sm text-green-500 bg-green-50 dark:bg-green-900/20 rounded-md">
              {success}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          {view !== 'reset' && (
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-900 dark:text-white">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : view === 'signin' ? 'Sign In' : view === 'signup' ? 'Sign Up' : 'Send Reset Email'}
          </Button>

          <div className="space-y-2 text-center text-sm">
            {view === 'signin' && (
              <>
                <button
                  type="button"
                  onClick={() => handleViewChange('reset')}
                  className="text-orange-600 dark:text-orange-400 hover:underline block w-full font-medium"
                >
                  Forgot password?
                </button>
                <div className="text-gray-700 dark:text-gray-300">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleViewChange('signup')}
                    className="text-orange-600 dark:text-orange-400 hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}

            {view === 'signup' && (
              <div className="text-gray-700 dark:text-gray-300">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleViewChange('signin')}
                  className="text-orange-600 dark:text-orange-400 hover:underline font-medium"
                >
                  Sign in
                </button>
              </div>
            )}

            {view === 'reset' && (
              <button
                type="button"
                onClick={() => handleViewChange('signin')}
                className="text-orange-600 dark:text-orange-400 hover:underline font-medium"
              >
                Back to sign in
              </button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

