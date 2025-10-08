"use client";

import StoreProvider from "@/state/redux";
import { Authenticator } from "@aws-amplify/ui-react";
import Auth from "./(auth)/authProvider";
import LanguageProvider from "@/context/LanguageContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <LanguageProvider initialLanguage={"en"}>
      <StoreProvider>
        <Authenticator.Provider>
          <Auth>{children}</Auth>
        </Authenticator.Provider>
      </StoreProvider>
    </LanguageProvider>
  );
};

export default Providers;
