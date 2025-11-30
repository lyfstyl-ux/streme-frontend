"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MiniAppTutorialModal } from "./MiniAppTutorialModal";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { HowItWorksModal } from "./HowItWorksModal";
import { SearchBar } from "./SearchBar";
import { useWallet } from "../hooks/useWallet";
import { HeaderRewards } from "./HeaderRewards";

export function Navbar() {
  // Use new simplified wallet hook
  const { isConnected, address, connect, disconnect, isMiniApp, isLoading } =
    useWallet();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddressDropdownOpen, setIsAddressDropdownOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Easter egg function for logo clicking (desktop only - mini-app handling moved to app.tsx)
  const handleLogoClick = () => {
    if (!isMiniApp) {
      router.push("/crowdfund/0x3b3cd21242ba44e9865b066e5ef5d1cc1030cc58");
    }
  };

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

  // const handleMiniAppConnect = () => {
  //   const fcConnector = wagmiConnectors.find((c) => c.id === "farcaster");
  //   if (fcConnector) {
  //     wagmiConnect({ connector: fcConnector });
  //   } else {
  //     console.warn(
  //       "Farcaster connector not found. Ensure it's configured in WagmiProvider.tsx and active in the Farcaster client."
  //     );
  //     if (wagmiConnectors.length > 0) {
  //       // wagmiConnect({ connector: wagmiConnectors[0] });
  //     }
  //   }
  // };

  // Mini-app navigation is now handled in app.tsx
  if (isMiniApp) {
    return null;
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-base-100 border-b border-base-300/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo (responsive) */}
            <Link href="/" className="flex-shrink-0">
              {isDark ? (
                <div className="relative w-auto h-4 md:h-5">
                  <Image
                    src="/streme-text-white.svg"
                    alt="youBuidl"
                    fill
                    className="object-contain cursor-pointer"
                    onClick={handleLogoClick}
                    priority
                  />
                </div>
              ) : (
                <div className="relative w-auto h-5 md:h-6">
                  <Image
                    src="/streme-text-black.svg"
                    alt="youBuidl"
                    fill
                    className="object-contain cursor-pointer"
                    onClick={handleLogoClick}
                    priority
                  />
                </div>
              )}
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8 flex-1 ml-12">
              <Link href="/launch" className="btn btn-primary btn-sm">
                Launch a Token
              </Link>
              
              <div className="flex-1 max-w-md">
                <SearchBar value={searchValue} onChange={setSearchValue} />
              </div>
              <div className="ml-4">
                <HeaderRewards />
              </div>
            </div>

            {/* Right side - Theme, Tutorial, Connect/Account */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setIsTutorialOpen(true)}
                className="btn btn-ghost btn-circle btn-sm"
                title="Tutorial"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              <ThemeSwitcher />

              {isConnected ? (
                <div className="relative">
                  <button
                    onClick={() =>
                      setIsAddressDropdownOpen(!isAddressDropdownOpen)
                    }
                    className="btn btn-ghost btn-sm gap-2"
                    disabled={!address || isLoading}
                  >
                    {address
                      ? truncateAddress(address)
                      : isLoading
                      ? "Connecting..."
                      : "No Address"}
                  </button>
                  {isAddressDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-base-100 rounded-lg shadow-lg border border-base-300 z-50">
                      <Link
                        href="/tokens"
                        onClick={() => setIsAddressDropdownOpen(false)}
                        className="block w-full px-4 py-2 text-left hover:bg-base-200 cursor-pointer"
                      >
                        My Tokens
                      </Link>
                      <Link
                        href="/launched-tokens"
                        onClick={() => setIsAddressDropdownOpen(false)}
                        className="block w-full px-4 py-2 text-left hover:bg-base-200 cursor-pointer"
                      >
                        Launched Tokens
                      </Link>
                      <button
                        onClick={() => {
                          disconnect();
                          setIsAddressDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-base-200 rounded-lg cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={connect}
                  className="btn btn-ghost btn-sm"
                  disabled={isLoading}
                >
                  {isLoading ? "Connecting..." : "Connect"}
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsTutorialOpen(true)}
                className="btn btn-ghost btn-sm btn-circle"
                title="Tutorial"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="btn btn-ghost btn-sm"
                aria-label="Toggle menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-base-300/20 bg-base-100/95 backdrop-blur-sm">
              <div className="px-2 py-4 space-y-2">
                <Link
                  href="/launch"
                  className="btn btn-primary w-full justify-start"
                >
                  Launch a Token
                </Link>
                <div className="px-2 py-2">
                  <SearchBar value={searchValue} onChange={setSearchValue} />
                </div>
                {isConnected && (
                  <Link
                    href="/tokens"
                    className="btn btn-ghost w-full justify-start"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Tokens
                  </Link>
                )}
                {isConnected && (
                  <Link
                    href="/launched-tokens"
                    className="btn btn-ghost w-full justify-start"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Launched Tokens
                  </Link>
                )}
                <div className="px-2 py-2">
                  <ThemeSwitcher />
                </div>
                {isConnected ? (
                  <button
                    onClick={() => {
                      disconnect();
                      setIsMenuOpen(false);
                    }}
                    className="btn btn-ghost w-full justify-start"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      connect();
                      setIsMenuOpen(false);
                    }}
                    className="btn btn-ghost w-full justify-start"
                    disabled={isLoading}
                  >
                    {isLoading ? "Connecting..." : "Connect"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
      <MiniAppTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        onSkip={() => setIsTutorialOpen(false)}
      />
    </>
  );
}
