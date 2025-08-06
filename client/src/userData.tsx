import { PageKey } from "@shared/types";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchAPIJSON, getApiStatus } from "./API";
import { UserInformation } from "@shared/schemas/user";
import { getDisallowedPages } from "@shared/permissions";

const UserContext = createContext<{
    apiConnection: boolean;
    loggedIn: boolean;
    setLoggedIn: (v: boolean) => void;
    blacklist: PageKey[];
    userData: UserInformation | undefined;
}>({} as any);

export function UserDataProvider({ children }: { children: React.ReactNode; }) {
    const [apiConnection, setApiConnection] = useState(true);
    const [loggedIn, _setLoggedIn] = useState(true);
    const [blacklist, setBlacklist] = useState<PageKey[]>([]);
    const [userData, setUserData] = useState<UserInformation>();

    const reloadUserData = () => {
        fetchAPIJSON("/me").then(res => {
            const body = UserInformation.safeParse(res);
            if (!body.data && !body.success) return;

            setBlacklist(getDisallowedPages(body.data.user.permission));
            setUserData(body.data);
        });
    };
    useEffect(reloadUserData, []);

    const setLoggedIn = (val: boolean) => {
        reloadUserData();
        _setLoggedIn(val);
        val == false && setApiConnection(true);
    };

    async function apiStatusRefresh() {
        const apiStatus = await getApiStatus();
        setApiConnection(apiStatus.ok);
        setLoggedIn(apiStatus.statusCode !== 401);
    }

    useEffect(() => {
        apiStatusRefresh();
        const interval = setInterval(apiStatusRefresh, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <UserContext.Provider value={{ apiConnection, loggedIn, blacklist, userData, setLoggedIn }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserData = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("usePage must be used within a PageProvider");

    return { ...context };
};