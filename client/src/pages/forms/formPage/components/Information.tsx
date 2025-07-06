import { Information as InformationComponent } from "@shared/forms/FormComponents";

export default function Information({ component }: { component: InformationComponent }) {
    return (
        <div>
            <h4>
                {component.text}
            </h4>
        </div>
    );
}