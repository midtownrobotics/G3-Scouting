import "./App.css";
import NavigationBar from "./partials/nav/NavigationBar";
import { getPageFromKey, usePage } from "./pageManager";
import OfflineBar from "./partials/offline-bar/OfflineBar";
import { useEffect, useState } from "react";
import { getApiStatus } from "./API";
import Login from "./pages/Login";

function App() {
    const { pageKey, pageInstance } = usePage();
    const [apiConnection, setApiConnection] = useState(true);
    const [loggedIn, setLoggedInState] = useState(true);

    const setLoggedIn = (val: boolean) => {
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
            <NavigationBar />

            <main className="flex-fill" key={`${pageKey}-${pageInstance}`}>
                {loggedIn ? getPageFromKey(pageKey) : <Login setLoggedIn={setLoggedIn} />}
            </main>

            <footer className="bg-light text-center py-3 mt-auto border-top">
                <h5>Made by Gray Jackson-Noell</h5>
                <h6>Featuring Woodward Theron Spivey</h6>
            </footer>
        </div>
    );
}

export default App;
