import { useState, useEffect } from "react";

import Logo from "../Logo";
import { maxWidth } from "@/styles";
import { cn } from "@/utils/helper";

const musicQuotes = [
  {
    quote: "Music is the universal language of mankind.",
    author: "Henry Wadsworth Longfellow"
  },
  {
    quote: "Without music, life would be a mistake.",
    author: "Friedrich Nietzsche"
  },
  {
    quote: "Music can change the world because it can change people.",
    author: "Bono"
  },
  {
    quote: "Where words fail, music speaks.",
    author: "Hans Christian Andersen"
  },
  {
    quote: "Music is my religion.",
    author: "Jimi Hendrix"
  },
  {
    quote: "Music is the soundtrack of your life.",
    author: "Dick Clark"
  },
  {
    quote: "Music is the wine which inspires one to new generative processes.",
    author: "Ludwig van Beethoven"
  },
  {
    quote: "Music is the art which is most nigh to tears and memory.",
    author: "Oscar Wilde"
  },
  {
    quote: "Music is love in search of a word.",
    author: "Sidney Lanier"
  },
  {
    quote: "Music is the only language in which you cannot say a mean or sarcastic thing.",
    author: "John Erskine"
  }
];

const Footer: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % musicQuotes.length);
    }, 8000); // Change quote every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="cyber-glow-ring relative bg-gradient-to-br from-off-white/80 via-baby-blue/20 to-pastel-cyan/30 dark:from-charcoal/90 dark:via-deep-dark dark:to-lavender/20 backdrop-blur-xl lg:py-16 sm:py-10 xs:py-8 py-[30px] w-full border-t-2 border-baby-blue/30 dark:border-lavender/30 overflow-hidden">
      {/* Holographic background effect */}
      <div className="absolute inset-0 holo-effect opacity-20 pointer-events-none"></div>
      
      <div
        className={cn(
          maxWidth,
          "relative flex flex-col items-center lg:gap-12 md:gap-10 sm:gap-8 xs:gap-6 gap-4"
        )}
      >
        <Logo logoColor="text-charcoal dark:text-off-white" />
        <div className="text-center max-w-3xl px-4">
          <blockquote className="text-charcoal dark:text-off-white font-cyber font-light italic md:text-xl sm:text-lg text-base leading-relaxed mb-4 relative">
            <span className="absolute -left-2 -top-2 text-4xl text-baby-blue/40 dark:text-lavender/40">"</span>
            {musicQuotes[currentQuote].quote}
            <span className="absolute -right-2 -bottom-4 text-4xl text-lavender/40 dark:text-soft-neon/40">"</span>
          </blockquote>
          <cite className="text-charcoal/70 dark:text-off-white/70 font-cyber font-medium md:text-base sm:text-sm text-xs text-right block">
            — {musicQuotes[currentQuote].author}
          </cite>
        </div>
        
        {/* Decorative glowing line */}
        <div className="holo-line h-1 w-48 rounded-full bg-gradient-to-r from-baby-blue via-lavender to-soft-neon opacity-60"></div>
        
        <p className="text-xs font-cyber text-charcoal/60 dark:text-off-white/60 mt-4">
          &copy; 2025 NextSound. Discover your next favorite track.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
