import { CreateUser, SimpleUser } from "@shared/schemas/user"
import { useState } from "react"
import { Floppy, Pencil, Trash } from "react-bootstrap-icons"
import EditableCell, { EditablePermissionCell } from "../EditableCell"
import { postAPI } from "../../../API"

function UserRow({ user, reload }: { user: SimpleUser, reload: () => void }) {
    const [editing, setEditing] = useState(false)
    const [editedUser, setUser] = useState<Partial<CreateUser>>(user)

    const [password, setPassword] = useState<string>();

    const remove = () => {
        postAPI("/admin/deleteUser", {id: user.id}).then(() => {
            reload()
        })
    }

    const saveUser = () => {
        const result = SimpleUser.safeParse(editedUser);
        if (result.success) {
            postAPI("/admin/editUser", result.data).then((res) => {
                if (res?.status != 200) {
                    setEditing(true);
                    alert("User could not save. Permission is likely the issue.")
                } else {
                    if (password !== undefined && password !== "") {
                        postAPI("/admin/setUserPassword", { password, id: user.id }).then((res) => {
                            if (res?.status != 200) alert("Couldn't set user password.");
                        })
                        setPassword(undefined);
                    }
                    
                    setEditing(false)
                    reload();
                }
            })
        } else {
            if (result.error.errors[0].code == "invalid_type") {
                console.log(result.error.errors[0].message)
                alert("Expected " + result.error.errors[0].expected + " in " + result.error.errors[0].path[0] + ".")
            }
        }
    }

    const setUserProp = (val: string | boolean, prop: keyof SimpleUser) => {
        if (typeof val == "string") val = val.trim()
        setUser({ ...editedUser, [prop]: val })
    }

    return (
        <tr>
            <td>{user.id}</td>
            <EditableCell isEditing={editing} onchange={(v) => setUserProp(v, "username")}>{editedUser.username}</EditableCell>
            <EditableCell isEditing={editing} onchange={(v) => setUserProp(v, "displayName")}>{editedUser.displayName ?? ""}</EditableCell>
            <EditableCell isEditing={editing} onchange={(v) => setPassword(String(v))}>{password}</EditableCell>
            {/* <EditableCell isEditing={editing} onchange={(v) => setUserProp(v, "permission")}>{editedUser.permission}</EditableCell> */}
            <EditablePermissionCell isEditing={editing} onChange={v => setUserProp(v, "permission")}>{editedUser.permission}</EditablePermissionCell>
            {/* <EditableCell isEditing={editing} onchange={(v) => setUserProp(v, "reliable")} checkbox>{editedUser.reliable}</EditableCell> */}
            <EditableCell isEditing={editing} onchange={(v) => setUserProp(v, "redAlliance")} checkbox>{editedUser.redAlliance}</EditableCell>
            <td>
                <input type="checkbox" checked={user.slackLinked} />
                </td>
            <td onClick={() => editing ? saveUser() : setEditing(true)}>
                {editing ? <Floppy /> : <Pencil />}
            </td>
            <td onClick={remove}>
                <Trash />
            </td>
        </tr>
    )
}

export default UserRow