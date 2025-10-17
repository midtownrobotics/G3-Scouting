import { DEV_API_URL } from "@shared/config";
import "./App.css";
import { getPageFromKey, usePage } from "./pageManager";
import Login from "./pages/Login";
import Footer from "./partials/Footer";
import NavigationBar from "./partials/nav/NavigationBar";
import OfflineBar from "./partials/offline-bar/OfflineBar";
import { useUserData } from "./userData";
import { Alert } from "react-bootstrap";

function App() {
    const { pageKey, pageInstance } = usePage();
    const { apiConnection, loggedIn, userData } = useUserData();

    if (window.location.href.includes("/docs")) {
        const url = new URL(DEV_API_URL);
        const docsUrl = url.origin + "/docs";
        const ghDocs = "https://github.com/midtownrobotics/G3-Scouting/blob/V4.0/docs/home.md";
        return (
            <div className="text-center mx-4">
                <h1>Looks like you meant to go to the docs page!</h1>
                <h3>If you are hosting the site in dev mode, you need to visit the docs on the express server.</h3>
                <h4>Based on your config.ts they <b className="text-decoration-underline">may</b> be at <a href={docsUrl}>{docsUrl}</a>.</h4>
                <h4>You can also view them on <a href={ghDocs}>GitHub</a>.</h4>
                <br />
                <h4>Click <a href="/">here</a> to go back home.</h4>
            </div>
        )
    }

    const mostRecentNotification = userData?.notifications.filter(n => n.expiresAt > Date.now()).sort((a, b) => b.sentAt - a.sentAt).sort((a, b) => b.priority - a.priority)[0];

    return (
        <div className="d-flex flex-column min-vh-100">
            <OfflineBar show={!apiConnection && loggedIn} />
            <NavigationBar />

            {mostRecentNotification && <Alert
                variant="dark"
                style={{ maxWidth: "85%", marginBottom: "-10px" }}
                className="text-center w-auto mx-auto mt-2 py-2 px-4"
            >{mostRecentNotification.message}</Alert>}

            <main className="flex-fill" key={`${pageKey}-${pageInstance}`}>
                {loggedIn ? getPageFromKey(pageKey) : <Login />}
            </main>

            <Footer />
        </div>
    );
}

export default App;
