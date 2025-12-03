import "./App.css";
import { getPageFromKey, usePage } from "./pageManager";
import Login from "./pages/Login";
import Footer from "./partials/Footer";
import NavigationBar from "./partials/nav/NavigationBar";
import OfflineBar from "./partials/offline-bar/OfflineBar";
import { useUserData } from "./userData";
import { Alert } from "react-bootstrap";
import Docs from "./Docs";

function App() {
    const { pageKey, pageInstance } = usePage();
    const { apiConnection, loggedIn, userData } = useUserData();

    if (window.location.pathname.includes("/docs")) {
        return <Docs />
    }

    const mostRecentNotification = userData?.notifications.filter(n => n.expiresAt > Date.now()).sort((a, b) => b.sentAt - a.sentAt).sort((a, b) => b.priority - a.priority)[0];

    return (
        <div className="d-flex flex-column min-vh-100">
            <OfflineBar show={!apiConnection && loggedIn} />
            <NavigationBar />

            {mostRecentNotification && <Alert
                id="notificationBar"
                variant="dark"
                style={{ maxWidth: "85%", marginBottom: "5px" }}
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
