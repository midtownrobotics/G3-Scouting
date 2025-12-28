import { Range as RangeComponent } from "@shared/forms/FormComponents";
import { useEffect } from "react";
import { Form } from "react-bootstrap";

export default function Range({
    component,
    onChange,
    value,
}: {
    component: RangeComponent;
    onChange: (id: string, value: string) => void;
    value: string;
}) {
    useEffect(() => {
        if (value === undefined || value === null) onChange(component.getId(), "0");
    }, [value]);

    // Generate tick marks based on min, max, and step
    const generateTicks = () => {
        if (!component.step) return [];
        const ticks = [];
        for (let i = component.min; i <= component.max; i += component.step) {
            ticks.push(i);
        }
        return ticks;
    };

    const ticks = generateTicks();

    return (
        <Form.Group className="my-3 w-75 mx-auto">
            <Form.Label>{component.question}</Form.Label>
            <div className="d-flex justify-content-center align-items-center gap-2">
                <Form.Range
                    className="text-center"
                    max={component.max}
                    min={component.min}
                    step={component.step}
                    value={value ?? 0}
                    onChange={(e) => onChange(component.getId(), (parseFloat(e.target.value) || 0).toString())}
                />
            </div>
            <div className="d-flex justify-content-between" style={{ marginTop: '8px' }}>
                {ticks.map((tick) => (
                    <span 
                        key={tick}
                        style={{ 
                            fontSize: '0.9rem',
                            color: parseFloat(value ?? "0") === tick ? '#0d6efd' : 'black',
                            fontWeight: 'bold'
                        }}
                    >
                        {tick}
                    </span>
                ))}
            </div>
        </Form.Group>
    );
}