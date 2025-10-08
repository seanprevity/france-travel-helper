"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import LanguageProvider from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { useAuthenticator } from "@aws-amplify/ui-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { authStatus } = useAuthenticator((context) => [
    context.user,
    context.authStatus,
  ]);
  const router = useRouter();

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.replace("/landing");
    }
  }, [authStatus, router]);

  if (authStatus === "configuring" || authStatus === "unauthenticated") {
    return null;
  }

  return (
    <div className="h-full w-full">
      <LanguageProvider initialLanguage={"en"}>
        <Navbar />
        <main className="h-full w-full" style={{ paddingTop: "60px" }}>
          {children}
        </main>
      </LanguageProvider>
    </div>
  );
};

export default Layout;
