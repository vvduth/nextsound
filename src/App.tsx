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
import { QueuePanel } from "@/components/ui/QueuePanel";
import { MiniPlayer } from "@/components/ui/MiniPlayer";
import { FloatingQueueButton } from "@/components/ui/FloatingQueueButton";
import { QueueIntegration } from "@/components/QueueIntegration";
import { useAudioPlayerContext } from "@/context/audioPlayerContext";

import "react-loading-skeleton/dist/skeleton.css";
import "swiper/css";

const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const {
    currentTrack,
    isPlaying,
    progress,
    volume,
    isShuffled,
    repeatMode,
    isMinimized,
    togglePlay,
    skipPrevious,
    skipNext,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
    toggleMinimize,
  } = useAudioPlayerContext();

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
      {/* Queue Integration - connects queue with audio player */}
      <QueueIntegration />
      
      <SideBar />
      <Header onOpenSearch={() => setIsCommandPaletteOpen(true)} />
      <DemoModeBadge />
      <main className="transition-all duration-300 lg:pb-14 md:pb-4 sm:pb-2 xs:pb-1 pb-0 bg-gradient-to-br from-off-white via-baby-blue/10 to-pastel-cyan/20 dark:from-deep-dark dark:via-charcoal dark:to-lavender/10 min-h-screen relative overflow-hidden">
        {/* Holographic background effects */}
        <div className="fixed inset-0 holo-effect opacity-20 pointer-events-none -z-10"></div>
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-baby-blue/20 dark:bg-lavender/10 rounded-full blur-3xl opacity-30 pointer-events-none -z-10 animate-float"></div>
        <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-pastel-cyan/20 dark:bg-soft-neon/10 rounded-full blur-3xl opacity-30 pointer-events-none -z-10 animate-float" style={{ animationDelay: '3s' }}></div>
        
        <ScrollToTop>
          <ErrorBoundary>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Home />} />
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

      {/* Queue Panel */}
      <QueuePanel />

      {/* Floating Queue Button - shows when no track is playing */}
      <FloatingQueueButton />

      {/* Mini Player */}
      <MiniPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        progress={progress}
        volume={volume}
        isShuffled={isShuffled}
        repeatMode={repeatMode}
        isMinimized={isMinimized}
        onTogglePlay={togglePlay}
        onSkipPrevious={skipPrevious}
        onSkipNext={skipNext}
        onSeek={seek}
        onVolumeChange={setVolume}
        onToggleShuffle={toggleShuffle}
        onToggleRepeat={toggleRepeat}
        onToggleFavorite={toggleFavorite}
        onToggleMinimize={toggleMinimize}
      />

      <Footer />
    </>
  );
};

export default App;
