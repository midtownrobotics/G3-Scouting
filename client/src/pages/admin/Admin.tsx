import { SimpleUser } from "@shared/schemas/API";
import "./Admin.css";
import PermTable from "./perm-table/PermTable";
import SaveableTextInput from "./SaveableTextInput";
import Scheduler from "./scheduler/Scheduler";
import UserTable from "./user-table/UserTable";
import { useEffect, useState } from "react";
import { fetchAPIJSON } from "../../API";
import { z } from "zod";

function Admin() {
    const [users, setUsers] = useState<SimpleUser[]>([])

    useEffect(() => {
        fetchAPIJSON("/admin/getUsers").then(u => {
            const parsed = z.array(SimpleUser).safeParse(u)
            if (parsed.success && parsed.data) {
                setUsers(parsed.data)
            }
        })
    }, [])

    return (
        <div id="admin-page">
            <h1 id="head">Admin</h1>
            <hr />
            <div id="users-and-perms">
                <div id="users-table">
                    <h2>Users</h2>
                    <UserTable setUsers={setUsers} />
                </div>
                <div id="perms-table">
                    <h2>Permissions</h2>
                    <PermTable />
                </div>
            </div>

            <hr />

            <div id="settings">
                <h2>Settings</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <SaveableTextInput get={"/admin/getTbaToken"} post={"/admin/setTbaToken"}>TBA Token</SaveableTextInput>
                            </td>
                            <td>
                                <SaveableTextInput get={"/admin/getDayNumber"} post={"/admin/setDayNumber"}>Day Number</SaveableTextInput>
                            </td>
                            <td>
                                <SaveableTextInput get={"/admin/getEventKey"} post={"/admin/setEventKey"}>Event Key</SaveableTextInput>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <SaveableTextInput get={"/admin/getSlackClientSecret"} post={"/admin/setSlackClientSecret"}>Slack Client Secret</SaveableTextInput>
                            </td>
                            <td>
                                <SaveableTextInput get={"/admin/getSlackClientId"} post={"/admin/setSlackClientId"}>Slack Client ID</SaveableTextInput>
                            </td>
                            <td>
                                <SaveableTextInput get={"/admin/getSlackOathToken"} post={"/admin/setSlackOathToken"}>Slack Oath Token</SaveableTextInput>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <hr />

            <Scheduler users={users} />

            <hr />
        </div>
    )
}

export default Admin;