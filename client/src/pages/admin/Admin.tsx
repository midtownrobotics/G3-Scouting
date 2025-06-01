import "./Admin.css";
import PermTable from "./perm-table/PermTable";
import SaveableTextInput from "./SaveableTextInput";
import Scheduler from "./scheduler/Scheduler";
import UserTable from "./user-table/UserTable";

function Admin() {
    return (
        <div id="admin-page">
            <h1 id="head">Admin</h1>
            <hr />
            <div id="users-and-perms">
                <div id="users-table">
                    <h2>Users</h2>
                    <UserTable />
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
                                <SaveableTextInput get={"/admin/getDayNumber"} post={"/admin/setDayNumber"}>Day Number</SaveableTextInput>
                            </td>
                            <td>
                                <SaveableTextInput get={"/admin/getEventKey"} post={"/admin/setEventKey"}>Event Key</SaveableTextInput>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <SaveableTextInput get={"/admin/getTbaToken"} post={"/admin/setTbaToken"}>TBA Token</SaveableTextInput>
                            </td>
                            <td>
                                <SaveableTextInput get={"/admin/getSlackToken"} post={"/admin/setSlackToken"}>Slack Token</SaveableTextInput>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <hr />

            <Scheduler />

            <hr />
        </div>
    )
}

export default Admin;