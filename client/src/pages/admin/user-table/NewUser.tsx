import { SimpleUser, SimpleUserSchema } from "@shared/schemas/API"
import { useState } from "react"
import { PlusCircle } from "react-bootstrap-icons"
import EditableCell from "../EditableCell"
import { postAPI } from "../../../API"

function NewUser({ reload }: { reload: () => void }) {
    // id initalized as -1 because id field is auto incremented by sequelize
    const [user, setUser] = useState<{ [key: string]: any }>({ id: -1 })
    const [editing, setEditing] = useState(true);

    const saveUser = () => {
        const result = SimpleUserSchema.safeParse(user);
        if (result.success) {
            setEditing(false);
            postAPI("/admin/addUser", result.data).then((res) => {
                if (res?.status != 200) return setEditing(true);
                reload();
            })
            setUser(result.data)
        } else {
            setEditing(true);
            if (result.error.errors[0].code == "invalid_type") {
                alert("Expected " + (result.error.errors[0] as any).expected + " in " + result.error.errors[0].path[0] + ".")
            }
        }
    }

    const setUserProp = (val: string | boolean, prop: keyof SimpleUser) => {
        if (typeof val == "string") val = val.trim()
        setUser({ ...user, [prop]: val })
    }

    return (
        <tr>
            <td></td>
            <EditableCell submit={saveUser} isEditing={editing} onchange={(v) => setUserProp(v, "username")} />
            <EditableCell submit={saveUser} isEditing={editing} onchange={(v) => setUserProp(v, "password")} />
            <EditableCell submit={saveUser} isEditing={editing} onchange={(v) => setUserProp(v, "permissionId")} />
            <EditableCell submit={saveUser} isEditing={editing} onchange={(v) => setUserProp(v, "reliable")} checkbox>{user?.reliable ?? false}</EditableCell>
            <td onClick={() => saveUser()}>
                <PlusCircle />
            </td>
            <td />
        </tr>
    )
}

export default NewUser