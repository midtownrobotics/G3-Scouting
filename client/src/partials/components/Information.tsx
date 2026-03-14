import { Information as InformationComponent } from "@shared/forms/FormComponents";

export default function Information({ component }: { component: InformationComponent }) {
    return (
        <div className="w-100 form-component">
            <h5
                className="mb-0 mt-3 mx-auto"
                style={{ maxWidth: "500px" }}
            >{component.text}</h5>
        </div>
    );
}
