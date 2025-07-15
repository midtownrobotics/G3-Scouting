import { useEffect, useState } from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";

export default function TeamNumberInput({ onSubmit, second }: { onSubmit: (value: number) => void, second?: boolean }) {
    const [value, setValue] = useState<number>();

    useEffect(() => {
        const team = new URLSearchParams(window.location.search).get(second ? "team2" : "team");
        if (team && !Number.isNaN(parseInt(team))) onSubmit(parseInt(team));
    }, []);

    useEffect(() => {
        if (Number.isNaN(value)) {
            setValue(0);
        }
    }, [value]);

    const placeholder = "Team Number";

    const handleSubmit = () => {
        if (value === undefined) return;
        onSubmit(value);

        const url = new URL(window.location.href);
        url.searchParams.set(second ? "team2" : "teame", value.toString() ?? "");
        window.history.pushState({}, "", url.toString());
    };

    return (
        <InputGroup className="mb-3" style={{ maxWidth: "300px" }}>
            <FormControl
                placeholder={placeholder}
                aria-label={placeholder}
                value={!value ? "" : value}
                onChange={(e) => setValue(parseInt(e.target.value))}
                onKeyDown={(e) => e.key == "Enter" && handleSubmit()}
            />
            <Button variant="primary" onClick={handleSubmit}>
                Submit
            </Button>
        </InputGroup>
    );
}