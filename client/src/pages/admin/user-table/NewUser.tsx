import { CreateUser } from "@shared/schemas/user";
import { useState } from "react";
import { PlusCircle } from "react-bootstrap-icons";
import { postAPI } from "../../../API";
import EditableCell from "../EditableCell";
import { Permission } from "@shared/permissions";

const defaultUser: Partial<CreateUser> = { id: -1, redAlliance: true, permission: Permission.SCOUT };

function NewUser({ reload }: { reload: () => void; }) {
    const [user, setUser] = useState<Partial<CreateUser>>(defaultUser);
    const [editing, setEditing] = useState(true);

    const saveUser = () => {
        const result = CreateUser.safeParse(user);
        if (result.success) {
            setEditing(false);
            postAPI("/admin/addUser", result.data).then((res) => {
                setEditing(true);
                if (res?.status != 200) {
                    return alert("User not saved. Check user permission and API connectivity.");
                };
                reload();
                setUser(defaultUser);
            });
            setUser(result.data);
        } else {
            setEditing(true);
            if (result.error.errors[0].code == "invalid_type") {
                alert(user.permission)
                alert("Expected " + (result.error.errors[0] as any).expected + " in " + result.error.errors[0].path[0] + ".");
            }
        }
    };

    const setUserProp = (val: string | boolean, prop: keyof CreateUser) => {
        if (typeof val == "string") val = val.trim();
        setUser({ ...user, [prop]: val });
    };

    return (
        <tr>
            <td />
            <EditableCell submit={saveUser} isEditing={editing} onchange={(v) => setUserProp(v, "username")}>{user.username}</EditableCell>
            <EditableCell submit={saveUser} isEditing={editing} onchange={(v) => setUserProp(v, "password")}>{user.password}</EditableCell>
            <EditableCell submit={saveUser} isEditing={editing} onchange={(v) => setUserProp(v, "permission")}>SCOUT</EditableCell>
            <EditableCell submit={saveUser} isEditing={editing} onchange={(v) => setUserProp(v, "reliable")} checkbox>{user?.reliable ?? false}</EditableCell>
            <td />
            <td onClick={() => saveUser()}>
                <PlusCircle />
            </td>
            <td />
        </tr>
    );
}

export default NewUser;