import { MultipleChoice as MultipleChoiceComponent } from "@shared/forms/FormComponents";
import { useEffect } from "react";

export default function MultipleChoice({
    component,
    onChange,
    value,
}: {
    component: MultipleChoiceComponent;
    onChange: (id: number, value: string) => void;
    value: string;
}) {

    useEffect(() => {
        if (value === undefined || value === null) onChange(component.id, component.choices[0]);
    }, [value])

    return (
        <div>
            <span>
                {component.question}
            </span>&nbsp;&nbsp;
            <select 
                onChange={(e) => onChange(component.id, e.target.value)}
                value={value ?? ""}
            >
                {
                    component.choices.map((c, ci) => <option key={ci} value={c}>{c}</option>)
                }
            </select>
        </div>
    );
}