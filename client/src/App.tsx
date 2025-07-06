import "./App.css";
import NavigationBar from "./partials/nav/NavigationBar";
import { getPageFromKey, usePage } from "./pageManager";
import OfflineBar from "./partials/offline-bar/OfflineBar";

function App() {
    const { pageKey, pageInstance } = usePage();

    return (
        <div>
            <OfflineBar />
            <NavigationBar />
            <main key={`${pageKey}-${pageInstance}`}>
                {getPageFromKey(pageKey)}
            </main>
            <footer>
                <br />
                <h5>Made by Gray Jackson-Noell</h5>
                <br />
            </footer>
        </div>
    );
}

export default App;
