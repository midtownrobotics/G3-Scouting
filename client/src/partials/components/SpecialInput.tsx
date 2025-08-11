import { Form } from "react-bootstrap";

export default function SpecialInput({
    value,
    setter,
    children
}: {
    value?: number,
    setter?: (value: number) => void
    children: string;
}) {

    const onChange = (v: string) => {
        console.log(value)
        if (setter === undefined) return;
        
        const parsed = parseInt(v, 10);
        if (!isNaN(parsed)) {
            setter(parsed);
        } else {
            setter(0);
        }
    }

    return (
        <Form.Group className="my-3">
            <Form.Label>{children}</Form.Label>
            <Form.Control
                className="w-100 mx-auto text-center"
                style={{ maxWidth: "150px" }}
                type="text"
                value={value || ""}
                disabled={setter === undefined}
                onChange={e => onChange(e.target.value)}
            />
        </Form.Group>
    );
}
