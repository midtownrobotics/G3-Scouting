import "./Admin.css";
import PermTable from "./perm-table/PermTable";
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
        </div>
    )
}

export default Admin;