export default function Info() {
    return (
        <div className="text-center">
            {/* <p>The G<sup>3</sup> scout-o-matic was created by  G<sup>3</sup> robotics: team 1648</p> */}

            <h4>BoyleBucks Disclaimer:</h4>
            <small>BoyleBucks are a virtual currency used only within the G3 Scout-o-matic platform. Players can use BoyleBucks to take part in fantasy-style prediction challenges based on match outcomes. Success in these challenges relies on player knowledge and strategy—not chance. BoyleBucks and any related digital items (such as skins or rewards) have no real-world monetary value and cannot be exchanged, sold, or redeemed for cash or goods outside the platform. All BoyleBucks features are designed purely for entertainment. G3 Scout-o-matic is not a form of gambling, and no real money is ever wagered. Participation is optional and meant for recreational use only.</small>

            <br />
            <br />

            <div>
                <h4 className="mb-1">Parts of this site are powered by:</h4>

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
            </div>
        </div>
    )
}