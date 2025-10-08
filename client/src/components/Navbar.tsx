"use client";

import { signOut } from "aws-amplify/auth";
import { useGetAuthUserQuery } from "@/state/api";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "./ui/button";
import { useState } from "react";
import LogoutConfirmation from "./LogoutConfirmation";
import { usePathname } from "next/navigation";
import { Playfair_Display, Lato } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const Navbar = () => {
  const pathname = usePathname();
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const { t, switchLanguage } = useLanguage();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/landing";
  };

  const handleSignOutClick = () => {
    setShowLogoutConfirm(true);
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200 h-[60px] flex items-center justify-between px-6 md:px-8">
        {/* Logo */}
        <Link
          href="/landing"
          className="flex items-center space-x-2 hover:text-blue-500 transition-colors font-bold text-xl"
        >
          <Image
            src="/eiffel-tower.png"
            alt="eiffel-tower"
            width={45}
            height={45}
            className="drop-shadow-sm transition-transform hover:-translate-y-1"
          />
          <span className={`${playfair.className} hidden sm:block`}>{t("title")}</span>
        </Link>

        {/* Right side of Navbar */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
          {/* Language switch */}
          <label className="relative inline-block w-[50px] h-[24px] hover:cursor-pointer">
            <input
              type="checkbox"
              onChange={switchLanguage}
              className="sr-only peer"
            />
            <div className="absolute inset-0 bg-gray-200 rounded-full shadow-inner transition peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-green-500"></div>
            <div className="absolute h-[18px] w-[18px] bg-white rounded-full left-[3px] bottom-[3px] shadow transition-transform peer-checked:translate-x-[26px]"></div>
            <span className={`${lato.className} absolute right-[7px] bottom-[3px] text-[10px] font-bold text-gray-600 peer-checked:left-[7px] peer-checked:right-auto peer-checked:text-white transition-all`}>
              {t("langShort")}
            </span>
          </label>

          {/* Authenticated links */}
          {authUser ? (
            <>
              <Link href="/search">
                <Button
                  className={`${lato.className} relative cursor-pointer font-medium px-3 py-2 rounded-lg transition-all duration-300
      ${
        pathname === "/search"
          ? "text-blue-500 bg-blue-50 hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-200 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-[70%] after:h-[2px] after:bg-gradient-to-r after:from-blue-500 after:to-green-500 after:-translate-x-1/2"
          : "text-black bg-white hover:text-blue-500 hover:bg-blue-50 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-blue-500 after:to-green-500 after:opacity-0 hover:after:w-[70%] hover:after:opacity-100 after:-translate-x-1/2 after:transition-all after:duration-300"
      }`}
                >
                  {t("discover")}
                </Button>
              </Link>

              <Link href="/bookmarks">
                <Button
                  className={`${lato.className} relative cursor-pointer font-medium px-3 py-2 rounded-lg transition-all duration-300
      ${
        pathname === "/bookmarks"
          ? "text-blue-500 bg-blue-50 hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-200 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-[70%] after:h-[2px] after:bg-gradient-to-r after:from-blue-500 after:to-green-500 after:-translate-x-1/2"
          : "text-black bg-white hover:text-blue-500 hover:bg-blue-50 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-blue-500 after:to-green-500 after:opacity-0 hover:after:w-[70%] hover:after:opacity-100 after:-translate-x-1/2 after:transition-all after:duration-300"
      }`}
                >
                  {t("bookmarks")}
                </Button>
              </Link>

              <Button
                variant="outline"
                onClick={handleSignOutClick}
                className={`${lato.className} text-gray-600 hover:text-red-500 hover:bg-red-50 px-3 py-2 text-sm hover:cursor-pointer`}
              >
                {t("logout")}
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/signin">
                <Button className={`${lato.className} bg-white hover:bg-gray-200 text-black border border-black rounded-lg hover:cursor-pointer`}>
                  {t("loginTitle")}
                </Button>
              </Link>
              <Link href="/signup">
                <Button className={`${lato.className} bg-blue-500 hover:bg-blue-600 text-white rounded-lg hover:cursor-pointer`}>
                  {t("registerButton")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {showLogoutConfirm && (
        <LogoutConfirmation
          onConfirm={handleSignOut}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </>
  );
};

export default Navbar;
