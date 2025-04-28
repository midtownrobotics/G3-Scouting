import { useEffect, useState } from "react";
import "./OfflineBar.css"
import { getConnected } from "../../API";

/** An orange bar that appears if the API becomes unavalible. */
function OfflineBar() {
    const [isShown, setIsShown] = useState(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            setIsShown(await getConnected())
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div id="offlineBar" style={{display: isShown ? "block" : "none"}}>
            <p>You are offline.</p>
        </div>
    )
}

export default OfflineBar;