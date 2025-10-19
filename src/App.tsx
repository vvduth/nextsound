import { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import {
  Header,
  Footer,
  SideBar,
  ScrollToTop,
  Loader,
  ErrorBoundary,
  DemoModeBadge,
} from "@/common";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { MiniPlayer } from "@/components/ui/MiniPlayer";
import { ProtectedRoute } from "@/components/ui/ProtectedRoute";
import { useAudioPlayerContext } from "@/context/audioPlayerContext";

import "react-loading-skeleton/dist/skeleton.css";
import "swiper/css";

const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const MyUpvotes = lazy(() => import("./pages/MyUpvotes"));

const App = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const audioPlayer = useAudioPlayerContext();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <SideBar />
      <Header onOpenSearch={() => setIsCommandPaletteOpen(true)} />
      <DemoModeBadge />
      <main className="transition-all duration-300 lg:pb-14 md:pb-4 sm:pb-2 xs:pb-1 pb-0 bg-white dark:bg-deep-dark min-h-screen">
        <ScrollToTop>
          <ErrorBoundary>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <UserProfile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/my-upvotes" 
                  element={
                    <ProtectedRoute>
                      <MyUpvotes />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </ScrollToTop>
      </main>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onItemSelect={() => {
          // Item selection handled by CommandPalette component
        }}
      />

      {/* Persistent Media Player */}
      <MiniPlayer
        currentTrack={audioPlayer.currentTrack}
        isPlaying={audioPlayer.isPlaying}
        progress={audioPlayer.progress}
        volume={audioPlayer.volume}
        isShuffled={audioPlayer.isShuffled}
        repeatMode={audioPlayer.repeatMode}
        onTogglePlay={audioPlayer.togglePlay}
        onSkipPrevious={audioPlayer.skipPrevious}
        onSkipNext={audioPlayer.skipNext}
        onSeek={audioPlayer.seek}
        onVolumeChange={audioPlayer.setVolume}
        onToggleShuffle={audioPlayer.toggleShuffle}
        onToggleRepeat={audioPlayer.toggleRepeat}
        onToggleFavorite={audioPlayer.toggleFavorite}
        isMinimized={audioPlayer.isMinimized}
        onToggleMinimize={audioPlayer.toggleMinimize}
        onClose={audioPlayer.closePlayer}
      />

      <Footer />
    </>
  );
};

export default App;
