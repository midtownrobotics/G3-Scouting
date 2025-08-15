import { useEffect, useState } from "react";
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { BoxArrowRight, Key, Slack, Trash } from "react-bootstrap-icons";
import { fetchAPIJSON, postAPI } from "../../API";
import SlackLink from "./SlackLink";
import { SlackData } from "@shared/schemas/user";

export default function Settings() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const linkSuccess = new URL(window.location.href).searchParams.has("linkSuccess");
    const [slackData, setSlackData] = useState<SlackData>();

    useEffect(() => {
        fetchAPIJSON("/slack/getSlackInfo", SlackData).then(res => {
            if (res) {
                setSlackData(res);
            }
        });
    }, []);

    const [passwordResetLoading, setPasswordResetLoading] = useState(false);
    const resetPassword = () => {
        setPasswordResetLoading(true);
        postAPI("/userSettings/resetPassword", { password: newPassword });
    };

    const [logoutLoading, setLogoutLoading] = useState(false);
    const logout = () => {
        setLogoutLoading(true);
        postAPI("/userSettings/logout", {});
    };

    const [sessionClearLoading, setSessionClearLoading] = useState(false);
    const clearSessions = () => {
        setSessionClearLoading(true);
        postAPI("/userSettings/sessionClear", {});
    };

    return (
        <Container className="mt-3" style={{ maxWidth: "600px" }}>
            <h2 className="mb-4 text-center">Account Settings</h2>

            {linkSuccess &&
                <Alert variant="info">Slack account linked succesfully!</Alert>
            }

            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Card.Title>
                        <Slack className="me-2" />
                        Slack Account&nbsp;
                        {slackData &&
                            <img
                                src={slackData?.profile.image_24}
                                alt="new"
                            />
                        }
                    </Card.Title>
                    {slackData ? (
                        <div>
                            <span>Slack account with email "{slackData.profile.email}" linked!</span>
                            <br />
                            <span>Slack ID: {slackData.id}</span>
                        </div>
                    ) : (
                        <div>
                            <p className="text-muted mb-2">Link your Slack to receive notifications and quick-access features.</p>
                            <SlackLink />
                        </div>
                    )}
                </Card.Body>
            </Card>

            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Card.Title><Key className="me-2" />Reset Password</Card.Title>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                            />
                        </Form.Group>
                        <Button
                            style={{ width: "160px" }}
                            variant="primary"
                            onClick={resetPassword}
                            disabled={!newPassword || newPassword !== confirmPassword || passwordResetLoading}
                        >
                            {passwordResetLoading ? <Spinner size="sm" /> : "Update Password"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>

            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Card.Title><Trash className="me-2" />Remove All Sessions</Card.Title>
                    <p className="text-muted mb-2">Log out from all devices where you’re currently signed in.</p>
                    <Button disabled={sessionClearLoading} onClick={clearSessions} variant="danger">
                        {sessionClearLoading ? <Spinner size="sm" /> : "Remove All Sessions"}
                    </Button>
                </Card.Body>
            </Card>

            <Card className="shadow-sm">
                <Card.Body className="text-center">
                    <Button disabled={logoutLoading} onClick={logout} variant="secondary">
                        {logoutLoading ? <Spinner size="sm" /> :
                            <>
                                <BoxArrowRight className="me-2" />
                                Log Out
                            </>
                        }
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );
}