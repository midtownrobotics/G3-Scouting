import { SectionBreak as SectionBreakComponent } from "@shared/forms/FormComponents";

export default function SectionBreak({ component }: { component: SectionBreakComponent }) {
    return (
        <div>
            <hr />
            <h2>
                {component.title}
            </h2>
        </div>
    );
}