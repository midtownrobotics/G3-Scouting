import "./Admin.css";
import SaveableTextInput from "./SaveableTextInput";
import UserTable from "./user-table/UserTable";
import { Container, Row, Col } from "react-bootstrap";
import { DocsLink } from "../../Utils";

function Admin() {
  return (
    <Container id="admin-page" fluid="md" className="py-4">
      <h1 id="head" className="text-center mb-3">Admin</h1>
      <hr />

      <section id="users" className="my-4">
        <DocsLink link="/docs/admin.md#users">
          <h2 className="my-0">Users</h2>
        </DocsLink>
        <UserTable />
      </section>

      <hr />

      <section id="settings" className="my-4">
        <DocsLink link="/docs/admin#settings">
          <h2 className="my-0">Settings</h2>
        </DocsLink>

        <Row className="gy-3 gx-4">
          <Col xs={12} md={6} lg={4}>
            <SaveableTextInput
              get="/admin/getSlackOathToken"
              post="/admin/setSlackOathToken"
            >
              Slack Oath Token
            </SaveableTextInput>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <SaveableTextInput
              get="/admin/getTeamNumber"
              post="/admin/setTeamNumber"
            >
              Team Number
            </SaveableTextInput>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <SaveableTextInput
              get="/admin/getTbaToken"
              post="/admin/setTbaToken"
            >
              TBA Token
            </SaveableTextInput>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <SaveableTextInput
              get="/admin/getNexusToken"
              post="/admin/setNexusToken"
            >
              Nexus Token
            </SaveableTextInput>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <SaveableTextInput
              get="/admin/getEventKey"
              post="/admin/setEventKey"
            >
              TBA Event Key
            </SaveableTextInput>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <SaveableTextInput
              get="/admin/getNexusEventKey"
              post="/admin/setNexusEventKey"
            >
              Nexus Event Key
            </SaveableTextInput>
          </Col>
        </Row>
      </section>
    </Container>
  );
}

export default Admin;
