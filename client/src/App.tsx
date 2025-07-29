import "./App.css";
import NavigationBar from "./partials/nav/NavigationBar";
import { getPageFromKey, usePage } from "./pageManager";
import OfflineBar from "./partials/offline-bar/OfflineBar";
import { useEffect, useState } from "react";
import { fetchAPIJSON, getApiStatus } from "./API";
import Login from "./pages/Login";
import { getDisallowedPages } from "@shared/permissions";
import { UserInformation } from "@shared/schemas/API";
import { PageKey } from "@shared/types";

function App() {
    const { pageKey, pageInstance } = usePage();
    const [apiConnection, setApiConnection] = useState(true);
    const [loggedIn, setLoggedInState] = useState(true);
    const [blacklist, setBlacklist] = useState<PageKey[]>([]);

    const reloadBlacklist = () => {
        fetchAPIJSON("/me").then(res => {
            const body = UserInformation.safeParse(res);
            if (body.data && body.success) setBlacklist(getDisallowedPages(body.data.user.permission));
        });
    };
    useEffect(reloadBlacklist, []);

    const setLoggedIn = (val: boolean) => {
        reloadBlacklist();
        setLoggedInState(val);
        val == false && setApiConnection(true);
    };

    async function apiStatusRefresh() {
        const apiStatus = await getApiStatus();
        setApiConnection(apiStatus.ok);
        setLoggedIn(apiStatus.statusCode !== 401);
    }

    useEffect(() => {
        apiStatusRefresh();
        const interval = setInterval(apiStatusRefresh, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="d-flex flex-column min-vh-100">
            <OfflineBar show={!apiConnection && loggedIn} />
            <NavigationBar blacklist={blacklist} />

            <main className="flex-fill" key={`${pageKey}-${pageInstance}`}>
                {loggedIn ? getPageFromKey(pageKey) : <Login setLoggedIn={setLoggedIn} />}
            </main>

            <footer className="bg-light text-center py-3 mt-auto border-top">
                <h5>Made by Gray Jackson-Noell</h5>
            </footer>
        </div>
    );
}

export default App;
