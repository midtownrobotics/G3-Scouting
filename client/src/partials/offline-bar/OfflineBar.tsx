import "./OfflineBar.css";

/** An orange bar that appears if the API becomes unavailable. */
function OfflineBar({ show }: { show: boolean }) {
    return (
        <div style={{ display: show ? "block" : "none" }}>
            {/* Remove fixed height spacer — not needed here */}
            <div id="offlineBar" className="position-fixed top-0 w-100 z-3 text-center">
                <p className="m-0 px-3 py-2">Cannot connect to API. Data <strong>WILL NOT</strong> save. Please check your internet connection.</p>
            </div>
            {/* Spacer div to prevent content from shifting */}
            <div style={{ height: "auto", minHeight: "48px" }} /> {/* fallback if JS doesn’t measure height */}
        </div>
    );
}

export default OfflineBar;