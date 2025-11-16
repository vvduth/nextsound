import { shouldUseMockData } from "@/data/mockMusicData";

const DemoModeBadge = () => {
  const isDemoMode = shouldUseMockData();

  if (!isDemoMode) {
    return null;
  }

  return (
    <div className="cyber-glow-ring fixed top-4 right-4 z-50 bg-gradient-to-r from-baby-blue/90 to-lavender/90 dark:from-lavender/90 dark:to-soft-neon/90 backdrop-blur-xl text-charcoal dark:text-off-white px-4 py-2.5 rounded-full text-sm font-cyber font-bold shadow-cyber-glow border-2 border-baby-blue/40 dark:border-lavender/40 flex items-center gap-2.5 animate-glow-pulse">
      <div className="relative w-3 h-3">
        <div className="absolute inset-0 bg-mint-soft dark:bg-pastel-cyan rounded-full animate-ping"></div>
        <div className="relative w-3 h-3 bg-success-green dark:bg-pastel-cyan rounded-full shadow-neon-soft"></div>
      </div>
      <span className="tracking-wide">Demo Mode</span>
    </div>
  );
};

export default DemoModeBadge;