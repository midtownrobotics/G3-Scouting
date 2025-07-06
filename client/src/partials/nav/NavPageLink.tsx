import { Nav } from "react-bootstrap";
import { PageKey, usePage } from "../../pageManager";

function NavPageLink({ page, children, onClick }: { page: PageKey, children: string, onClick: () => void }) {
    const { setPageKey, pageKey } = usePage();

    const linkOnClick = () => {
        onClick();
        setPageKey(page);
    }
    
    return (
        <Nav.Item>
            <Nav.Link style={{ color: pageKey == page ? "black" : "gray" }} onClick={linkOnClick}>{children}</Nav.Link>
        </Nav.Item>
    )
}

export default NavPageLink;