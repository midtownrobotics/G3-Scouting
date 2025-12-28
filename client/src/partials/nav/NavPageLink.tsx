import { Nav, NavDropdown } from "react-bootstrap";
import { usePage } from "../../pageManager";
import { PageKey } from "@shared/types";
import { useUserData } from "../../userData";

function NavPageLink({
    page,
    onClick,
    dropdown,
}: {
    page: PageKey;
    onClick: () => void;
    dropdown?: boolean;
}) {
    const { setPageKey, pageKey } = usePage();
    const { blacklist } = useUserData();

    const linkOnClick = () => {
        onClick();
        setPageKey(page);
    };

    const formatPageKey = (key: PageKey) => {
        return key
            .split("-")
            .map((s) => s[0].toUpperCase() + s.slice(1))
            .join(" ");
    };

    if (dropdown) {
        return (
            <NavDropdown.Item
                style={{ display: blacklist.includes(page) ? "none" : "block" }}
                onClick={linkOnClick}
            >
                {formatPageKey(page)}
            </NavDropdown.Item>
        );
    }

    return (
        <Nav.Item style={{ display: blacklist.includes(page) ? "none" : "block" }}>
            <Nav.Link
                style={{ color: pageKey === page ? "black" : "gray" }}
                onClick={linkOnClick}
            >
                {formatPageKey(page)}
            </Nav.Link>
        </Nav.Item>
    );
}

export default NavPageLink;