import { morePages } from "@shared/types";
import { useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { usePage } from "../../pageManager";
import { useFullscreenStatus } from "../../utils";
import "./NavigationBar.css";
import NavPageLink from "./NavPageLink";

/** The site navigation bar. */
function NavigationBar() {
    const { setPageKey, pageKey } = usePage();
    const [expanded, setExpanded] = useState(false);

    const onclick = () => setExpanded(false);

    return (
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
    );
}

export default NavigationBar;