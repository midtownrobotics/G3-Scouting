import { Number as NumberComponent } from "@shared/forms/FormComponents";
import { useEffect } from "react";

export default function Number({
    component,
    onChange,
    value,
}: {
    component: NumberComponent;
    onChange: (id: number, value: string) => void;
    value: string;
}) {

    useEffect(() => {
        if (value === undefined || value === null) onChange(component.id, "0");
    }, [value])

    return (
        <div>
            <span>
                {component.question}
            </span>&nbsp;&nbsp;
            <input 
                type="number" 
                onChange={(e) => onChange(component.id, e.target.value)}
                value={value ?? 0}
            />
        </div>
    );
}