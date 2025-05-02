import { createContext, useContext, useState } from "react";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Admin from "./pages/admin/Admin";
import Data from "./pages/Data";
import Forms from "./pages/Forms";

export type PageKey = "home" | "admin" | "data" | "forms" | "settings";

/** Gets the JSX element for a page from its respective {@link PageKey}. */
export const getPageFromKey = (pageKey: PageKey) => {
    if (pageKey == "admin") return <Admin />;
    if (pageKey == "settings") return <Settings />;
    if (pageKey == "data") return <Data />;
    if (pageKey == "forms") return <Forms />;
    return <Home />;
}

const PageContext = createContext<
  { pageKey: PageKey; setPageKey: (k: PageKey) => void } | undefined
>(undefined);

export const PageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const urlParam = new URLSearchParams(window.location.search).get("page") as PageKey | null;
  const defaultKey = urlParam ?? "" as PageKey;

  const [pageKey, setPageKey] = useState<PageKey>(defaultKey);

  return (
    <PageContext.Provider value={{ pageKey, setPageKey }}>
      {children}
    </PageContext.Provider>
  );
};

export const usePage = () => {
  const context = useContext(PageContext);
  if (!context) throw new Error("usePage must be used within a PageProvider");

  const setPageKey = (key: PageKey) => {
    context.setPageKey(key);
    const url = new URL(window.location.href);
    url.searchParams.set("page", key);
    window.history.pushState({}, "", url.toString());
  };

  return { pageKey: context.pageKey, setPageKey };
};