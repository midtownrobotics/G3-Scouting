import { Nav } from "react-bootstrap";
import { PageKey, usePage } from "../../pageManager";

function NavPageLink({ page, children }: { page: PageKey, children: string }) {
    const { setPageKey, pageKey } = usePage();
    
    return (
        <Nav.Item>
            <Nav.Link style={{ color: pageKey == page ? "black" : "gray" }} onClick={() => setPageKey(page)}>{children}</Nav.Link>
        </Nav.Item>
    )
}

export default NavPageLink;