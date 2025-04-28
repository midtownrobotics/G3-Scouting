import "./App.css";
import NavigationBar from "./partials/nav/NavigationBar";
import { getPageFromKey, usePage } from "./pageManager";
import OfflineBar from "./partials/offline-bar/OfflineBar";

function App() {
    const { pageKey } = usePage();

    return (
        <div>
            <OfflineBar />
            <NavigationBar />
            <main>
                {getPageFromKey(pageKey)}
            </main>
            <footer>
                <br />
                <h5>Developed by Gray Jackson-Noell.</h5>
                <br />
            </footer>
        </div>
    );
}

export default App;
