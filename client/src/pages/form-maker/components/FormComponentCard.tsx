import formComponents, { FormComponent as FormComponentClass } from "@shared/forms/FormComponents";
import { Button, Card } from "react-bootstrap";


function FormComponentCard({
    component,
    deleteFn
}: {
    component: FormComponentClass,
    deleteFn: () => void;
}) {
    if (component instanceof formComponents.SectionBreak || component instanceof formComponents.PageBreak) {
        return <CardTemplate deleteFn={deleteFn} component={component} prop={"title"} color="success" />;
    }

    if (component instanceof formComponents.Information) {
        return <CardTemplate deleteFn={deleteFn} component={component} prop={"text"} color="warning" />;
    }

    return <CardTemplate deleteFn={deleteFn} component={component} prop={"name"} />;
    // return <div>Unknown component type</div>;
}

type Color = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | 'white';

function CardTemplate<T extends FormComponentClass>({
    component,
    prop,
    deleteFn,
    color
}: {
    component: T,
    prop: keyof T,
    deleteFn: () => void,
    color?: Color;
}) {
    const _color = color ?? "primary";

    return (
        <Card
            className={`bg-${_color}-subtle`}
            onContextMenu={(e) => {
                e.preventDefault();
                deleteFn();
            }}
        >
            <Card.Body className="p-2">
                <Card.Title>{String(component[prop])}</Card.Title>
            </Card.Body>
        </Card>
    );
}

<Button></Button>;

export default FormComponentCard;
