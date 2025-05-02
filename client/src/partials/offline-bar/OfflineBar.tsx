import { useEffect, useState } from "react";
import "./OfflineBar.css"
import { getConnected } from "../../API";

/** An orange bar that appears if the API becomes unavalible. */
function OfflineBar() {
    const [isShown, setIsShown] = useState(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            const connected = !(await getConnected())
            setIsShown(connected)
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div id="offlineBar" style={{display: isShown ? "block" : "none"}}>
            <p>Cannot connect to API. Data WILL NOT save. Please check your internet connection.</p>
        </div>
    )
}

export default OfflineBar;