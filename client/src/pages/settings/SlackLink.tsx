import { useEffect, useState } from "react";
import { Button, Card, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { Clipboard, ClipboardCheck } from "react-bootstrap-icons";
import { z } from "zod";
import { fetchAPIJSON } from "../../API";

export default function SlackLink() {
    const [command, setCommand] = useState<string>();
    const [commandCopied, setCommandCopied] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(true);

    useEffect(() => {
        fetchAPIJSON("/slack/getLinkCode", z.object({
            code: z.string()
        })).then((res) => {
            if (res) {
                setCommand("/link " + res.code);
            }
        });
    }, []);

    const openSlack = () => {
        window.location.href = "slack://open";
        window.open("https://slack.com/workspace-signin");
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
                    Click to copy then paste this command into any slack channel and send it to link your account.
                </p>
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-top">Hello, I'm a tooltip!</Tooltip>}
                >
                    <Button
                        variant="primary"
                        onClick={openSlack}
                        disabled={btnDisabled}
                    >
                        Open Slack
                    </Button>
                </OverlayTrigger>
            </Card.Body>
        </Card>
    );
};