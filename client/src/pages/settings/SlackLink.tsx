import { useEffect, useState } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import { Clipboard, ClipboardCheck } from "react-bootstrap-icons";
import { z } from "zod";
import { fetchAPIJSON } from "../../API";

export default function SlackLink() {
    const [command, setCommand] = useState<string>();
    const [commandCopied, setCommandCopied] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(true)

    useEffect(() => {
        fetchAPIJSON("/slack/getLinkCode").then((res) => {
            const body = z.object({ code: z.string() }).safeParse(res);

            if (body.success && body.data) {
                setCommand("/link " + body.data.code);
            }
        });

        setTimeout(() => setBtnDisabled(false), 5000);
    }, []);

    const openSlack = () => {
        const slackUrl = "slack://open";
        window.location.href = slackUrl;
    };

    const copyCommand = () => {
        navigator.clipboard.writeText(command || "");
        setCommandCopied(true);
        setBtnDisabled(false);
    };

    return (
        <Card>
            <Card.Body>
                <div style={{ whiteSpace: "nowrap" }}>
                    <code>{command || <Spinner size="sm" />}</code>&nbsp;
                    {
                        commandCopied ?
                            <ClipboardCheck onClick={copyCommand} className="me-auto cursor-pointer" /> :
                            <Clipboard onClick={copyCommand} className="me-auto cursor-pointer" />
                    }
                </div>
                <p>
                    Paste this command into any slack channel and send it.
                </p>
                <Button variant="primary" onClick={openSlack} disabled={btnDisabled}>
                    Open Slack
                </Button>
            </Card.Body>
        </Card>
    );
}