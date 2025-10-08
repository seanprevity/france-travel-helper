"use client";

import React, { useState } from "react";
import {
  useGetCityByInseeQuery,
  useGetAuthUserQuery,
  useCheckBookmarkQuery,
  useGetDescriptionQuery,
  useGetImagesQuery,
  useSetBookmarkMutation,
} from "@/state/api";
import { useAppSelector } from "@/state/redux";
import { skipToken } from "@reduxjs/toolkit/query";
import { useLanguage } from "@/context/LanguageContext";
import Weather from "./Weather";
import ImageModal from "./ImageModal";
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

const Descriptions = () => {
  const { data: user } = useGetAuthUserQuery();
  const { t, language } = useLanguage();
  const filters = useAppSelector((state) => state.global.filters);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [setBookmark] = useSetBookmarkMutation();
  const { data: city } = useGetCityByInseeQuery(
    filters.insee && filters.insee !== "any"
      ? { insee: filters.insee }
      : skipToken
  );
  const { data: isBookmarked } = useCheckBookmarkQuery(
    filters.insee && filters.insee !== "any" && user
      ? { user: user, insee: filters.insee }
      : skipToken
  );
  const [isSaved, setIsSaved] = useState(isBookmarked);
  const { data: description, isLoading } = useGetDescriptionQuery(
    filters.insee && filters.insee !== "any"
      ? { insee: filters.insee, lang: language }
      : skipToken
  );
  const { data: images } = useGetImagesQuery(
    filters.insee && filters.insee !== "any"
      ? { insee: filters.insee }
      : skipToken
  );

  const interpolate = (
    str: string,
    vars: Record<string, string | number | undefined>
  ): string =>
    Object.entries(vars).reduce(
      (s, [key, val]) =>
        s.replace(new RegExp(`{{${key}}}`, "g"), String(val ?? "")),
      str
    );

  const parseDescription = (text: string) => {
    const structuredMatch = text.match(
      /DESCRIPTION:\s*([\s\S]*?)\s*HISTORY:\s*([\s\S]*?)\s*ATTRACTIONS:\s*([\s\S]+)/i
    );

    if (structuredMatch) {
      const mainDescription = structuredMatch[1].trim();
      const history = structuredMatch[2].trim();
      const attractionsRaw = structuredMatch[3].trim();

      const attractions = attractionsRaw
        .split("\n")
        .filter((line) => /^\d+\./.test(line.trim()))
        .map((line) => line.replace(/^\d+\.\s*/, "").trim());

      return { mainDescription, history, attractions };
    }
  };

  const {
    mainDescription = "",
    history = "",
    attractions = [],
  } = parseDescription(description?.description ?? "") ?? {};

  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  React.useEffect(() => {
    if (typeof isBookmarked === "boolean") {
      setIsSaved(isBookmarked);
    }
  }, [isBookmarked]);

  const toggleBookmark = async () => {
    if (!city || !user) return;
    await setBookmark({
      inseeCode: filters.insee,
      cognitoId: user.cognitoId,
      state: !isSaved,
    });
    setIsSaved(!isSaved);
  };

  if (!city) return <div className="flex flex-col h-full overflow-y-auto p-6 bg-gray-100 rounded-xl">{t("selectCityDescription")}</div>;
  if (isLoading) return <div>{t("loading")}</div>;

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 bg-gray-100 rounded-xl">
      {/* City */}
      <div className="mb-6">
        <h4 className={` text-sm uppercase text-gray-500 mb-2 tracking-wide`}>
          {t("city")}
        </h4>
        <h3 className={`${playfair.className} text-2xl font-semibold text-gray-800 mb-2`}>
          {city?.nomStandard}
        </h3>
        <p className={`${lato.className} text-sm text-gray-500 mb-2`}>
          {interpolate(t("locationSentence"), {
            department: city?.depNom,
            region: city?.regNom,
          })}
        </p>
      </div>

      {city?.latitudeMairie != null && city?.longitudeMairie != null && (
        <Weather lat={city.latitudeMairie} lon={city.longitudeMairie} />
      )}

      {/* Images */}
      {images && (
        <div className="mb-6">
          <h4 className="text-sm uppercase text-gray-500 mb-2 tracking-wide">
            {t("images")}
          </h4>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2 mt-2">
            {images?.map((image, index) => (
              <div
                key={index}
                className="h-20 rounded overflow-hidden border border-gray-200 cursor-pointer transition-transform duration-200 hover:scale-105 shadow-sm"
                onClick={() => openImageModal(index)}
              >
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.description || city?.nomStandard}
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="mb-6">
        <h4 className={` text-sm uppercase text-gray-500 mb-2 tracking-wide`}>
          {t("description")}
        </h4>
        <p className={`${lato.className} text-base leading-relaxed text-gray-600 mb-4`}>
          {mainDescription
            ? mainDescription
            : interpolate(t("noInfoMessage"), { town: city?.nomStandard })}
        </p>
      </div>

      {/* History */}
      {history && (
        <div className="mb-6">
          <h4 className={` text-sm uppercase text-gray-500 mb-2 tracking-wide`}>
            {t("history")}
          </h4>
          <p className={`${lato.className} text-base leading-relaxed text-gray-600`}>{history}</p>
        </div>
      )}

      {/* Attractions */}
      <div className="mb-6">
        <h4 className={` text-sm uppercase text-gray-500 mb-2 tracking-wide`}>
          {t("topAttractions")}
        </h4>
        <ul className="list-none p-0 m-0">
          {attractions.map((item: string, i: number) => (
            <li key={i} className={`${lato.className} flex mb-3 text-gray-600 leading-snug`}>
              <span className="font-semibold text-blue-500 mr-2 min-w-[1.5rem]">
                {i + 1}.
              </span>{" "}
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* External Links (Wikipedia and VilleDeReve) */}
      <div></div>

      {/* Bottom Bar */}
      <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between items-center">
        {/* Bookmark */}
        {user && (
          <button
            onClick={toggleBookmark}
            className={`${lato.className} flex items-center px-4 py-2 rounded font-medium transition border-none hover:cursor-pointer ${
              isSaved
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            📌 {isSaved ? t("saved") : t("save")}
          </button>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && images && images.length > 0 && (
        <ImageModal
          images={images}
          initialIndex={currentImageIndex}
          onClose={closeImageModal}
        />
      )} 
    </div>
  );
};

export default Descriptions;
