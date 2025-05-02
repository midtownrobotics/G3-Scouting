import { Permission } from "@shared/schemas/API"
import { Trash } from "react-bootstrap-icons"
import { postAPI } from "../../../API"

function PermRow({ perm, reload }: { perm: Permission, reload: () => void }) {

    const remove = () => {
        postAPI("/admin/deletePerm", {id: perm.id}).then(() => {
            reload()
        })
    }

    return (
        <tr>
            <td>{perm.id}</td>
            <td>{perm.name}</td>
            <td>{perm.blacklist.toString()}</td>
            <td onClick={remove}><Trash /></td>
        </tr>
    )
}

export default PermRow