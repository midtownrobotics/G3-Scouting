import "./OfflineBar.css";

/** An orange bar that appears if the API becomes unavalible. */
function OfflineBar({ show }: { show: boolean }) {
    return (
        <div id="offlineBar" style={{ display: show ? "block" : "none" }}>
            <p>Cannot connect to API. Data WILL NOT save. Please check your internet connection.</p>
        </div>
    )
}

export default OfflineBar;