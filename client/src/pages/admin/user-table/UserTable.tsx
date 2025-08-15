import { SimpleUser } from "@shared/schemas/user";
import { JSX, useEffect, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import { fetchAPIJSON } from "../../../API";
import NewUser from "./NewUser";
import UserRow from "./UserRow";

function UserTable() {
    const [userRows, setUserRows] = useState<JSX.Element[]>([]);

    const reloadData = () => {
        setTimeout(() => {
            fetchAPIJSON("/admin/getUsers", SimpleUser.array()).then((res) => {
                if (res) {
                    setUserRows([
                        ...res.map((u, ui) => <UserRow key={ui} user={u} reload={reloadData} />),
                        <NewUser key={-1} reload={reloadData} />
                    ]);
                }
            });
        }, 500);
    };

    useEffect(reloadData, []);

    return userRows.length == 0 ? (
        <Spinner style={{ fontSize: "30px" }}></Spinner>
    ) : (
        <div id="users-table" className="table-responsive px-0 px-md-5 px-lg-5">
            <Table className="rounded-3 overflow-hidden" style={{ marginBottom: 0 }}>
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Username</td>
                        <td>Password</td>
                        <td>Permission</td>
                        <td>Reliable</td>
                        <td>Alliance</td>
                        <td colSpan={2} />
                    </tr>
                </thead>
                <tbody>
                    {userRows}
                </tbody>
            </Table>
        </div>
    );
}

export default UserTable;