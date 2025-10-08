import React from "react";
import Navbar from "@/components/Navbar";
import LanguageProvider from "@/context/LanguageContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full">
      <LanguageProvider initialLanguage={"en"}>
        <Navbar />
        <main className={`h-full w-full`} style={{ paddingTop: "60px" }}>
          {children}
        </main>
      </LanguageProvider>
    </div>
  );
};

export default Layout;
