import { Nav } from "react-bootstrap";
import { usePage } from "../../pageManager";
import { PageKey } from "@shared/types";

function NavPageLink({ page, blacklist, onClick }: { page: PageKey, blacklist: PageKey[], onClick: () => void }) {
    const { setPageKey, pageKey } = usePage();

    const linkOnClick = () => {
        onClick();
        setPageKey(page);
    }
    
    return (
        <Nav.Item style={{ display: blacklist.includes(page) ? "none" : "block" }}>
            <Nav.Link style={{ color: pageKey == page ? "black" : "gray" }} onClick={linkOnClick}>{page[0].toUpperCase() + page.slice(1)}</Nav.Link>
        </Nav.Item>
    )
}

export default NavPageLink;