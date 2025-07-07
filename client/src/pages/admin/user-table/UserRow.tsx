import { SimpleUser } from "@shared/schemas/API"
import { useState } from "react"
import { Floppy, Pencil, Trash } from "react-bootstrap-icons"
import EditableCell from "../EditableCell"
import { postAPI } from "../../../API"

function UserRow({ user, reload }: { user: SimpleUser, reload: () => void }) {
    const [editing, setEditing] = useState(false)
    const [editedUser, setUser] = useState<{ [key: string]: any }>(user)

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
                    alert("User could not save. PID is likely the issue.")
                } else {
                    setEditing(false)
                    reload();
                }
            })
        } else {
            if (result.error.errors[0].code == "invalid_type") {
                alert("Expected " + (result.error.errors[0] as any).expected + " in " + result.error.errors[0].path[0] + ".")
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
            <EditableCell isEditing={editing} onchange={(v) => setUserProp(v, "password")}>{editedUser.password}</EditableCell>
            <EditableCell isEditing={editing} onchange={(v) => setUserProp(v, "permissionId")}>{editedUser.permissionId}</EditableCell>
            <EditableCell isEditing={editing} onchange={(v) => setUserProp(v, "reliable")} checkbox>{editedUser.reliable}</EditableCell>
            <EditableCell isEditing={editing} onchange={(v) => setUserProp(v, "redAlliance")} checkbox>{editedUser.redAlliance}</EditableCell>
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