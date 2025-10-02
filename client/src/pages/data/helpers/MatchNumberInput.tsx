import { useEffect, useState } from "react";
import { FormControl, InputGroup } from "react-bootstrap";

type MatchNumberInputProps = {
    onChange: (number: number) => void;
    queryKey?: string;
};

export default function MatchNumberInput({ onChange, queryKey = "match" }: MatchNumberInputProps) {
    const [val, setVal] = useState<string>("");

    const saveToUrl = (v: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set(queryKey, v.toString());
        window.history.pushState({}, "", url.toString());
    }

    useEffect(() => {
        const match = new URLSearchParams(window.location.search).get(queryKey);
        if (match && !Number.isNaN(parseInt(match))) {
            onChange(parseInt(match));
            setVal(match);
        }
    }, []);

    const handleChange = (v: string) => {
        setVal(v);

        if (!Number.isNaN(parseInt(v))) {
            onChange(parseInt(v));
            saveToUrl(parseInt(v));
        }
    };

    return (
        <div className="mb-3" style={{ position: "relative", maxWidth: "300px" }}>
            <InputGroup className="mb-0">
                <FormControl
                    placeholder="Match Number"
                    aria-label="Match Number"
                    value={val}
                    onChange={(e) => handleChange(e.target.value)}
                />
            </InputGroup>
        </div>
    );
}