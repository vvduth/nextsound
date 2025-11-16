import { memo } from 'react';
import { m } from "framer-motion";

import { Poster } from "@/common";
import { mainHeading, maxWidth, paragraph, watchBtn } from "@/styles";
import { ITrack } from "@/types";
import { cn } from "@/utils/helper";
import { useMotion } from "@/hooks/useMotion";

const HeroSlide = ({ track }: { track: ITrack }) => {
  const { fadeDown, staggerContainer } = useMotion();

  const {
    overview,
    original_title: title,
    poster_path: posterPath,
  } = track;

  return (
    <div
      className={cn(
        maxWidth,
        `mx-auto flex items-center h-full flex-row lg:gap-32 sm:gap-20 relative`
      )}
    >
      {/* Holographic background blur effect */}
      <div className="absolute inset-0 holo-effect opacity-30 blur-3xl -z-10"></div>
      
      <m.div
        variants={staggerContainer(0.2, 0.3)}
        initial="hidden"
        animate="show"
        className="cyber-glow-ring relative sm:max-w-[80vw] max-w-[90vw] md:max-w-[480px] font-cyber flex flex-col sm:gap-6 xs:gap-4 gap-3 sm:mb-8 bg-gradient-to-br from-off-white/60 to-baby-blue/30 dark:from-charcoal/60 dark:to-lavender/20 backdrop-blur-2xl p-8 rounded-3xl border-2 border-baby-blue/40 dark:border-lavender/40 shadow-float"
      >
        <m.h2 
          variants={fadeDown} 
          className={cn(
            mainHeading, 
            "text-transparent bg-clip-text bg-gradient-to-r from-baby-blue via-lavender to-soft-neon drop-shadow-lg font-extrabold tracking-tight"
          )}
        >
          {title}
        </m.h2>
        <m.p 
          variants={fadeDown} 
          className={cn(
            paragraph, 
            "text-charcoal/80 dark:text-off-white/80 leading-relaxed"
          )}
        >
          {overview.length > 180 ? `${overview.substring(0, 180)}...` : overview}
        </m.p>
        
        {/* Decorative holographic line */}
        <div className="holo-line h-1 w-full rounded-full bg-gradient-to-r from-baby-blue via-lavender to-soft-neon opacity-60"></div>
      </m.div>

      <Poster title={title} posterPath={posterPath} className="mr-auto" />
    </div>
  );
};

export default memo(HeroSlide);
