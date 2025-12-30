import { morePages } from "@shared/types";
import { useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { usePage } from "../../pageManager";
import { useFullscreenStatus } from "../../Utils";
import "./NavigationBar.css";
import NavPageLink from "./NavPageLink";

/** The site navigation bar. */
function NavigationBar() {
    const { setPageKey, pageKey } = usePage();
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const onclick = () => setExpanded(false);

    const copyClick = async () => {
        setCopied(true);
        const url = window.location.href;
        await navigator.clipboard.writeText(url);
        setTimeout(() => setCopied(false), 750);
    }

    return (
        <div>
            <Navbar
                hidden={useFullscreenStatus()}
                expanded={expanded}
                expand="lg"
                id="navbar"
                className="bg-light"
            >
                <Container>
                    <Navbar.Brand onClick={() => setPageKey("home")}>
                        <img
                            style={{ height: "30px", transform: "translateY(-7px)" }}
                            src="https://images.squarespace-cdn.com/content/v1/56a5169805caa73d80ad787a/079ee4f1-7efb-45c3-bfb1-cd280cea67b9/Midtown+G3+Team+1648+-+Full+Color+%28Dark+ver.%29.png?format=1500w"
                        />
                        <span style={{ fontSize: "30px" }}>Scout-o-matic</span>
                    </Navbar.Brand>

                    <Navbar.Toggle
                        aria-controls="main-navbar"
                        onClick={() => setExpanded(!expanded)}
                    />

                    {/* <h6
                        title="Copy link to current page."
                        onClick={copyClick}
                        className="cursor-pointer mt-3 ms-1"
                    >{copied ? <CopyCheck /> : <CopyIcon />}</h6> */}

                    <Navbar.Collapse id="main-navbar">
                        <Nav className="ms-auto">
                            <NavPageLink page="home" onClick={onclick} />
                            <NavPageLink page="settings" onClick={onclick} />
                            <NavPageLink page="forms" onClick={onclick} />
                            <NavPageLink page="data" onClick={onclick} />
                            <NavPageLink page="lead" onClick={onclick} />
                            <NavPageLink page="admin" onClick={onclick} />
                            <NavPageLink page="game" onClick={onclick} />

                            <NavDropdown
                                id="more-dropdown"
                                title={"More"}
                                style={{ color: morePages.includes(pageKey) ? "black" : "white" }}
                            >
                                <NavPageLink page="form-maker" onClick={onclick} dropdown />
                                <NavPageLink page="shift-tracker" onClick={onclick} dropdown />
                                <NavPageLink page="scheduler" onClick={onclick} dropdown />
                                <NavPageLink page="pit-monitor" onClick={onclick} dropdown />
                                <NavPageLink page="battery-manager" onClick={onclick} dropdown />
                                <NavPageLink page="profiles" onClick={onclick} dropdown />
                                <NavPageLink page="bookie" onClick={onclick} dropdown />
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default NavigationBar;