"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  useGetBookmarksQuery,
  useDeleteBookmarkMutation,
  useGetAuthUserQuery,
} from "@/state/api";
import { MapPin, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";

const Bookmarks = () => {
  const { t } = useLanguage();
  const { data: authUser } = useGetAuthUserQuery();
  const { data: bookmarks } = useGetBookmarksQuery(
    authUser ? { user: authUser } : skipToken
  );
  const [deleteBookmarkMutation] = useDeleteBookmarkMutation();
  const router = useRouter();

  const deleteBookmark = async (inseeCode: string) => {
    if (!authUser?.cognitoId) return;
    try {
      await deleteBookmarkMutation({
        inseeCode,
        cognitoId: authUser?.cognitoId || "",
      });
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(rgba(255,255,255,0.75),rgba(255,255,255,0)),url('/nighttime-paris-2-blur.jpg')] bg-cover bg-center bg-fixed relative flex flex-col pb-8">
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-8 mt-0">
        <h2 className="text-2xl text-center text-gray-800 relative pb-3 mt-4 mb-6 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[60px] after:h-[3px] after:bg-gradient-to-r after:from-blue-500 after:to-red-600 after:rounded">
          {t("bookmarksTitle")}
        </h2>

        {bookmarks?.length === 0 && (
          <p className="text-[1.1rem] text-gray-500 text-center py-8">
            {t("noBookmarks")}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-4 sm:grid sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:gap-6">
          {bookmarks?.map((bookmark: any, idx: number) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl p-6 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg flex justify-between items-center gap-3 sm:flex-col sm:items-start"
            >
              <h3 className="text-lg font-semibold text-gray-800 sm:mb-4 w-full">
                {bookmark.cities.nomStandard}
              </h3>
              <p className="-mt-4 text-sm text-gray-500">
                {bookmark.cities.depNom} - {bookmark.cities.regNom}
              </p>
              <div className="flex gap-2 sm:w-full sm:justify-between">
                <button
                  className="flex items-center gap-2 bg-blue-100 text-blue-500 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-blue-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 sm:flex-1 sm:justify-center sm:px-2 sm:py-2 hover:cursor-pointer"
                  onClick={() =>
                    router.push(
                      `/search?insee=${bookmark.cities.codeInsee}&latitude=${bookmark.cities.latitudeMairie}&longitude=${bookmark.cities.longitudeMairie}&location=${bookmark.cities.nomStandard}`
                    )
                  }
                  aria-label={`${t("view")} ${bookmark.cities.nomStandard}`}
                >
                  <MapPin size={15} />
                  <span className="hidden sm:inline">{t("view")}</span>
                </button>
                <button
                  className="flex items-center gap-2 bg-red-100 text-red-500 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-red-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 sm:flex-1 sm:justify-center sm:px-2 sm:py-2 hover:cursor-pointer"
                  onClick={() => deleteBookmark(bookmark.cities.codeInsee)}
                  aria-label={`${t("delete")} ${bookmark.cities.nomStandard}`}
                >
                  <Trash2 size={15} />
                  <span className="hidden sm:inline">{t("delete")}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
