import { PermissionSchema } from "@shared/schemas/API";
import { JSX, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import z from 'zod';
import { fetchAPIJSON } from "../../../API";
import NewPerm from "./NewPerm";
import PermRow from "./PermRow";

function PermTable() {
    const [userRows, setUserRows] = useState<JSX.Element[]>([])

    const reloadData = () => {
        fetchAPIJSON("/admin/getPerms").then((res) => {
            const body = z.array(PermissionSchema).safeParse(res)

            if (body.success && body.data) {
                setUserRows([
                    ...body.data.map((perm) => <PermRow perm={perm} reload={reloadData} />),
                    <NewPerm reload={reloadData} />
                ])
            }
        })
    }

    useEffect(reloadData, [])

    return (
        <Table className="rounded-3 overflow-hidden">
            <thead>
                <tr>
                    <td>ID</td>
                    <td>Name</td>
                    <td>Blacklist</td>
                    <td />
                </tr>
            </thead>
            <tbody>
                {userRows}
            </tbody>
        </Table>
    )
}

export default PermTable;