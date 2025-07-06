import { ShortResponse as ShortResponseComponent } from "@shared/forms/FormComponents";
import { useEffect } from "react";

export default function ShortResponse({
    component,
    onChange,
    value,
}: {
    component: ShortResponseComponent;
    onChange: (id: number, value: string) => void;
    value: string;
}) {

    useEffect(() => {
        if (value === undefined || value === null) onChange(component.id, "");
    }, [value])

    return (
        <div>
            <span>
                {component.question}
            </span>&nbsp;&nbsp;
            <input
                type="text"
                onChange={(e) => onChange(component.id, e.target.value)}
                value={value ?? ""}
            />
        </div>
    );
}