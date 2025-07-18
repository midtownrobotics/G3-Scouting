import formComponents, { FormComponent as FormComponentClass } from "@shared/forms/FormComponents";
import Information from "./Information";
import MultipleChoice from "./MultipleChoice";
import Number from "./Number";
import SectionBreak from "./SectionBreak";
import ShortResponse from "./ShortResponse";

function FormComponent({
    component,
    onAnswerChange,
    answer,
}: {
    component: FormComponentClass;
    onAnswerChange: (id: string, value: string) => void;
    answer: any;
}) {
    if (component instanceof formComponents.SectionBreak) {
        return <SectionBreak component={component} />;
    }

    if (component instanceof formComponents.Information) {
        return <Information component={component} />;
    }

    if (component instanceof formComponents.MultipleChoice) {
        return <MultipleChoice component={component} onChange={onAnswerChange} value={answer} />;
    }

    if (component instanceof formComponents.Number) {
        return <Number component={component} onChange={onAnswerChange} value={answer} />;
    }

    if (component instanceof formComponents.ShortResponse) {
        return <ShortResponse component={component} onChange={onAnswerChange} value={answer} />;
    }

    return <div>Unknown component type</div>;
}

export default FormComponent;
