import { useState } from "react";
import { postAPI } from "../../API";
import { isPermission } from "@shared/permissions";
import { CreateUser } from "@shared/schemas/user";
import { DocsLink } from "../../utils";
import { Button, Form } from "react-bootstrap";

export function BulkUserAdd() {
    const [bulkUserAddText, setBulkUserAddText] = useState("");

    const bulkUserAdd = () => {
        const users = bulkUserAddText.split(/\r?\n/g)

        for (const [index, value] of users.entries()) {
            const userParts = value.split(",");
            const userUsername = userParts[0];
            const userNickname = userParts[1];
            const userPassword = userParts[2];
            const userPermission = userParts[3];

            if (!userUsername || userUsername.length == 0) {
                alert("Error parsing username on line " + (index + 1));
                return;
            };
            if (!isPermission(userPermission)) {
                alert("Error parsing permission on line " + (index + 1));
                return;
            };
            if (!userPassword || userPassword.length == 0) {
                alert("Error parsing password on line " + (index + 1));
                return;
            };
            if (!userNickname || userNickname.length == 0) {
                alert("Error parsing nickname on line " + (index + 1));
                return;
            };

            const user: CreateUser = {
                id: -1,
                username: userUsername,
                password: userPassword,
                permission: userPermission,
                displayName: userNickname,
                redAlliance: true,
                slackLinked: false,
                reliable: false,
                tokens: 0,
                xp: 0
            };
            postAPI("/admin/addUser", user);
        }

        alert("Bulk add success. Reload to see changes reflected in table.");
        setBulkUserAddText("");
    };

    return (
        <div>
            <Form.Control
                as="textarea"
                rows={3}
                value={bulkUserAddText}
                onChange={e => setBulkUserAddText(e.target.value)}
                className="mx-auto w-75"
                placeholder="[username1],[nickname1],[password1],[permission1]&#013;[username2],[nickname2],[password2],[permission2]&#013;..."
            />
            <Button className="mt-1" variant="success" style={{ width: "25%" }} onClick={bulkUserAdd}>Add</Button>
        </div>
    )
}