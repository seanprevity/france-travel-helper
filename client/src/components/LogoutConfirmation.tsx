"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

const LogoutConfirmation = ({ onConfirm, onCancel }: Props) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h3 className="text-lg font-semibold text-center mb-6">
          {t("logoutConfirm")}
        </h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-200 transition hover:cursor-pointer"
          >
            {t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-700 transition hover:cursor-pointer"
          >
            {t("logout")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation;
