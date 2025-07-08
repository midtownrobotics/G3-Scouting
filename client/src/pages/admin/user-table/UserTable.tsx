import { SimpleUser } from "@shared/schemas/API";
import { JSX, useEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import z from 'zod';
import { fetchAPIJSON } from "../../../API";
import NewUser from "./NewUser";
import UserRow from "./UserRow";

function UserTable({ setUsers }: { setUsers: (u: SimpleUser[]) => void }) {
    const [userRows, setUserRows] = useState<JSX.Element[]>([])

    const reloadData = () => {
        fetchAPIJSON("/admin/getUsers").then((res) => {
            const body = z.array(SimpleUser).safeParse(res)

            if (body.success && body.data) {
                setUsers(body.data)

                setUserRows([
                    ...body.data.map((u, ui) => <UserRow key={ui} user={u} reload={reloadData} />),
                    <NewUser key={-1} reload={reloadData} />
                ])
            }
        })
    }

    useEffect(reloadData, [])

    return userRows.length == 0 ? (
        <Spinner style={{fontSize: "30px"}}></Spinner>
    ) : (
        <Table className="rounded-3 overflow-hidden">
            <thead>
                <tr>
                    <td>ID</td>
                    <td>Username</td>
                    <td>Password</td>
                    <td>PID</td>
                    <td>Reliable</td>
                    <td>Alliance</td>
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