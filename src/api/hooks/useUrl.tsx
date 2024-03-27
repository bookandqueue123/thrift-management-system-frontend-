import React from "react";

type UrlContextType = {
  preferredUrl: string;
  setPreferredUrl: (url: string) => void;
};

const UrlContext = React.createContext<UrlContextType | null>(null);

export const useUrl = () => {
  const context = React.useContext(UrlContext);
  if (!context) {
    throw new Error("useUrl must be used within a PreferredUrlProvider");
  }
  return context;
};

export const PreferredUrlProvider = ({ children }: { children: React.ReactNode }) => {
  const [preferredUrl, setPreferredUrl] = React.useState<string>("");
  return (
    <UrlContext.Provider value={{ preferredUrl, setPreferredUrl }}>
      {children}
    </UrlContext.Provider>
  );
};
