"use client";

import { memo } from "react";

// Move these from page.tsx to here
// const initialTotal = 4234567.89; // About $4.2M
// const ratePerSecond = 52.45; // About $4.5M per day

const HeroComponent = () => {
  return (
    <div className="layout w-full max-w-[1440px] mx-auto h-[120px] mb-[-50px] relative mt-10">
      {/* Hero removed as requested */}
    </div>
  );
};

export const Hero = memo(HeroComponent);

Hero.displayName = "Hero";
