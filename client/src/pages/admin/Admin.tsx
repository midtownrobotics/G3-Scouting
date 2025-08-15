import "./Admin.css";
import SaveableTextInput from "./SaveableTextInput";
import UserTable from "./user-table/UserTable";

function Admin() {
    return (
        <div id="admin-page">
            <h1 id="head">Admin</h1>
            <hr />

            <div id="users">
                <h2>Users</h2>
                <UserTable />
            </div>

            <hr />

            <div id="settings">
                <h2>Settings</h2>
                <table>
                    <tbody>
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
                        <tr>
                            <td>
                                <SaveableTextInput get={"/admin/getTbaToken"} post={"/admin/setTbaToken"}>TBA Token</SaveableTextInput>
                            </td>
                            <td>
                            </td>
                            <td>
                                <SaveableTextInput get={"/admin/getEventKey"} post={"/admin/setEventKey"}>Event Key</SaveableTextInput>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <hr />
        </div>
    );
}

export default Admin;