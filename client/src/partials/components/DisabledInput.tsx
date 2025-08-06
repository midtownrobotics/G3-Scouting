import { Form } from "react-bootstrap";

export default function DisabledInput({
    val,
    children
}: {
    val?: string | number,
    children: string;
}) {
    return (
        <Form.Group className="my-3">
            <Form.Label>{children}</Form.Label>
            <Form.Control
                className="w-100 mx-auto text-center"
                style={{ maxWidth: "150px" }}
                type="text"
                value={val}
                disabled
            />
        </Form.Group>
    );
}
