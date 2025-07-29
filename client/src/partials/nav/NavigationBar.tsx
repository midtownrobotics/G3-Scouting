import { PageKey } from "@shared/types";
import { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { usePage } from "../../pageManager";
import "./NavigationBar.css";
import NavPageLink from "./NavPageLink";

/** The site navigation bar. */
function NavigationBar({ blacklist }: { blacklist: PageKey[]; }) {
    const { setPageKey } = usePage();
    const [expanded, setExpanded] = useState(false);
    return (
        <Navbar expanded={expanded} expand="lg" id="navbar">
            <Container>
                <Navbar.Brand onClick={() => setPageKey("home")}>
                    <img style={{ height: "30px", transform: "translateY(-7px)" }} src="https://images.squarespace-cdn.com/content/v1/56a5169805caa73d80ad787a/079ee4f1-7efb-45c3-bfb1-cd280cea67b9/Midtown+G3+Team+1648+-+Full+Color+%28Dark+ver.%29.png?format=1500w" />
                    <span style={{ fontSize: "30px" }}>Scout-o-matic</span>
                </Navbar.Brand>
                <Navbar.Toggle
                    aria-controls="main-navbar"
                    onClick={() => setExpanded(!expanded)}
                />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto">
                        <NavPageLink page="home" onClick={() => setExpanded(false)} blacklist={blacklist} />
                        <NavPageLink page="settings" onClick={() => setExpanded(false)} blacklist={blacklist} />
                        <NavPageLink page="forms" onClick={() => setExpanded(false)} blacklist={blacklist} />
                        <NavPageLink page="data" onClick={() => setExpanded(false)} blacklist={blacklist} />
                        <NavPageLink page="lead" onClick={() => setExpanded(false)} blacklist={blacklist} />
                        <NavPageLink page="admin" onClick={() => setExpanded(false)} blacklist={blacklist} />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;