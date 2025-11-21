export default function Footer() {
    return (
        <footer className="bg-light text-center mt-auto border-top">
            <h5>Made by Gray Jackson-Noell</h5>
            <h6 className="mb-2"><a href="/docs" target="_blank">Docs</a> | <a href="/?page=info">BoyleBucks Disclaimer</a> | <a href="https://github.com/midtownrobotics/G3-Scouting/" target="_blank">GitHub</a></h6>
            <h6 className="mb-1">Parts of this site are powered by:</h6>

            <div className="d-flex justify-content-center row-gap-1 column-gap-4 flex-wrap mb-0">
                <a
                    href="https://www.thebluealliance.com/apidocs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex align-items-center text-decoration-none text-dark gap-2"
                >
                    <div
                        style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: "#1976D2", // TBA blue
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <img
                            src="https://www.thebluealliance.com/images/tba_lamp.svg"
                            alt="The Blue Alliance"
                            style={{ width: "18px", height: "18px" }}
                        />
                    </div>
                    <span>The Blue Alliance</span>
                </a>


                <a
                    href="https://frc.nexus/api/v1/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex align-items-center text-decoration-none text-dark gap-2"
                >
                    <img
                        src="https://frc.nexus/en/assets/images/icon.svg"
                        alt="Nexus"
                        style={{ width: "28px", height: "28px" }}
                    />
                    <span>Nexus</span>
                </a>

                <a
                    href="https://www.statbotics.io/docs/rest"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex align-items-center text-decoration-none text-dark gap-2"
                >
                    <img
                        src="https://cdn.buymeacoffee.com/uploads/profile_pictures/2023/01/4FS0P9GD8A4HdLov.png@300w_0e.webp"
                        alt="Statbotics"
                        style={{ width: "28px", height: "28px", borderRadius: "6px" }}
                    />
                    <span>Statbotics</span>
                </a>
            </div>
        </footer>
    );
}