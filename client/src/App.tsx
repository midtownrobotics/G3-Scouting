import { Container, Nav, Navbar } from "react-bootstrap";
import { PAGES, usePage } from "./pageContext";
import "./App.css"

function App() {
    const { page, setPage } = usePage();

    return (
        <div>
            <Navbar expand="lg" id="navbar">
                <Container>
                    <Navbar.Brand id="navbar-brand" onClick={() => setPage(PAGES[0])}>G3 Scout-o-matic</Navbar.Brand>
                    <Navbar.Toggle aria-controls="main-navbar" />
                    <Navbar.Collapse id="main-navbar">
                        <Nav className="ms-auto">
                            <Nav.Item>
                                <Nav.Link onClick={() => setPage(PAGES[0])}>Home</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <main>
                {page.component}
            </main>
            <footer>
                <br />
                <h5>Developed by Gray Jackson-Noell.</h5>
                <br />
            </footer>
        </div>
    );
}

export default App;
