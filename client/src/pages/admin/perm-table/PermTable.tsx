import { Permission } from "@shared/schemas/API";
import { JSX, useEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import z from 'zod';
import { fetchAPIJSON } from "../../../API";
import NewPerm from "./NewPerm";
import PermRow from "./PermRow";

function PermTable() {
    const [permRows, setPermRows] = useState<JSX.Element[]>([])

    const reloadData = () => {
        fetchAPIJSON("/admin/getPerms").then((res) => {
            const body = z.array(Permission).safeParse(res)

            if (body.success && body.data) {
                setPermRows([
                    ...body.data.map((p, pi) => <PermRow key={pi} perm={p} reload={reloadData} />),
                    <NewPerm key={-1} reload={reloadData} />
                ])
            }
        })
    }

    useEffect(reloadData, [])

    return permRows.length == 0 ? (
        <Spinner style={{ fontSize: "30px" }}></Spinner>
    ) : (
        <div className="table-responsive">
            <Table className="rounded-3 overflow-hidden" style={{ marginBottom: 0 }}>
            <thead>
                <tr>
                    <td>ID</td>
                    <td>Name</td>
                    <td>Blacklist</td>
                    <td />
                </tr>
            </thead>
                <tbody>
                    {permRows}
                </tbody>
            </Table>
        </div>
    )
}

export default PermTable;