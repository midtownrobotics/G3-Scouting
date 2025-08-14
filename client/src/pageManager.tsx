import { createContext, useContext, useEffect, useState } from "react";
import Home from "./pages/home/Home";
import Settings from "./pages/settings/Settings";
import Admin from "./pages/admin/Admin";
import Data from "./pages/data/Data";
import Forms from "./pages/forms/Forms";
import Lead from "./pages/lead/Lead";
import { PageKey } from "@shared/types";
import FormMaker from "./pages/form-maker/FormMaker";
import ShiftTracker from "./pages/ShiftTracker";

/** Gets the JSX element for a page from its respective {@link PageKey}. */
export const getPageFromKey = (pageKey: PageKey) => {
    if (pageKey === "admin") return <Admin />;
    if (pageKey === "settings") return <Settings />;
    if (pageKey === "data") return <Data />;
    if (pageKey === "forms") return <Forms />;
    if (pageKey === "lead") return <Lead />;
    if (pageKey === "form-maker") return <FormMaker />;
    if (pageKey === "home") return <Home />;
    if (pageKey === "shift-tracker") return <ShiftTracker />;

    const { setPageKey } = usePage();
    setPageKey("home");
};

const PageContext = createContext<{
    pageKey: PageKey;
    setPageKey: (k: PageKey) => void;
    pageInstance: number;
}>({} as any);

export function PageProvider({ children }: { children: React.ReactNode; }) {
    const urlParam = new URLSearchParams(window.location.search).get("page") as PageKey | null;
    const defaultKey = urlParam ?? "" as PageKey;

    const [pageKey, setPageKeyState] = useState<PageKey>(defaultKey);
    const [pageInstance, setPageInstance] = useState(0);

    useEffect(() => {
        const handlePopState = () => {
            const url = new URL(window.location.href);
            setPageKey((url.searchParams.get("page") ?? "") as PageKey)
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

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
        url.search = '';
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
