import { createContext, useContext, useState } from "react";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Admin from "./pages/admin/Admin";
import Data from "./pages/Data";
import Forms from "./pages/forms/Forms";

export type PageKey = "home" | "admin" | "data" | "forms" | "settings";

/** Gets the JSX element for a page from its respective {@link PageKey}. */
export const getPageFromKey = (pageKey: PageKey) => {
    if (pageKey == "admin") return <Admin />;
    if (pageKey == "settings") return <Settings />;
    if (pageKey == "data") return <Data />;
    if (pageKey == "forms") return <Forms />;

    return <Home />;
}

const PageContext = createContext<{
    pageKey: PageKey;
    setPageKey: (k: PageKey) => void;
    pageInstance: number;
}>({} as any);

export const PageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const urlParam = new URLSearchParams(window.location.search).get("page") as PageKey | null;
    const defaultKey = urlParam ?? "" as PageKey;

    const [pageKey, setPageKeyState] = useState<PageKey>(defaultKey);
    const [pageInstance, setPageInstance] = useState(0);

    const setPageKey = (key: PageKey) => {
        setPageKeyState(prev => {
            if (prev === key) {
                // Same page, force refresh
                setPageInstance(p => p + 1);
                return prev;
            } else {
                setPageInstance(0); // reset counter for new page
                return key;
            }
        });

        const url = new URL(window.location.href);
        url.searchParams.delete("form");
        url.searchParams.set("page", key);
        window.history.pushState({}, "", url.toString());
    };

    return (
        <PageContext.Provider value={{ pageKey, setPageKey, pageInstance }}>
            {children}
        </PageContext.Provider>
    );
};

export const usePage = () => {
    const context = useContext(PageContext);
    if (!context) throw new Error("usePage must be used within a PageProvider");

    return {
        pageKey: context.pageKey,
        setPageKey: context.setPageKey,
        pageInstance: context.pageInstance,
    };
};
