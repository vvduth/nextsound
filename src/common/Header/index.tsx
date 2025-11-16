import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { BsMoonStarsFill } from "react-icons/bs";
import { AiOutlineMenu } from "react-icons/ai";
import { FiSun } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import throttle from "lodash.throttle";
import { Button } from "react-aria-components";

import { ThemeMenu, Logo } from "..";
import HeaderNavItem from "./HeaderNavItem";

import { useGlobalContext } from "@/context/globalContext";
import { useTheme } from "@/context/themeContext";
import { maxWidth } from "@/styles";
import { navLinks } from "@/constants";
import { THROTTLE_DELAY } from "@/utils/config";
import { cn } from "@/utils/helper";

interface HeaderProps {
  onOpenSearch?: () => void;
}

const Header = ({ onOpenSearch }: HeaderProps) => {
  const { openMenu, theme, showThemeOptions } = useTheme();
  const { setShowSidebar } = useGlobalContext();

  const [isActive, setIsActive] = useState<boolean>(false);
  const [isNotFoundPage, setIsNotFoundPage] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const handleBackgroundChange = () => {
      const body = document.body;
      if (
        window.scrollY > 0 ||
        (body.classList.contains("no-scroll") &&
          parseFloat(body.style.top) * -1 > 0)
      ) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    const throttledHandleBackgroundChange = throttle(
      handleBackgroundChange,
      THROTTLE_DELAY
    );

    window.addEventListener("scroll", throttledHandleBackgroundChange);

    return () => {
      window.removeEventListener("scroll", throttledHandleBackgroundChange);
    };
  }, []);

  useEffect(() => {
    if (location.pathname.split("/").length > 3) {
      setIsNotFoundPage(true);
    } else {
      setIsNotFoundPage(false);
    }
  }, [location.pathname]);

  return (
    <header
      className={cn(
        `md:py-[18px] py-[16px] fixed top-0 left-0 w-full z-10 transition-all duration-300`,
        isActive && (theme === "Dark" ? "header-bg--dark" : "header-bg--light")
      )}
    >
      <nav
        className={cn(maxWidth, `flex justify-between flex-row items-center`)}
      >
        <Logo
          logoColor={cn(
            isNotFoundPage
              ? "text-charcoal dark:text-off-white"
              : !isNotFoundPage && isActive
              ? "text-charcoal dark:text-off-white"
              : "text-off-white"
          )}
        />

        <div className="hidden md:flex flex-row gap-6 items-center">
          <ul className="flex flex-row gap-8 capitalize text-[14.75px] font-medium font-cyber">
            {navLinks.map((link: { title: string; path: string }) => {
              return (
                <HeaderNavItem
                  key={link.title}
                  link={link}
                  isNotFoundPage={isNotFoundPage}
                  showBg={isActive}
                />
              );
            })}
          </ul>

          {/* Search Button - Cyber Pastel Style */}
          <Button
            onPress={onOpenSearch}
            className={cn(
              "cyber-glow-ring flex items-center justify-center px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 font-cyber font-medium",
              isNotFoundPage || isActive
                ? "bg-gradient-to-r from-baby-blue/20 to-lavender/20 dark:from-lavender/20 dark:to-soft-neon/20 text-charcoal dark:text-off-white border border-baby-blue/40 dark:border-lavender/40 hover:shadow-cyber-glow backdrop-blur-xl"
                : "bg-off-white/10 backdrop-blur-md text-off-white hover:bg-off-white/20 border border-off-white/30 hover:shadow-lavender-glow"
            )}
          >
            <FiSearch className="w-4 h-4 mr-2" />
            <span className="text-sm">Search</span>
            <kbd className={cn(
              "ml-2 px-2 py-1 text-xs font-mono rounded-lg border font-semibold",
              isNotFoundPage || isActive
                ? "bg-baby-blue/10 dark:bg-lavender/10 border-baby-blue/30 dark:border-lavender/30 text-charcoal/70 dark:text-off-white/70"
                : "bg-off-white/10 border-off-white/20 text-off-white/80"
            )}>
              ⌘K
            </kbd>
          </Button>

          <div className="button relative">
            <button
              name="theme-menu"
              type="button"
              onClick={openMenu}
              id="theme"
              className={cn(
                `cyber-glow-ring flex items-center justify-center p-2.5 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-12`,
                isNotFoundPage || isActive
                  ? `bg-gradient-to-br from-pastel-cyan/20 to-lavender/20 dark:from-lavender/20 dark:to-soft-neon/20 text-charcoal dark:text-off-white border border-pastel-cyan/40 dark:border-lavender/40 hover:shadow-neon-soft`
                  : `bg-off-white/10 backdrop-blur-md text-off-white hover:bg-off-white/20 border border-off-white/30 hover:shadow-lavender-glow`
              )}
            >
              {theme === "Dark" ? <BsMoonStarsFill className="text-lg" /> : <FiSun className="text-lg" />}
            </button>
            <AnimatePresence>
              {showThemeOptions && <ThemeMenu />}
            </AnimatePresence>
          </div>
        </div>

        <button
          type="button"
          name="menu"
          className={cn(
            `cyber-glow-ring inline-block text-[22.75px] md:hidden p-2 rounded-full transition-all duration-300 hover:scale-110`,
            isNotFoundPage || isActive
              ? `bg-gradient-to-br from-baby-blue/20 to-lavender/20 dark:from-lavender/20 dark:to-soft-neon/20 text-charcoal dark:text-off-white border border-baby-blue/40 dark:border-lavender/40`
              : `bg-off-white/10 backdrop-blur-md text-off-white border border-off-white/30`
          )}
          onClick={() => setShowSidebar(true)}
        >
          <AiOutlineMenu />
        </button>
      </nav>
    </header>
  );
};

export default Header;
