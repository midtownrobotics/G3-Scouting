import React, { createContext, JSX, useContext, useState } from "react";
import Home from "./pages/Home";

type Page = {
    key: string,
    component: JSX.Element
}

export const PAGES: Page[] = [
    { key: "home", component: <Home /> }
];

interface PageContextType {
    page: Page;
    setPage: React.Dispatch<React.SetStateAction<Page>>;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export const PageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const urlParams = new URLSearchParams(window.location.search)
    const defaultPage: Page = PAGES.find(p => p.key == urlParams.get("page")) ?? PAGES[0]


    const [page, setPage] = useState<Page>(defaultPage);
    return (
        <PageContext.Provider value={{ page, setPage }}>
            {children}
        </PageContext.Provider>
    );
};

const pageContextGetter = () => {
    const context = useContext(PageContext);
    if (!context) throw new Error("usePage must be used within a PageProvider");
    return context;
};

export const usePage = () => {
    const context = pageContextGetter();
    const setPage = (page: Page) => {
        context.setPage(page)
        const url = new URL(window.location.href);
        url.searchParams.set("page", page.key);
        window.history.pushState({}, "", url.toString());
    }

    return {setPage, page: context.page}
}
