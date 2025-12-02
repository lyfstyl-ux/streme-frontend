"use client";

import Link from "next/link";
import Image from "next/image";
import { StreamingBalance } from "./StreamingBalance";
import { usePostHog } from "posthog-js/react";
import { memo, useCallback, useEffect, useState } from "react";

interface MiniAppTopNavbarProps {
  isConnected: boolean;
  onLogoClick?: () => void;
}

function MiniAppTopNavbarComponent({
  isConnected,
  onLogoClick,
}: MiniAppTopNavbarProps) {
  const postHog = usePostHog();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const htmlElement = document.documentElement;
      const dataTheme = htmlElement.getAttribute("data-theme");
      const hasClassDark = htmlElement.classList.contains("dark");
      const isDarkMode = dataTheme === "dark" || hasClassDark;

      setIsDark((prevIsDark) =>
        prevIsDark !== isDarkMode ? isDarkMode : prevIsDark
      );
    };

    checkDarkMode();

    const observer = new MutationObserver((mutations) => {
      const relevantChange = mutations.some(
        (mutation) =>
          mutation.type === "attributes" &&
          (mutation.attributeName === "data-theme" ||
            mutation.attributeName === "class")
      );

      if (relevantChange) {
        checkDarkMode();
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", checkDarkMode);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", checkDarkMode);
    };
  }, []);

  // No tutorial icon in mini-app navbar per request

  return (
    <div className="fixed top-0 left-0 right-0 flex items-center justify-between py-4 px-8 z-40 bg-base-100/80 backdrop-blur-sm">
      <div className="flex-shrink-0">
        <Link href="/" className="flex items-center">
          {isDark ? (
                <div className="relative w-auto h-4 md:h-5">
                  <Image
                    src="/streme-text-white.svg"
                    alt="youBuidl"
                    fill
                    className={onLogoClick ? "object-contain cursor-pointer" : "object-contain"}
                    onClick={onLogoClick}
                    priority
                  />
                </div>
              ) : (
                <div className="relative w-auto h-4 md:h-5">
                  <Image
                    src="/streme-text-black.svg"
                    alt="youBuidl"
                    fill
                    className={onLogoClick ? "object-contain cursor-pointer" : "object-contain"}
                    onClick={onLogoClick}
                    priority
                  />
                </div>
              )}
        </Link>
      </div>
      <div />
    </div>
  );
}

// Memoization comparison function - only re-render if props actually change
const arePropsEqual = (
  prevProps: MiniAppTopNavbarProps,
  nextProps: MiniAppTopNavbarProps
) => {
  return (
    prevProps.isConnected === nextProps.isConnected &&
    prevProps.onLogoClick === nextProps.onLogoClick
  );
};

// Export memoized component to prevent unnecessary re-renders
export const MiniAppTopNavbar = memo(MiniAppTopNavbarComponent, arePropsEqual);
