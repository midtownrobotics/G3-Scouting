import { SimpleUserSchema } from "@shared/schemas/API";
import { JSX, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import z from 'zod';
import { fetchAPIJSON } from "../../../API";
import NewUser from "./NewUser";
import UserRow from "./UserRow";

function UserTable() {
    const [userRows, setUserRows] = useState<JSX.Element[]>([])

    const reloadData = () => {
        fetchAPIJSON("/admin/getUsers").then((res) => {
            const body = z.array(SimpleUserSchema).safeParse(res)

            if (body.success && body.data) {
                setUserRows([
                    ...body.data.map((user) => <UserRow user={user} reload={reloadData} />),
                    <NewUser reload={reloadData} />
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
                    <td>Username</td>
                    <td>Password</td>
                    <td>PID</td>
                    <td>Reliable</td>
                    <td colSpan={2} />
                </tr>
            </thead>
            <tbody>
                {userRows}
            </tbody>
        </Table>
    )
}

export default UserTable;