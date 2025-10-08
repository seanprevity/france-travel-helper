import React from "react";
import About from "./About";
import HeroSection from "./HeroSection";
import FeaturedCities from "./FeaturedCities";
import HowToUseSection from "./HowToUse";
import CallToAction from "./CallToAction";
import FooterSection from "./FooterSection";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <About />
      <FeaturedCities />
      <HowToUseSection />
      <CallToAction />
      <FooterSection />
    </div>
  );
};

export default Landing;
