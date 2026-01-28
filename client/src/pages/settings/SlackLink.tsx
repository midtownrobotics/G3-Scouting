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
        if (btnDisabled) return;
        setBtnDisabled(true);
        window.location.href = "slack://open";
        setTimeout(() => {
            window.open("https://slack.com/workspace-signin");
            setBtnDisabled(false);
        }, 2000);
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
                    Click the copy icon, paste into any slack channel, and send!
                </p>
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="tooltip-top">Copy the code first!</Tooltip>}
                    show={btnDisabled ? undefined : false}
                >
                    <Button
                        variant="primary"
                        onClick={openSlack}
                    >
                        Open Slack
                    </Button>
                </OverlayTrigger>
            </Card.Body>
        </Card>
    );
};