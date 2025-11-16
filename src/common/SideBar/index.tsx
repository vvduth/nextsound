import React, { useCallback } from "react";
import { AnimatePresence, m } from "framer-motion";

import SidebarNavItem from "./SidebarNavItem";
import ThemeOption from "./SidebarThemeOption";
import Logo from "../Logo";
import Overlay from "../Overlay";

import { useGlobalContext } from "@/context/globalContext";
import { useTheme } from "@/context/themeContext";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useMotion } from "@/hooks/useMotion";
import { navLinks, themeOptions } from "@/constants";
import { sideBarHeading } from "@/styles";
import { INavLink } from "@/types";
import { cn } from "@/utils/helper";

const SideBar: React.FC = () => {
  const { showSidebar, setShowSidebar } = useGlobalContext();
  const { theme } = useTheme();
  const { slideIn } = useMotion();

  const closeSideBar = useCallback(() => {
    setShowSidebar(false);
  }, [setShowSidebar]);

  const { ref } = useOnClickOutside({
    action: closeSideBar,
    enable: showSidebar
  });

  return (
    <AnimatePresence>
      {showSidebar && (
        <Overlay>
          <m.nav
            variants={slideIn("right", "tween", 0, 0.3)}
            initial="hidden"
            animate="show"
            exit="hidden"
            ref={ref}
            className={cn(
              `cyber-glow-ring fixed top-0 right-0 sm:w-[40%] xs:w-[240px] w-[220px] h-full z-25 overflow-y-auto md:hidden p-6 pb-0 font-cyber`,
              theme === "Dark" 
                ? "bg-gradient-to-br from-charcoal/90 to-deep-dark/95 backdrop-blur-3xl border-l-2 border-lavender/30 text-off-white shadow-cyber-glow" 
                : "bg-gradient-to-br from-off-white/90 to-baby-blue/20 backdrop-blur-3xl border-l-2 border-baby-blue/40 text-charcoal shadow-float"
            )}
          >
            <div className="flex items-center justify-center  ">
              <Logo />
            </div>

            <div className="p-4 sm:pt-8 xs:pt-6 pt-[22px] h-full flex flex-col">
              <h3 className={cn(sideBarHeading, "text-transparent bg-clip-text bg-gradient-to-r from-baby-blue via-lavender to-soft-neon font-bold tracking-wide")}>Menu</h3>
              <ul className="flex flex-col sm:gap-3 xs:gap-2 gap-1.5 capitalize xs:text-[14px] text-[13.5px] font-semibold">
                {navLinks.map((link: INavLink) => {
                  return (
                    <SidebarNavItem
                      link={link}
                      closeSideBar={closeSideBar}
                      key={link.title.replaceAll(" ", "")}
                    />
                  );
                })}
              </ul>

              <h3 className={cn(`mt-6`, sideBarHeading, "text-transparent bg-clip-text bg-gradient-to-r from-pastel-cyan via-lavender to-glow-pink font-bold tracking-wide")}>Theme</h3>
              <ul className="flex flex-col sm:gap-3 xs:gap-2 gap-1.5 capitalize text-[14.75px] font-semibold">
                {themeOptions.map((theme) => {
                  return <ThemeOption theme={theme} key={theme.title} />;
                })}
              </ul>

              <p className="xs:text-[12px] text-[11.75px] mt-auto sm:mb-6 mb-[20px] text-center font-cyber opacity-70">
                &copy; 2025 NextSound. All rights reserved.
              </p>
            </div>
          </m.nav>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default SideBar;
