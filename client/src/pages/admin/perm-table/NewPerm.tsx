import { Permission } from "@shared/schemas/API"
import { useState } from "react"
import { PlusCircle } from "react-bootstrap-icons"
import { postAPI } from "../../../API"
import EditableCell from "../EditableCell"

function NewPerm({ reload }: { reload: () => void }) {
    // id initalized as -1 because id field is auto incremented by sequelize
    const [perm, setPerm] = useState<{ [key: string]: any }>({ id: -1 })
    const [editing, setEditing] = useState(true);

    const savePerm = () => {
        const result = Permission.safeParse(perm);
        if (result.success) {
            setEditing(false);
            postAPI("/admin/addPerm", result.data).then((res) => {
                if (res?.status != 200) setEditing(true);
                if (res?.status == 200) reload();
            })
            setPerm(result.data)
        } else {
            setEditing(true);
            if (result.error.errors[0].code == "invalid_type") {
                alert("Expected " + (result.error.errors[0] as any).expected + " in " + result.error.errors[0].path[0] + ".")
            }
        }
    }

    const setPermProp = (val: string | boolean, prop: keyof Permission) => {
        let newVal: string | boolean | string[] = val;
        if (typeof val == "string") val = val.trim()
        if (prop === "blacklist" && typeof val === "string") {
            newVal = val
                .replace("[", "")
                .replace("]", "")
                .split(",")
                .map(s => s.trim())
        }        
        
        setPerm({ ...perm, [prop]: newVal })
    }

    return (
        <tr>
            <td></td>
            <EditableCell submit={savePerm} isEditing={editing} onchange={(v) => setPermProp(v, "name")} />
            <EditableCell submit={savePerm} isEditing={editing} onchange={(v) => setPermProp(v, "blacklist")} />
            <td onClick={() => savePerm()}>
                <PlusCircle />
            </td>
        </tr>
    )
}

export default NewPerm