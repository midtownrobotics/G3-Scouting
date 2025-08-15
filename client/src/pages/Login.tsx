import { useState } from "react";
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { postAPI } from "../API";
import { useUserData } from "../userData";

function Login() {
    const { apiStatusRefresh } = useUserData();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await postAPI("/login", {
                username,
                password
            });

            if (res?.status === 200) {
                await apiStatusRefresh();
            } else {
                setError("Invalid credentials.");
            }
        } catch (err) {
            setError("Invalid credentials or server error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="login-page">
            <Container className="d-flex justify-content-center align-items-center w-50">
                <Card style={{ minWidth: "350px" }} className="shadow p-4">
                    <Card.Title className="text-center mb-3">Login</Card.Title>
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Button type="submit" variant="primary" disabled={loading} className="w-100">
                            {loading ? <Spinner size="sm" animation="border" /> : "Login"}
                        </Button>
                    </Form>
                </Card>
            </Container>
        </div>
    );
}

export default Login;