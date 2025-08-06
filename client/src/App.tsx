import "./App.css";
import { getPageFromKey, usePage } from "./pageManager";
import Login from "./pages/Login";
import NavigationBar from "./partials/nav/NavigationBar";
import OfflineBar from "./partials/offline-bar/OfflineBar";
import { useUserData } from "./userData";

function App() {
    const { pageKey, pageInstance } = usePage();
    const { apiConnection, loggedIn } = useUserData();

    return (
        <div className="d-flex flex-column min-vh-100">
            <OfflineBar show={!apiConnection && loggedIn} />
            <NavigationBar />

            <main className="flex-fill" key={`${pageKey}-${pageInstance}`}>
                {loggedIn ? getPageFromKey(pageKey) : <Login />}
            </main>

            <footer className="bg-light text-center py-3 mt-auto border-top">
                <h5>Made by Gray Jackson-Noell</h5>
            </footer>
        </div>
    );
}

export default App;
