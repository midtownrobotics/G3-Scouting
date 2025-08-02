import { SectionBreak as SectionBreakComponent } from "@shared/forms/FormComponents";

export default function SectionBreak({ component }: { component: SectionBreakComponent }) {
    return (
        <div className="my-4 mb-0">
            <hr />
            <h3>{component.title}</h3>
        </div>
    );
}
