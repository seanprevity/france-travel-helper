"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { Globe } from "lucide-react";
import { FaInstagram, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
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

const FooterSection = () => {
  const { t } = useLanguage();

  return (
    <div className="relative border-t border-gray-600 py-5 px-4">
      {/* Links + Contact Columns */}
      <div className="flex flex-col items-start gap-8 md:flex-row md:justify-center md:gap-24 text-center mb-10">
        {/* Links Section */}
        <div className="flex flex-col items-center gap-3">
          <h3 className={`${playfair.className} text-lg font-semibold`}>{t("footerLinksTitle")}</h3>
          <div className="flex flex-col items-center gap-1">
            <Link className={`${lato.className}`} href="/">{t("footerLinkHome")}</Link>
            <Link className={`${lato.className}`} href="/map">{t("footerLinkMap")}</Link>
            <Link className={`${lato.className}`} href="/map">{t("footerLinkCities")}</Link>
            <Link className={`${lato.className}`} href="/#about">{t("footerLinkAbout")}</Link>
          </div>
        </div>

        {/* Contact Section */}
        <div className="flex flex-col items-center gap-3">
          <h3 className={`${playfair.className} text-lg font-semibold`}>{t("footerContactTitle")}</h3>
          <div className="flex flex-col items-center gap-1">
            <p className={`${lato.className}`}>{t("footerContactEmail")}</p>
            <div className="flex items-center gap-2">
              <Globe size={16} />
              <span className={`${lato.className}`}>{t("footerLanguage")}</span>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="flex flex-col items-center gap-3">
          <h3 className={`${playfair.className} text-lg font-semibold`}>{t("footerSocialTitle")}</h3>
          <div className="flex flex-col items-center gap-3">
            <Link href="https://www.instagram.com/">
              <FaInstagram size={20} className="text-pink-500" />
            </Link>
            <Link href="https://x.com">
              <FaTwitter size={20} className="text-sky-500" />
            </Link>
            <Link href="https://linkedin.com/in/sean-previty-64439b2b9">
              <FaLinkedin size={20} className="text-blue-500" />
            </Link>
            <Link href="https://github.com/seanprevity">
              <FaGithub size={20} className="text-black" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Bottom Links */}
      <div className="text-center text-sm border-gray-600 py-0 space-x-4">
        <span className={`${lato.className} text-gray-800`}>
          {t("footerCopyright")} &copy; {new Date().getFullYear()}
        </span>
        <Link className={`${lato.className}`} href="/privacy">Privacy Policy</Link>
        <Link className={`${lato.className}`} href="/terms">Terms of Service</Link>
      </div>
    </div>
  );
};

export default FooterSection;
